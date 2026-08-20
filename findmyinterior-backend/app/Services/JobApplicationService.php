<?php

namespace App\Services;

use App\Models\WorkerJob;
use App\Models\JobApplication;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class JobApplicationService
{
    public function applyForJob(WorkerJob $job, array $data, $workerId)
    {
        if ($job->status !== 'open') {
            throw new InvalidArgumentException("Cannot apply to a job that is not open.");
        }

        if ($job->user_id === $workerId) {
            throw new InvalidArgumentException("You cannot apply to your own job.");
        }

        $existing = JobApplication::where('requirement_id', $job->id)
                                ->where('professional_id', $workerId)
                                ->first();
        if ($existing) {
            throw new InvalidArgumentException("You have already applied for this job.");
        }

        return JobApplication::create(array_merge($data, [
            'requirement_id' => $job->id,
            'professional_id' => $workerId,
            'status' => 'pending'
        ]));
    }

    public function acceptApplication(WorkerJob $job, JobApplication $application)
    {
        return DB::transaction(function () use ($job, $application) {
            $lockedJob = WorkerJob::where('id', $job->id)->lockForUpdate()->first();
            
            if ($lockedJob->status !== 'open') {
                throw new InvalidArgumentException("Cannot accept application. Job is already {$lockedJob->status}.");
            }

            if ($application->status !== 'pending') {
                throw new InvalidArgumentException("This application cannot be accepted.");
            }

            $application->update(['status' => 'accepted']);
            
            JobApplication::where('requirement_id', $job->id)
                        ->where('id', '!=', $application->id)
                        ->update(['status' => 'rejected']);
            
            $lockedJob->update(['status' => 'closed']);

            return $application->fresh();
        });
    }
}
