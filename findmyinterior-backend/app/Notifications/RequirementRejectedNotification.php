<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RequirementRejectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Update regarding your Requirement')
            ->greeting("Hello {$notifiable->name},")
            ->line("We have reviewed your requirement \"{$this->data['title']}\".")
            ->line("Unfortunately, it did not pass our moderation guidelines and has been rejected.")
            ->line("If you believe this was a mistake, please try posting it again with clearer details or contact support.");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'RequirementRejectedNotification',
            'message' => "Your requirement \"{$this->data['title']}\" did not pass moderation and has been rejected.",
            'data' => $this->data
        ];
    }
}
