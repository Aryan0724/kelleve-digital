<?php

namespace App\Services;

use App\Models\Bid;
use App\Models\Requirement;
use App\Models\User;
use App\Models\Project;
use App\Notifications\BidReceivedNotification;
use App\Notifications\BidAwardedNotification;
use Illuminate\Support\Facades\DB;

class BidService
{
    /**
     * Calculate the smart score for a bid based on vendor profile and bid details.
     */
    public function calculateSmartScore(int $vendorId, array $bidData): array
    {
        $vendor = User::with('vendorMetrics')->find($vendorId);
        
        // 1. Experience (30% -> Max 3.0)
        $experience = $bidData['experience_years'] ?? 0;
        $experience_score = min($experience * 0.3, 3.0);
        
        // 2. Rating (30% -> Max 3.0)
        $rating = $vendor->vendorMetrics->score ?? 0.0;
        $rating_score = ($rating / 5.0) * 3.0;
        
        // 3. Previous Projects (20% -> Max 2.0)
        $projects = $bidData['previous_projects_count'] ?? 0;
        $project_score = min($projects * 0.1, 2.0);
        
        // 4. Verification Level (20% -> Max 2.0)
        $levels = [
            'unverified' => 0.0,
            'mobile_verified' => 0.5,
            'identity_verified' => 1.0,
            'business_verified' => 1.5,
            'site_verified' => 2.0
        ];
        $verification_score = $levels[$vendor->verification_level] ?? 0.0;
        
        $total_score = min($experience_score + $rating_score + $project_score + $verification_score, 10.0);
        
        return [
            'experience_score' => round($experience_score, 1),
            'rating_score' => round($rating_score, 1),
            'project_score' => round($project_score, 1),
            'verification_score' => round($verification_score, 1),
            'total_score' => round($total_score, 1)
        ];
    }

