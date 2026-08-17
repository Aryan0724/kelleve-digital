<?php
namespace App\Http\Controllers\Vendor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TruedialInvoice;
use App\Traits\ApiResponse;
class InvoiceController extends Controller {
    use ApiResponse;
    public function index() { return $this->success(TruedialInvoice::all()); }
    public function store(Request $request) { return $this->success(TruedialInvoice::create($request->all())); }
}
