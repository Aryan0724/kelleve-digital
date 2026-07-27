<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;
use Illuminate\Support\Facades\Auth;
use App\Models\TruedialInvoice;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    public function index(Request $request)
    {
        $invoices = TruedialInvoice::where('user_id', Auth::id())->latest()->get();
        return $this->success($invoices);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lead_name' => 'required|string',
            'amount' => 'required|numeric|min:1',
            'description' => 'nullable|string'
        ]);

        $invoice = TruedialInvoice::create([
            'user_id' => Auth::id(),
            'client_name' => $validated['lead_name'],
            'amount' => $validated['amount'],
            'description' => $validated['description'] ?? null,
            'payment_link' => 'https://rzp.io/i/' . Str::random(10),
            'status' => 'unpaid',
        ]);

        return $this->success($invoice, 'Payment link generated successfully', 201);
    }
}
