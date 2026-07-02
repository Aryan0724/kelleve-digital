<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProjectMilestone;
use App\Models\Requirement;
use App\Models\Project;
use App\Models\WorkerJob;
use App\Models\Rfq;
use App\Models\User;
use App\Notifications\MarketplaceNotification;

class MilestoneController extends Controller
{
    use \App\Traits\ApiResponse;

    private function getRequirementModel($id, $type) {
        if ($type === 'rfq') return Rfq::findOrFail($id);
        if ($type === 'job') return WorkerJob::findOrFail($id);
        return Requirement::findOrFail($id); // defaults to Project/Requirement
    }

    public function index(Request $request, $id)
    {
        $type = $request->query('requirement_type', 'project');
        $requirement = $this->getRequirementModel($id, $type);
        
        $milestones = ProjectMilestone::where('project_id', $requirement->id)->orderBy('created_at', 'asc')->get();
        return response()->json($milestones);
    }

    public function store(Request $request, $id)
    {
        $type = $request->query('requirement_type', 'project');
        $requirement = $this->getRequirementModel($id, $type);

        // Authorization: only the awarded professional can add milestones
        // We use professional_id from the model (assuming it's set after award)
        $professionalId = $requirement->professional_id ?? $requirement->worker_id ?? $requirement->supplier_id;
        
        if ($professionalId !== $request->user()->id) {
            return $this->error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'percentage' => 'required|integer|min:0|max:100',
            'amount' => 'required|numeric|min:0',
        ]);

        $validated['project_id'] = $requirement->id;
        $validated['status'] = 'pending';
        $validated['payment_status'] = 'unpaid';

        $milestone = ProjectMilestone::create($validated);

        // Notify customer? (Optionally log to activity_logs)
        \Illuminate\Support\Facades\DB::table('activity_logs')->insert([
            'subject_type' => $requirement->getMorphClass(),
            'subject_id' => $requirement->id,
            'user_id' => $request->user()->id,
            'event_type' => 'Milestone Created',
            'description' => "Professional created a new milestone: {$milestone->title}",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $customer = User::find($requirement->user_id);
        if ($customer) {
            $customer->notify(new MarketplaceNotification(
                'milestone_added',
                "A new payment milestone '{$milestone->title}' was added by the professional.",
                ['project_id' => $requirement->id, 'milestone_id' => $milestone->id]
            ));
        }

        return $this->success($milestone, 'Milestone created successfully', 201);
    }

    public function update(Request $request, $id, $milestoneId)
    {
        $type = $request->query('requirement_type', 'project');
        $requirement = $this->getRequirementModel($id, $type);
        
        $professionalId = $requirement->professional_id ?? $requirement->worker_id ?? $requirement->supplier_id;
        if ($professionalId !== $request->user()->id && $requirement->user_id !== $request->user()->id) {
            return $this->error('Unauthorized', 403);
        }

        $milestone = ProjectMilestone::where('project_id', $requirement->id)->findOrFail($milestoneId);

        $validated = $request->validate([
            'status' => 'nullable|string|in:pending,requested,approved,paid',
            'images' => 'nullable|array',
        ]);

        $milestone->update($validated);
        
        if (isset($validated['status']) && $validated['status'] === 'requested') {
            \Illuminate\Support\Facades\DB::table('activity_logs')->insert([
                'subject_type' => $requirement->getMorphClass(),
                'subject_id' => $requirement->id,
                'user_id' => $request->user()->id,
                'event_type' => 'Milestone Update Requested',
                'description' => "Professional requested approval for milestone: {$milestone->title}",
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $customer = User::find($requirement->user_id);
            if ($customer) {
                $customer->notify(new MarketplaceNotification(
                    'milestone_approval_requested',
                    "The professional has requested approval for milestone '{$milestone->title}'.",
                    ['project_id' => $requirement->id, 'milestone_id' => $milestone->id]
                ));
            }
        }

        return $this->success($milestone, 'Milestone updated successfully');
    }

    public function markAsPaid(Request $request, $id, $milestoneId)
    {
        $type = $request->query('requirement_type', 'project');
        $requirement = $this->getRequirementModel($id, $type);
        
        // Only the customer can mark as paid
        if ($requirement->user_id !== $request->user()->id) {
            return $this->error('Unauthorized', 403);
        }

        $milestone = ProjectMilestone::where('project_id', $requirement->id)->findOrFail($milestoneId);
        $milestone->update([
            'payment_status' => 'paid',
            'status' => 'paid'
        ]);

        $totalMilestones = ProjectMilestone::where('project_id', $requirement->id)->count();
        $paidMilestones = ProjectMilestone::where('project_id', $requirement->id)->where('payment_status', 'paid')->count();

        $projectPaymentStatus = 'Unpaid';
        if ($paidMilestones > 0) {
            if ($paidMilestones === $totalMilestones) {
                $projectPaymentStatus = 'Fully Paid';
            } elseif ($paidMilestones === 1) {
                $projectPaymentStatus = 'Advance Paid';
            } else {
                $projectPaymentStatus = 'Partially Paid';
            }
        }

        $requirement->update(['payment_status' => $projectPaymentStatus]);

        \Illuminate\Support\Facades\DB::table('activity_logs')->insert([
            'subject_type' => $requirement->getMorphClass(),
            'subject_id' => $requirement->id,
            'user_id' => $request->user()->id,
            'event_type' => 'Milestone Paid',
            'description' => "Customer marked milestone as paid: {$milestone->title}",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $professionalId = $requirement->professional_id ?? $requirement->worker_id ?? $requirement->supplier_id;
        $professional = User::find($professionalId);
        if ($professional) {
            $professional->notify(new MarketplaceNotification(
                'milestone_paid',
                "The customer has marked milestone '{$milestone->title}' as paid.",
                ['project_id' => $requirement->id, 'milestone_id' => $milestone->id]
            ));
        }

        return $this->success($milestone, 'Milestone marked as paid');
    }
}

