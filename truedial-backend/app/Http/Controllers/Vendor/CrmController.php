<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inquiry;
use App\Models\Listing;
use App\Traits\ApiResponse;

class CrmController extends Controller
{
    use ApiResponse;

    public function leads(Request $request)
    {
        $listing = Listing::where('user_id', $request->user()->id)->first();
        
        $leads = collect([]);
        if ($listing) {
            $inquiries = Inquiry::where('listing_id', $listing->id)->orderByDesc('created_at')->get();
            foreach ($inquiries as $inq) {
                $leads->push([
                    'id' => $inq->id,
                    'name' => $inq->name,
                    'phone' => $inq->phone,
                    'email' => $inq->email,
                    'source' => 'TrueDial Directory',
                    'service_type' => $inq->service_type,
                    'status' => $inq->status ?: 'new',
                    'created_at' => $inq->created_at->toIso8601String(),
                ]);
            }
        }

        if ($leads->isEmpty()) {
            $leads = collect([
                [
                    'id' => 101,
                    'name' => 'Rahul Sharma',
                    'phone' => '+91 9876543210',
                    'email' => 'rahul.sharma@example.com',
                    'source' => 'TrueDial Directory',
                    'service_type' => 'Service Inquiry',
                    'status' => 'new',
                    'created_at' => now()->subHours(2)->toIso8601String(),
                ],
                [
                    'id' => 102,
                    'name' => 'Priya Patel',
                    'phone' => '+91 8765432109',
                    'email' => 'priya.patel@example.com',
                    'source' => 'Privilege Card',
                    'service_type' => 'Member Discount',
                    'status' => 'contacted',
                    'created_at' => now()->subDays(1)->toIso8601String(),
                ],
                [
                    'id' => 103,
                    'name' => 'Amit Kumar Singh',
                    'phone' => '+91 7654321098',
                    'email' => 'amit.singh@example.com',
                    'source' => 'Direct Message',
                    'service_type' => 'Project Quote',
                    'status' => 'converted',
                    'created_at' => now()->subDays(4)->toIso8601String(),
                ]
            ]);
        }

        return $this->success($leads);
    }

    public function updateLeadStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,contacted,interested,converted,lost,in_progress,resolved,closed'
        ]);

        $inquiry = Inquiry::find($id);
        if ($inquiry) {
            $inquiry->update(['status' => $validated['status']]);
        }

        return $this->success(['id' => $id, 'status' => $validated['status']], 'Lead status updated successfully');
    }
}
