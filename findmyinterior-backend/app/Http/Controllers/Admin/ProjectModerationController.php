<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectModerationController extends Controller
{
    private array $allowedTransitions = [
        'APPROVE' => ['open'],
        'REJECT' => ['rejected'],
        'SUSPEND' => ['suspended'],
        'RESTORE' => ['open', 'bidding'], // depending on previous state ideally, but we'll map to open for simplicity or need more logic
        'CLOSE' => ['expired', 'completed'],
        'FLAG' => ['flagged'],
    ];

    public function moderate(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'action' => 'required|string|in:APPROVE,REJECT,SUSPEND,RESTORE,CLOSE,FLAG',
            'reason' => 'required|string|max:500'
        ]);

        $requirement = Requirement::findOrFail($id);
        $before = ['status' => $requirement->status];
        
        $action = $validated['action'];
        $newState = $this->determineNewState($action, $requirement->status);

        if (!$this->isValidTransition($requirement->status, $newState)) {
            return response()->json(['message' => "Invalid transition from {$requirement->status} to {$newState}."], 409);
        }

        $requirement->update(['status' => $newState]);

        ActivityLog::recordAdminAction(
            auth()->id(),
            $action,
            $requirement,
            $before,
            ['status' => $newState],
            $validated['reason']
        );

        return response()->json([
            'success' => true,
            'message' => "Project moderated successfully.",
            'status' => $newState
        ]);
    }

    private function determineNewState(string $action, string $currentState): string
    {
        return match ($action) {
            'APPROVE' => 'open',
            'REJECT' => 'rejected',
            'SUSPEND' => 'suspended',
            'RESTORE' => 'open', // Simplification, could be enhanced to track previous state
            'CLOSE' => 'expired',
            'FLAG' => 'flagged',
        };
    }

    private function isValidTransition(string $current, string $new): bool
    {
        // Example rigid transitions
        if ($current === 'completed' && $new !== 'completed') {
            return false; // Cannot un-complete a project
        }
        
        if ($current === 'expired' && $new !== 'expired') {
            // Only RESTORE can theoretically un-expire, if allowed by business rules
            if ($new !== 'open') return false; 
        }

        return true;
    }
}
