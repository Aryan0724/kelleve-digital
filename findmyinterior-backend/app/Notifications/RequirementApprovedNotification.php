<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Channels\WhatsAppChannel;

class RequirementApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database', WhatsAppChannel::class];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Requirement is Live!')
            ->greeting("Hello {$notifiable->name},")
            ->line("Good news! Your requirement \"{$this->data['title']}\" has been verified and is now live.")
            ->line("Professionals in {$this->data['city']} have been notified and will start bidding soon.")
            ->action('View My Requirement', url(config('app.frontend_url') . '/dashboard'));
    }
    
    public function toWhatsApp(object $notifiable): string
    {
        return "Good news! Your requirement \"{$this->data['title']}\" has been verified and is now live. Professionals have been notified.";
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'RequirementApprovedNotification',
            'message' => "Your requirement \"{$this->data['title']}\" has been approved and is now live.",
            'data' => $this->data
        ];
    }
}
