<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Channels\WhatsAppChannel;

class LeadUnlockedNotification extends Notification implements ShouldQueue
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
        $subject = $this->replaceVars('Contact Unlocked: {title}', $this->data);
        $line1 = $this->replaceVars('You have successfully unlocked the contact details for {title}.', $this->data);
        
        return (new MailMessage)
            ->subject($subject)
            ->greeting("Hello {$notifiable->name},")
            ->line($line1)
            ->action('View Dashboard', url(config('app.frontend_url') . '/dashboard'));
    }
    
    public function toWhatsApp(object $notifiable): string
    {
        return $this->replaceVars('You unlocked the lead for {title}. Client Phone: {phone}. Connect with them right away!', $this->data);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'LeadUnlockedNotification',
            'message' => $this->replaceVars('You have successfully unlocked the contact details for {title}.', $this->data),
            'data' => $this->data
        ];
    }
    
    private function replaceVars(string $text, array $data): string
    {
        foreach ($data as $key => $value) {
            if (is_scalar($value)) {
                $text = str_replace("{{$key}}", $value, $text);
            }
        }
        return $text;
    }
}
