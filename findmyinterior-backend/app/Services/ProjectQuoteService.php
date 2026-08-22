<?php

namespace App\Services;

use App\Models\Requirement;
use App\Models\ProjectQuote;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class ProjectQuoteService
{
    public function submitQuote(Requirement $project, array $data, $professionalId)
    {
        if ($project->status !== 'open') {
            throw new InvalidArgumentException("Cannot submit a quote to a project that is not open.");
        }

        if ($project->user_id === $professionalId) {
            throw new InvalidArgumentException("You cannot quote on your own project.");
        }

        $existing = ProjectQuote::where('requirement_id', $project->id)
                                ->where('professional_id', $professionalId)
                                ->first();
        if ($existing) {
            throw new InvalidArgumentException("You have already submitted a quote for this project.");
        }

        return ProjectQuote::create(array_merge($data, [
            'requirement_id' => $project->id,
            'professional_id' => $professionalId,
            'status' => 'pending'
        ]));
    }

    public function acceptQuote(Requirement $project, ProjectQuote $quote)
    {
        return DB::transaction(function () use ($project, $quote) {
            $lockedProject = Requirement::where('id', $project->id)->lockForUpdate()->first();
            
            if ($lockedProject->status !== 'open') {
                throw new InvalidArgumentException("Cannot accept quote. Project is already {$lockedProject->status}.");
            }

            if ($quote->requirement_id !== $project->id) {
                // If it's a completely different project, throw 404 behavior by throwing model not found?
                // The controller handles InvalidArgumentException as 403, which might be okay or I can throw ModelNotFoundException
                // Wait, if it doesn't belong, it's essentially a 404 (or 403). The test expects 404.
                throw new \Illuminate\Database\Eloquent\ModelNotFoundException("Quote not found in this project.");
            }

            if ($quote->status !== 'pending') {
                throw new InvalidArgumentException("This quote cannot be accepted.");
            }

            $quote->update(['status' => 'accepted']);
            
            ProjectQuote::where('requirement_id', $project->id)
                        ->where('id', '!=', $quote->id)
                        ->update(['status' => 'rejected']);
            
            // Canonical state machine: Open → (Award) → Awarded
            // NOT "closed". Closed is a terminal state set by the customer after completion.
            $lockedProject->update([
                'status' => 'awarded',
                'professional_id' => $quote->professional_id
            ]);

            return $quote->fresh();
        }, 3);
    }
}
