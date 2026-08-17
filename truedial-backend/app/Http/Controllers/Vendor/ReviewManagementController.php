<?php
namespace App\Http\Controllers\Vendor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;
class ReviewManagementController extends Controller {
    use ApiResponse;
    public function index() { return $this->success([]); }
    public function reply(Request $request, $id) { return $this->success(null); }
}
