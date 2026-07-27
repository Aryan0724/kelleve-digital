<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;
use App\Models\ConsultingLead;

class ConsultingController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

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
            'status' => 'pending',
        ]);

        return $this->success($lead, 'Consultation request submitted successfully. Our team will contact you shortly.', 201);
    }
}
