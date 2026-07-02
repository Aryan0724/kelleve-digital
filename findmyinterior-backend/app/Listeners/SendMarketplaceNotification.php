<?php

namespace App\Listeners;

use App\Events\BidSubmitted;
use App\Events\ProjectAwarded;
use App\Events\ProjectCompleted;
use App\Events\ReviewSubmitted;
use App\Notifications\MarketplaceNotification;
use App\Notifications\BidAwardedNotification;
use App\Notifications\ReviewReceivedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\User;

class SendMarketplaceNotification
{
    public function handleProjectAwarded(ProjectAwarded $event): void
    {
        $professional = User::find($event->project->professional_id);
        if ($professional) {
            $professional->notify(new BidAwardedNotification([
                'title' => $event->project->title,
                'project_id' => $event->project->id
            ]));
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
            // Load relationships if not loaded
            $reviewer = User::find($event->review->reviewer_id);
            $project = \App\Models\Project::find($event->review->project_id);
            
            $reviewedUser->notify(new ReviewReceivedNotification([
                'reviewer_name' => $reviewer ? $reviewer->name : 'Someone',
                'rating' => $event->review->rating,
                'title' => $project ? $project->title : 'a project',
                'project_id' => $event->review->project_id,
                'review_id' => $event->review->id
            ]));
        }
    }

    // handleBidSubmitted was removed to avoid duplicate notifications since BidService directly sends BidReceivedNotification.
}
