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

            if ($quote->status !== 'pending') {
                throw new InvalidArgumentException("This quote cannot be accepted.");
            }

            $quote->update(['status' => 'accepted']);
            
            ProjectQuote::where('requirement_id', $project->id)
                        ->where('id', '!=', $quote->id)
                        ->update(['status' => 'rejected']);
            
            $lockedProject->update(['status' => 'closed']);

            return $quote->fresh();
        });
    }
}
