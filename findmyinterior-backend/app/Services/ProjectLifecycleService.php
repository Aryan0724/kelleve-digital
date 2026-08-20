<?php

namespace App\Services;

use App\Models\Requirement;
use App\Models\Project;
use App\Models\Rfq;
use App\Models\WorkerJob;
use App\Models\ContactUnlock;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class ProjectLifecycleService
{
    /**
     * Expire a given model (Requirement, Project, Rfq, WorkerJob).
     */
    public function expire($model)
    {
        if (!in_array($model->status, ['open', 'receiving_bids', 'published'])) {
            return false;
        }

        DB::beginTransaction();
        try {
            // Update status
            $model->status = 'expired';
            $model->save();

            // Notify owner
            // (Assumes a notification system or event is wired up)
            // e.g., event(new ProjectExpired($model));

            // Refund vendors who unlocked this lead but the lead expired without an award
            $this->refundUnlocks($model);

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Failed to expire model ID {$model->id}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Refunds contact unlocks if the project expired and no bid was awarded.
     */
    protected function refundUnlocks($model)
    {
        // Get all unlocks for this specific lead
        $modelType = get_class($model);
        
        $unlocks = ContactUnlock::where('unlockable_type', $modelType)
            ->where('unlockable_id', $model->id)
            ->where('status', 'completed')
            ->get();

        foreach ($unlocks as $unlock) {
            $user = User::find($unlock->user_id);
            if ($user && $unlock->cost > 0) {
                // Refund wallet
                $user->wallet_balance += $unlock->cost;
                $user->save();

                // Create a refund transaction/log
                $unlock->status = 'refunded';
                $unlock->save();

                Log::info("Refunded {$unlock->cost} to User ID {$user->id} for expired lead {$modelType}:{$model->id}");
            }
        }
    }

    /**
     * Transition a project to 'In Progress'
     */
    public function startProject($model)
    {
        if ($model->status !== 'awarded') {
            throw new Exception("Cannot start project unless it is awarded. Current status: {$model->status}");
        }

        $model->status = 'in_progress';
        $model->save();
        
        return true;
    }
}
