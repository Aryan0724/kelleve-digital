<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;
class AdminController extends Controller {
    use ApiResponse;
    public function stats() { return $this->success([]); }
    public function vendors() { return $this->success([]); }
    public function approveVendor(Request $request, $id) { return $this->success(null); }
}
