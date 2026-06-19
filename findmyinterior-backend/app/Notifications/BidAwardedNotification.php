<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Channels\WhatsAppChannel;

class BidAwardedNotification extends Notification implements ShouldQueue
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
        $subject = $this->replaceVars('Congratulations! You won a project', $this->data);
        $line1 = $this->replaceVars('Your bid for {title} has been accepted and awarded to you!', $this->data);
        
        return (new MailMessage)
            ->subject($subject)
            ->greeting("Hello {$notifiable->name},")
            ->line($line1)
            ->action('View Dashboard', url(config('app.frontend_url') . '/dashboard'));
    }
    
    public function toWhatsApp(object $notifiable): string
    {
        return $this->replaceVars('Congratulations! Your bid for {title} has been accepted. Contact the client now to start the project.', $this->data);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'BidAwardedNotification',
            'message' => $this->replaceVars('Your bid for {title} has been accepted and awarded to you!', $this->data),
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
