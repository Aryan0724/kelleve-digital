<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MarketplaceNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $eventType;
    public $message;
    public $metadata;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $eventType, string $message, array $metadata = [])
    {
        $this->eventType = $eventType;
        $this->message = $message;
        $this->metadata = $metadata;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database']; // Can add 'mail', 'nexmo', etc. later
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'event_type' => $this->eventType,
            'message' => $this->message,
            'metadata' => $this->metadata,
        ];
    }
}
