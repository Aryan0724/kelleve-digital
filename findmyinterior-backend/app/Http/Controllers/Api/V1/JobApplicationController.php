<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\WorkerJob;
use App\Models\JobApplication;
use App\Http\Requests\JobApplicationRequest;
use App\Services\JobApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use InvalidArgumentException;

class JobApplicationController extends Controller
{
    protected $service;

    public function __construct(JobApplicationService $service)
    {
        $this->service = $service;
    }

    public function store(JobApplicationRequest $request, $id): JsonResponse
    {
        $user = Auth::user();
        if (!$user->isWorker() && !$user->isBusiness() && !$user->isBuilder()) {
            return response()->json(['message' => 'Unauthorized to apply for jobs.'], 403);
        }

        $job = WorkerJob::findOrFail($id);

        try {
            $application = $this->service->applyForJob($job, $request->validated(), $user->id);
            return response()->json([
                'message' => 'Application submitted successfully',
                'data' => $application
            ], 201);
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }

    public function award($id, $application_id): JsonResponse
    {
        $user = Auth::user();
        $job = WorkerJob::findOrFail($id);

        if ($job->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $application = JobApplication::findOrFail($application_id);

        try {
            $accepted = $this->service->acceptApplication($job, $application);
            return response()->json([
                'message' => 'Application accepted successfully.',
                'data' => $accepted
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }
}
