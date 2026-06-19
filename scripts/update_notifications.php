<?php
// scripts/update_notifications.php
$basePath = "d:/find my interior/findmyinterior-backend/app/Notifications/";

$notifications = [
    'NewLeadNotification' => [
        'subject' => 'New Lead Available: {title}',
        'line1' => 'A new lead matching your profile has been posted in {city}.',
        'whatsapp' => 'New Lead Alert! {title} in {city}. Log in to view details.'
    ],
    'BidReceivedNotification' => [
        'subject' => 'New Bid Received on your Project',
        'line1' => '{vendor_name} has submitted a quote of ₹{amount} for your project.',
        'whatsapp' => 'You received a new bid of ₹{amount} from {vendor_name} for your project.'
    ],
    'BidAwardedNotification' => [
        'subject' => 'Congratulations! You won a project',
        'line1' => 'Your bid for {title} has been accepted and awarded to you!',
        'whatsapp' => 'Congratulations! Your bid for {title} has been accepted. Contact the client now to start the project.'
    ],
    'NewMessageNotification' => [
        'subject' => 'New Message Received',
        'line1' => 'You have a new message from {sender_name}.',
        'whatsapp' => 'You have a new message from {sender_name} regarding your project.'
    ],
    'ReviewReceivedNotification' => [
        'subject' => 'You received a new review',
        'line1' => '{reviewer_name} gave you a {rating}-star review for the project {title}.',
        'whatsapp' => 'You just received a {rating}-star review from {reviewer_name}!'
    ],
    'LeadUnlockedNotification' => [
        'subject' => 'Contact Unlocked: {title}',
        'line1' => 'You have successfully unlocked the contact details for {title}.',
        'whatsapp' => 'You unlocked the lead for {title}. Client Phone: {phone}. Connect with them right away!'
    ],
];

$template = '<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Channels\WhatsAppChannel;

class {ClassName} extends Notification implements ShouldQueue
{
    use Queueable;

    public $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function via(object $notifiable): array
    {
        return [\'mail\', \'database\', WhatsAppChannel::class];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $subject = $this->replaceVars(\'{subject}\', $this->data);
        $line1 = $this->replaceVars(\'{line1}\', $this->data);
        
        return (new MailMessage)
            ->subject($subject)
            ->greeting("Hello {$notifiable->name},")
            ->line($line1)
            ->action(\'View Dashboard\', url(config(\'app.frontend_url\') . \'/dashboard\'));
    }
    
    public function toWhatsApp(object $notifiable): string
    {
        return $this->replaceVars(\'{whatsapp}\', $this->data);
    }

    public function toArray(object $notifiable): array
    {
        return [
            \'type\' => \'{ClassName}\',
            \'message\' => $this->replaceVars(\'{line1}\', $this->data),
            \'data\' => $this->data
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
';

foreach ($notifications as $className => $config) {
    $content = str_replace(
        ['{ClassName}', '{subject}', '{line1}', '{whatsapp}'],
        [$className, addslashes($config['subject']), addslashes($config['line1']), addslashes($config['whatsapp'])],
        $template
    );
    file_put_contents($basePath . $className . ".php", $content);
    echo "Generated $className\n";
}
