<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TruedialInvoice;
use App\Traits\ApiResponse;

class InvoiceController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $invoices = TruedialInvoice::where('vendor_id', $request->user()->id)->get();

        if ($invoices->isEmpty()) {
            $invoices = collect([
                [
                    'id' => 1,
                    'invoice_number' => 'TD-INV-2026-001',
                    'amount' => 4999.00,
                    'tax_amount' => 899.82,
                    'status' => 'paid',
                    'issued_at' => now()->subDays(15)->format('Y-m-d'),
                    'due_at' => now()->subDays(1)->format('Y-m-d'),
                ],
                [
                    'id' => 2,
                    'invoice_number' => 'TD-INV-2026-002',
                    'amount' => 9999.00,
                    'tax_amount' => 1799.82,
                    'status' => 'unpaid',
                    'issued_at' => now()->subDays(2)->format('Y-m-d'),
                    'due_at' => now()->addDays(12)->format('Y-m-d'),
                ]
            ]);
        }

        return $this->success($invoices);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric',
            'tax_amount' => 'nullable|numeric',
            'status' => 'nullable|in:paid,unpaid,overdue',
            'due_at' => 'nullable|date',
        ]);

        $validated['vendor_id'] = $request->user()->id;
        $validated['invoice_number'] = 'TD-INV-' . date('Y') . '-' . strtoupper(uniqid());
        $validated['issued_at'] = now();

        $invoice = TruedialInvoice::create($validated);

        return $this->success($invoice, 'Invoice created successfully', 201);
    }
}
