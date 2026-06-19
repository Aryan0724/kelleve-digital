<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Channels\WhatsAppChannel;

class BidReceivedNotification extends Notification implements ShouldQueue
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
        $subject = $this->replaceVars('New Bid Received on your Project', $this->data);
        $line1 = $this->replaceVars('{vendor_name} has submitted a quote of ₹{amount} for your project.', $this->data);
        
        return (new MailMessage)
            ->subject($subject)
            ->greeting("Hello {$notifiable->name},")
            ->line($line1)
            ->action('View Dashboard', url(config('app.frontend_url') . '/dashboard'));
    }
    
    public function toWhatsApp(object $notifiable): string
    {
        return $this->replaceVars('You received a new bid of ₹{amount} from {vendor_name} for your project.', $this->data);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'BidReceivedNotification',
            'message' => $this->replaceVars('{vendor_name} has submitted a quote of ₹{amount} for your project.', $this->data),
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
