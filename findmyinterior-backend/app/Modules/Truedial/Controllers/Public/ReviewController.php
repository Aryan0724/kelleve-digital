<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Modules\Truedial\Services\ReviewService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    use \App\Traits\ApiResponse;

    public function __construct(
        protected ReviewService $reviewService
    ) {}

    public function index(Request $request, string $slug): JsonResponse
    {
        try {
            $listing = Listing::where('slug', $slug)->active()->firstOrFail();

            $perPage = $request->get('per_page', 10);

            $reviews = $this->reviewService->getApprovedListingReviews($listing->id, $perPage);

            return $this->success($reviews);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
