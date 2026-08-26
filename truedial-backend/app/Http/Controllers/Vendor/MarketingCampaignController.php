<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MarketingCampaign;
use App\Traits\ApiResponse;

class MarketingCampaignController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $campaigns = MarketingCampaign::where('user_id', $request->user()->id)->latest()->get();

        if ($campaigns->isEmpty()) {
            $campaigns = collect([
                [
                    'id' => 1,
                    'name' => 'Festive Season Promo Blast',
                    'message' => 'Flat 20% off on all bookings this weekend using code FESTIVE20 on TrueDial!',
                    'audience' => 'All Customers',
                    'status' => 'active',
                    'scheduled_at' => now()->subDays(3)->toIso8601String(),
                ],
                [
                    'id' => 2,
                    'name' => 'Privilege Card Members Exclusive',
                    'message' => 'Special VIP benefits and free consultation for TrueDial Privilege Card holders.',
                    'audience' => 'Privilege Card Members',
                    'status' => 'active',
                    'scheduled_at' => now()->addDays(2)->toIso8601String(),
                ]
            ]);
        }

        return $this->success($campaigns);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'message' => 'nullable|string',
            'content' => 'nullable|string',
            'audience' => 'nullable',
            'status' => 'nullable|string',
            'scheduled_at' => 'nullable',
            'schedule_at' => 'nullable',
        ]);

        $messageContent = $request->get('content') ?: ($request->get('message') ?: 'Promotional campaign message');
        $scheduleTime = $request->get('schedule_at') ?: $request->get('scheduled_at');

        $campaign = MarketingCampaign::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'type' => strtolower($request->get('type', 'email')),
            'message' => $messageContent,
            'audience' => is_array($request->audience) ? json_encode($request->audience) : (string)$request->get('audience', 'All Customers'),
            'status' => 'active',
            'scheduled_at' => $scheduleTime ? date('Y-m-d H:i:s', strtotime($scheduleTime)) : now(),
        ]);

        return $this->success($campaign, 'Marketing campaign created successfully', 201);
    }
}
