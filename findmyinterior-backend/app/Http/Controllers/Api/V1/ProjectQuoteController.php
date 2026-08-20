<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use App\Models\ProjectQuote;
use App\Http\Requests\ProjectQuoteRequest;
use App\Services\ProjectQuoteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use InvalidArgumentException;

class ProjectQuoteController extends Controller
{
    protected $service;

    public function __construct(ProjectQuoteService $service)
    {
        $this->service = $service;
    }

    public function store(ProjectQuoteRequest $request, $id): JsonResponse
    {
        $user = Auth::user();
        // Interior project quotes are for Designers/Contractors/Builders (business/builder roles).
        // Workers apply to worker-jobs via /worker-jobs/{id}/apply — NOT interior project quotes.
        if (!$user->isBusiness() && !$user->isBuilder()) {
            return response()->json(['message' => 'Only professionals (designers, contractors, builders) can quote on interior projects.'], 403);
        }

        $project = Requirement::findOrFail($id);

        try {
            $quote = $this->service->submitQuote($project, $request->validated(), $user->id);
            return response()->json([
                'message' => 'Quote submitted successfully',
                'data' => $quote
            ], 201);
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }

    public function award($id, $quote_id): JsonResponse
    {
        $user = Auth::user();
        $project = Requirement::findOrFail($id);

        if ($project->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $quote = ProjectQuote::findOrFail($quote_id);

        try {
            $acceptedQuote = $this->service->acceptQuote($project, $quote);
            return response()->json([
                'message' => 'Quote accepted successfully.',
                'data' => $acceptedQuote
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }
}
