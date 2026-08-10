<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountVerifiedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct()
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Congratulations! Your Business is Verified')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Great news! Your business profile on Find My Interior has been successfully verified by our team.')
            ->line('The verified badge is now active on your public profile, which will help build trust with clients and improve your visibility in search results.')
            ->action('View Your Dashboard', url(config('app.frontend_url') . '/dashboard'))
            ->line('Thank you for being a trusted professional on our platform!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'    => 'account_verified',
            'title'   => 'Business Verified',
            'message' => 'Congratulations! Your business account has been successfully verified.',
            'action_url' => '/dashboard',
        ];
    }
}
