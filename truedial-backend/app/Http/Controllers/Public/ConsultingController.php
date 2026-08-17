<?php
namespace App\Http\Controllers\Public;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ConsultingLead;
use App\Traits\ApiResponse;
class ConsultingController extends Controller {
    use ApiResponse;
    public function submitLead(Request $request) {
        $lead = ConsultingLead::create($request->all());
        return $this->success($lead, 'Lead submitted successfully');
    }
}
