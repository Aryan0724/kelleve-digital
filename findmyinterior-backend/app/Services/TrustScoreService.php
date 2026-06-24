<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserDocument;

class TrustScoreService
{
    /**
     * Recalculate Profile Completion Score and Verification Level for a User.
     * This will also automatically calculate the overall Trust Score.
     */
    public function recalculateForUser(User $user): void
    {
        // 1. Calculate Profile Completion Score
        $completionScore = $this->calculateProfileCompletion($user);
        
        // 2. Determine Verification Level
        $verificationLevel = $this->determineVerificationLevel($user);

        // 3. Calculate Trust Score
        // (Profile Completion = 25%, Verification Level = 25%, Reviews = 25%, Project Success = 25%)
        $trustScore = $this->calculateTrustScore($user, $completionScore, $verificationLevel);

        $user->update([
            'profile_completion_score' => $completionScore,
            'verification_level' => $verificationLevel,
            'trust_score' => $trustScore,
            'is_verified_business' => in_array($verificationLevel, ['verified_business', 'trusted_professional', 'elite_professional'])
        ]);
    }

    private function calculateProfileCompletion(User $user): int
    {
        $score = 0;
        
        // Phone Verified (5%)
        if (!empty($user->phone)) {
            $score += 5;
        }

        // Email Verified (5%)
        if (!empty($user->email_verified_at)) {
            $score += 5;
        }

        // Profile Photo / Avatar (10%)
        if (!empty($user->avatar)) {
            $score += 10;
        }

        $listing = $user->listing;
        if ($listing) {
            // Address (5%)
            if (!empty($listing->address) || !empty($listing->city)) {
                $score += 5;
            }

            // Description (5%)
            if (!empty($listing->description)) {
                $score += 5;
            }

            // Website (5%)
            if (!empty($listing->website)) {
                $score += 5;
            }

            // Experience (5%)
            if (!empty($listing->years_experience)) {
                $score += 5;
            }

            // Reviews (10%)
            if ($listing->review_count > 0) {
                $score += 10;
            }
        }

        // Documents
        $approvedDocs = UserDocument::where('user_id', $user->id)
            ->where('status', 'approved')
            ->pluck('document_type')
            ->toArray();

        // Business Logo (5%)
        if (in_array('business_logo', $approvedDocs)) {
            $score += 5;
        }

        // GST (10%)
        if (in_array('gst_certificate', $approvedDocs)) {
            $score += 10;
        }

        // PAN (10%)
        if (in_array('pan_card', $approvedDocs)) {
            $score += 10;
        }

        // Business Images (10%)
        if (in_array('business_image', $approvedDocs) || in_array('office_image', $approvedDocs)) {
            $score += 10;
        }

        // Portfolio (20%)
        if (in_array('portfolio_document', $approvedDocs)) {
            $score += 20;
        }

        return min(100, $score);
    }

    private function determineVerificationLevel(User $user): string
    {
        // Default level
        $level = 'unverified';

        // Check if basic (Level 0)
        if ($user->email_verified_at && $user->phone) {
            $level = 'basic_member'; // Corresponds to Level 0
        }

        $approvedDocs = UserDocument::where('user_id', $user->id)
            ->where('status', 'approved')
            ->pluck('document_type')
            ->toArray();

        $hasVerifiedBusinessDocs = in_array('gst_certificate', $approvedDocs) 
            && in_array('pan_card', $approvedDocs)
            && in_array('business_logo', $approvedDocs)
            && (in_array('business_image', $approvedDocs) || in_array('office_image', $approvedDocs));

        // Note: For demo/simplicity, we're assuming if they have address and photo, the basic member stuff is met
        if ($hasVerifiedBusinessDocs && $user->avatar) {
            $level = 'verified_business'; // Corresponds to Level 1
        }

        $hasTrustedDocs = in_array('portfolio_document', $approvedDocs) || in_array('work_history', $approvedDocs);
        
        if ($level === 'verified_business' && $hasTrustedDocs) {
            // Also requires 5+ portfolio projects, we can check listing galleries here
            // Assuming we check $user->listing->galleries()->count() >= 5
            $galleryCount = $user->listing ? $user->listing->galleries()->count() : 0;
            
            if ($galleryCount >= 5) {
                $level = 'trusted_professional'; // Corresponds to Level 2
            }
        }

        if ($level === 'trusted_professional') {
            // Elite requires Reviews, Completed Projects, High Rating
            $listing = $user->listing;
            if ($listing && $listing->review_count >= 5 && $listing->avg_rating >= 4.0) {
                $level = 'elite_professional'; // Corresponds to Level 3
            }
        }

        return $level;
    }

    private function calculateTrustScore(User $user, int $completionScore, string $verificationLevel): int
    {
        $trustScore = 0;

        // Profile Completion (25%)
        $trustScore += ($completionScore / 100) * 25;

        // Verification Level (25%)
        $levelScores = [
            'unverified' => 0,
            'basic_member' => 5,
            'verified_business' => 15,
            'trusted_professional' => 20,
            'elite_professional' => 25,
        ];
        // For backwards compatibility mapping
        $legacyMap = [
            'mobile_verified' => 5,
            'identity_verified' => 10,
            'business_verified' => 15,
            'site_verified' => 25
        ];

        $trustScore += $levelScores[$verificationLevel] ?? ($legacyMap[$verificationLevel] ?? 0);

        // Reviews (25%)
        $listing = $user->listing;
        if ($listing) {
            $ratingScore = min(25, ($listing->avg_rating / 5) * 25);
            $trustScore += $ratingScore;
        }

        // Project Success (25%)
        // Could be based on completed requirements, bids awarded, etc.
        // For now, base it on the number of successful jobs or a flat 10 for having a listing
        if ($listing) {
             // Mock logic: 15 base + 10 if they have over 5 reviews
             $projectScore = 15;
             if ($listing->review_count >= 5) {
                 $projectScore += 10;
             }
             $trustScore += $projectScore;
        }

        return (int) round(min(100, $trustScore));
    }
}
