<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Rfq;
use App\Models\RfqQuotation;
use App\Http\Requests\RfqQuotationRequest;
use App\Services\RfqQuotationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use InvalidArgumentException;

class RfqQuotationController extends Controller
{
    protected $service;

    public function __construct(RfqQuotationService $service)
    {
        $this->service = $service;
    }

    public function store(RfqQuotationRequest $request, $id): JsonResponse
    {
        $user = Auth::user();
        if (!$user->isSupplier() && !$user->isBusiness() && !$user->isBuilder()) {
            return response()->json(['message' => 'Unauthorized to quote on RFQs.'], 403);
        }

        $rfq = Rfq::findOrFail($id);

        try {
            $quotation = $this->service->submitQuotation($rfq, $request->validated(), $user->id);
            return response()->json([
                'message' => 'Quotation submitted successfully',
                'data' => $quotation
            ], 201);
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }

    public function award($id, $quotation_id): JsonResponse
    {
        $user = Auth::user();
        $rfq = Rfq::findOrFail($id);

        if ($rfq->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $quotation = RfqQuotation::findOrFail($quotation_id);

        try {
            $accepted = $this->service->acceptQuotation($rfq, $quotation);
            return response()->json([
                'message' => 'Quotation accepted successfully.',
                'data' => $accepted
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 403);
        }
    }
}
