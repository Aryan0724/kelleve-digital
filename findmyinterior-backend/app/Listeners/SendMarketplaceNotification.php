<?php

namespace App\Listeners;

use App\Events\BidSubmitted;
use App\Events\ProjectAwarded;
use App\Events\ProjectCompleted;
use App\Events\ReviewSubmitted;
use App\Notifications\MarketplaceNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\User;

class SendMarketplaceNotification
{
    public function handleProjectAwarded(ProjectAwarded $event): void
    {
        $professional = User::find($event->project->professional_id);
        if ($professional) {
            $professional->notify(new MarketplaceNotification(
                'project_awarded',
                'You have been awarded a new project!',
                ['project_id' => $event->project->id]
            ));
        }
    }

    public function handleProjectCompleted(ProjectCompleted $event): void
    {
        $professional = User::find($event->project->professional_id);
        if ($professional) {
            $professional->notify(new MarketplaceNotification(
                'project_completed',
                'Your project has been marked as completed by the client. You can now leave a review.',
                ['project_id' => $event->project->id]
            ));
        }
    }

    public function handleReviewSubmitted(ReviewSubmitted $event): void
    {
        $reviewedUser = User::find($event->review->reviewed_user_id);
        if ($reviewedUser) {
            $reviewedUser->notify(new MarketplaceNotification(
                'review_received',
                'You received a new ' . $event->review->rating . '-star review!',
                ['project_id' => $event->review->project_id, 'review_id' => $event->review->id]
            ));
        }
    }

    public function handleBidSubmitted(BidSubmitted $event): void
    {
        $client = User::find($event->bid->requirement->user_id);
        if ($client) {
            $client->notify(new MarketplaceNotification(
                'bid_received',
                'You received a new bid for your requirement.',
                ['bid_id' => $event->bid->id, 'requirement_id' => $event->bid->requirement_id]
            ));
        }
    }
}
