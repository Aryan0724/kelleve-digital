<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ConsultingLead;
use App\Traits\ApiResponse;

class ConsultingController extends Controller
{
    use ApiResponse;

    public function submitLead(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'service_type' => 'required|string',
            'message' => 'nullable|string'
        ]);

        $lead = ConsultingLead::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'service_type' => $validated['service_type'],
            'message' => $validated['message'] ?? null,
            'status' => 'new',
        ]);

        return $this->success($lead, 'Consultation request submitted successfully. Our advisory team will contact you shortly.', 201);
    }
}
