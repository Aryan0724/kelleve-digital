<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inquiry;
use App\Traits\ApiResponse;

class InquiryController extends Controller
{
    use ApiResponse;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'listing_id' => 'nullable|exists:listings,id',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'message' => 'required|string',
            'service_type' => 'nullable|string',
            'city' => 'nullable|string',
        ]);

        if (auth('sanctum')->check()) {
            $validated['user_id'] = auth('sanctum')->id();
        }

        $inquiry = Inquiry::create($validated);

        return $this->success($inquiry, 'Inquiry sent to business successfully', 201);
    }
}
