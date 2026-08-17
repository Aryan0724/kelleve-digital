<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MarketingController extends Controller
{
    /**
     * Get all marketing campaigns for the vendor
     */
    public function index(Request $request)
    {
        // Mock data for now, ideally fetched from a `marketing_campaigns` table
        return response()->json([
            'success' => true,
            'data' => [
                [
                    'id' => 1,
                    'title' => "Diwali Interior Fit-Out Special (20% Off)",
                    'channel' => "SMS + Email",
                    'audience' => "1,240 Privilege Card Holders",
                    'sentDate' => "Oct 15, 2026",
                    'delivered' => "99.1%",
                    'clicks' => 412,
                    'status' => "Completed"
                ],
                [
                    'id' => 2,
                    'title' => "New Modular Kitchen Catalog Launch",
                    'channel' => "SMS Broadcast",
                    'audience' => "845 Recent Inquiries",
                    'sentDate' => "Nov 1, 2026",
                    'delivered' => "98.7%",
                    'clicks' => 289,
                    'status' => "Completed"
                ]
            ]
        ]);
    }

    /**
     * Create a new marketing campaign
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'channel' => 'required|string',
            'audience' => 'required|string',
            'message' => 'required|string',
        ]);

        // In a real implementation, save to database and queue job
        
        $campaign = [
            'id' => rand(1000, 9999),
            'title' => $validated['title'],
            'channel' => $validated['channel'],
            'audience' => $validated['audience'],
            'sentDate' => "Just now",
            'delivered' => "In Progress",
            'clicks' => 0,
            'status' => "Active"
        ];

        return response()->json([
            'success' => true,
            'data' => $campaign
        ]);
    }
}