    /**
     * Submit a new bid for a requirement.
     */
    public function submitBid(int $vendorId, array $data): Bid
    {
        $data['professional_id'] = $vendorId;
        if (isset($data['estimated_cost'])) {
            $data['amount'] = $data['estimated_cost'];
        }
        $scoreBreakdown = $this->calculateSmartScore($vendorId, $data);
        $data['smart_bid_score'] = $scoreBreakdown['total_score'];
        $data['status'] = 'pending';
        
        return DB::transaction(function () use ($data) {
            $bid = Bid::updateOrCreate(
                [
                    'requirement_id'   => $data['requirement_id'],
                    'professional_id'  => $data['professional_id'],
                ],
                $data
            );
            
            // Emit Event
            event(new \App\Events\BidSubmitted($bid));
            
            // Log to activity timeline
            DB::table('activity_logs')->insert([
                'subject_type' => $data['requirement_type_class'] ?? 'App\\Models\\Requirement',
                'subject_id' => $data['requirement_id'],
                'user_id' => $data['professional_id'],
                'event_type' => 'Bid Submitted',
                'description' => "A new bid was submitted by " . ($data['company_name'] ?? 'a professional') . ".",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // Notify Customer
            $modelClass = $data['requirement_type_class'] ?? 'App\\Models\\Requirement';
            $requirement = $modelClass::find($data['requirement_id']);
            if ($requirement && $requirement->user_id) {
                $customer = User::find($requirement->user_id);
                if ($customer) {
                    $customer->notify(new BidReceivedNotification([
                        'amount' => $data['amount'],
                        'vendor_name' => $data['company_name'] ?? 'A Professional',
                        'bid_id' => $bid->id,
                        'requirement_id' => $requirement->id
                    ]));
                }
            }

            // Update Requirement Status if it's open
            if ($requirement && $requirement->status === 'open') {
                if ($modelClass === 'App\\Models\\Requirement') {
                    $requirement->update(['status' => 'bidding']);
                } else if ($modelClass === 'App\\Models\\Rfq') {
                    $requirement->update(['status' => 'receiving_quotes']);
                } else if ($modelClass === 'App\\Models\\WorkerJob') {
                    $requirement->update(['status' => 'receiving_applications']);
                }
            }
            
            return $bid;
        });
    }

    /**
     * Shortlist a bid
     */
    public function shortlistBid(Bid $bid, User $customer): bool
    {
        return DB::transaction(function () use ($bid, $customer) {
            $bid->update(['status' => 'shortlisted']);
            
            $requirement = $bid->requirement;
            if ($requirement->status === 'open' || $requirement->status === 'bidding') {
                $requirement->update(['status' => 'shortlisted']);
            }
            
            // Notify Professional
            DB::table('notifications')->insert([
                'user_id' => $bid->professional_id,
                'type' => 'bid_shortlisted',
                'title' => 'Your Bid was Shortlisted!',
                'message' => "Your bid for {$requirement->title} has been shortlisted. Unlock the customer's contact to proceed.",
                'data' => json_encode(['bid_id' => $bid->id, 'requirement_id' => $requirement->id]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // Log Timeline
            DB::table('activity_logs')->insert([
                'subject_type' => $requirement->getMorphClass(),
                'subject_id' => $requirement->id,
                'user_id' => $customer->id,
                'event_type' => 'Bid Shortlisted',
                'description' => "Customer shortlisted a bid.",
                'properties' => json_encode(['bid_id' => $bid->id]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            return true;
        });
    }

    /**
     * Award the project to a bid
     */
    public function awardBid(Bid $bid, User $customer): bool
    {
        return DB::transaction(function () use ($bid, $customer) {
            $bid->update([
                'status' => 'accepted',
                'is_awarded' => true,
                'awarded_at' => now()
            ]);
            
            // Mark all other bids as rejected
            Bid::where('requirement_id', $bid->requirement_id)
                ->where('requirement_type', $bid->requirement_type)
                ->where('id', '!=', $bid->id)
                ->update(['status' => 'rejected']);
            
            $requirement = $bid->requirement;
            
            // Update the requirement model based on its type
            if ($requirement->getTable() === 'projects') {
                $requirement->update([
                    'status' => 'awarded',
                    'winning_bid_id' => $bid->id,
                    'professional_id' => $bid->professional_id,
                    'started_at' => now(),
                ]);
            } else if ($requirement->getTable() === 'rfqs') {
                $requirement->update([
                    'status' => 'awarded',
                    'winning_quote_id' => $bid->id,
                    'supplier_id' => $bid->professional_id,
                ]);
            } else if ($requirement->getTable() === 'worker_jobs') {
                $requirement->update([
                    'status' => 'awarded',
                    'winning_application_id' => $bid->id,
                    'worker_id' => $bid->professional_id,
                ]);
            }
            
            // 5. Create or retrieve Conversation (safe upsert to avoid unique constraint crashes)
            // The conversations table uses project_id (not polymorphic) after the Sprint 2 migration
            \App\Models\Conversation::updateOrCreate(
                [
                    'project_id'  => $requirement->id,
                    'customer_id' => $requirement->user_id,
                    'vendor_id'   => $bid->professional_id,
                ],
                [
                    'status'        => 'active',
                    'project_stage' => 'awarded',
                    'unlocked_at'   => now(),
                ]
            );
            
            // Notify Professional via Event
            event(new \App\Events\ProjectAwarded($requirement));
            
            $bid->professional->notify(new \App\Notifications\BidAwardedNotification([
                'title' => $requirement->title,
                'requirement_id' => $requirement->id,
            ]));
            
            // Log Timeline to new activity_logs
            DB::table('activity_logs')->insert([
                'user_id' => $customer->id,
                'subject_type' => $requirement->getMorphClass(),
                'subject_id' => $requirement->id,
                'event_type' => 'Project Awarded',
                'description' => "Customer awarded the project to " . ($bid->company_name ?? 'a professional') . ".",
                'properties' => json_encode(['bid_id' => $bid->id, 'project_id' => $requirement->id]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            return true;
        });
    }

    /**
     * Mark a requirement as completed
     */
    public function completeRequirement($requirement, User $customer): bool
    {
        return DB::transaction(function () use ($requirement, $customer) {
            // Update the requirement based on type
            if ($requirement instanceof \App\Models\Project || $requirement instanceof \App\Models\Requirement) {
                $requirement->update(['status' => 'completed', 'completed_at' => now()]);
            } else if ($requirement instanceof \App\Models\Rfq) {
                $requirement->update(['status' => 'fulfilled']);
            } else if ($requirement instanceof \App\Models\WorkerJob) {
                $requirement->update(['status' => 'completed']);
            }
            
            // Update the awarded bid
            $awardedBid = Bid::where('requirement_id', $requirement->id)
                ->where('requirement_type', class_basename($requirement))
                ->where('status', 'accepted')
                ->first();
                
            if ($awardedBid) {
                $awardedBid->update(['status' => 'completed']);
                
                // Update vendor metrics (projects completed)
                $vendorMetric = \App\Models\VendorMetric::firstOrCreate(
                    ['vendor_id' => $awardedBid->professional_id],
                    ['response_count' => 0, 'review_count' => 0, 'projects_completed' => 0]
                );
                $vendorMetric->increment('projects_completed');
                
                event(new \App\Events\ProjectCompleted($requirement));
            }
            
            // Log Timeline
            DB::table('activity_logs')->insert([
                'subject_type' => $requirement->getMorphClass(),
                'subject_id' => $requirement->id,
                'user_id' => $customer->id,
                'event_type' => 'Project Completed',
                'description' => "Customer marked the project as completed.",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            return true;
        });
    }
}
