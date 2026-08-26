<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Traits\ApiResponse;

class NotificationController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        if ($notifications->isEmpty()) {
            $notifications = collect([
                [
                    'id' => 1,
                    'type' => 'welcome',
                    'title' => 'Welcome to TrueDial! 🎉',
                    'message' => 'Thank you for joining India’s Emerging Business Growth Platform. Explore verified businesses and grow your network.',
                    'is_read' => false,
                    'created_at' => now()->subHours(1)->toIso8601String(),
                ],
                [
                    'id' => 2,
                    'type' => 'privilege_card',
                    'title' => 'Digital Privilege Card Available',
                    'message' => 'Claim your digital privilege card to unlock exclusive discounts across restaurants, hotels, and retail stores.',
                    'is_read' => false,
                    'created_at' => now()->subHours(4)->toIso8601String(),
                ]
            ]);
        }

        return $this->success($notifications);
    }

    public function markAsRead(Request $request, $id)
    {
        Notification::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return $this->success(null, 'Notification marked as read');
    }

    public function markAllAsRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return $this->success(null, 'All notifications marked as read');
    }
}
