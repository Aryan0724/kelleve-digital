<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class WhatsAppChannel
{
    public function send($notifiable, Notification $notification)
    {
        if (method_exists($notification, 'toWhatsApp')) {
            $message = $notification->toWhatsApp($notifiable);
            
            // Mocking the WhatsApp sending
            Log::channel('single')->info("Mock WhatsApp Message Sent to " . $notifiable->phone, [
                'content' => $message
            ]);
        }
    }
}
