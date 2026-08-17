<?php
namespace App\Http\Controllers\Vendor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;
class CrmController extends Controller {
    use ApiResponse;
    public function leads() { return $this->success([]); }
    public function updateLeadStatus(Request $request, $id) { return $this->success(null); }
}
