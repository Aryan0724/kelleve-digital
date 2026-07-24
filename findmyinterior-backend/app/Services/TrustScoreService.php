<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserDocument;

class TrustScoreService
{
    /**
     * Recalculate Profile Completion Score and Verification Level for a User.
     * This will also automatically calculate the overall Trust Score.
     */
    public function recalculateForUser(User $user): void
    {
        // 1. Calculate Profile Completion Score
        $completionScore = $this->calculateProfileCompletion($user);
        
        // 2. Determine Verification Level
        $verificationLevel = $this->determineVerificationLevel($user);

        // 3. Calculate Trust Score
        // (Profile Completion = 25%, Verification Level = 25%, Reviews = 25%, Project Success = 25%)
        $trustScore = $this->calculateTrustScore($user, $completionScore, $verificationLevel);

        $user->update([
            'profile_completion_score' => $completionScore,
            'verification_level' => $verificationLevel,
            'trust_score' => $trustScore,
            'is_verified_business' => in_array($verificationLevel, ['business_verified', 'site_verified'])
        ]);
    }

    private function calculateProfileCompletion(User $user): int
    {
        $score = 0;
        
        // Phone Verified (5%)
        if (!empty($user->phone)) {
            $score += 5;
        }

        // Email Verified (5%)
        if (!empty($user->email_verified_at)) {
            $score += 5;
        }

        // Profile Photo / Avatar (10%)
        if (!empty($user->avatar)) {
            $score += 10;
        }

        $profile = $user->listing ?? $user->worker ?? $user->builder ?? $user->supplier;
        if ($profile) {
            // Address (5%)
            if (!empty($profile->address) || !empty($profile->city)) {
                $score += 5;
            }

            // Description (5%)
            $desc = $profile->description ?? $profile->tagline ?? $profile->bio ?? '';
            if (!empty($desc)) {
                $score += 5;
            }

            // Website (5%) (Workers might not have a website field, but if it exists we count it)
            if (!empty($profile->website)) {
                $score += 5;
            }

            // Experience (5%)
            $exp = $profile->years_experience ?? $profile->experience_years ?? null;
            if (!empty($exp)) {
                $score += 5;
            }

            // Reviews (10%)
            $reviews = $profile->review_count ?? $profile->approvedReviews()->count() ?? 0;
            if ($reviews > 0) {
                $score += 10;
            }
        }

        // Documents
        $approvedDocs = UserDocument::where('user_id', $user->id)
            ->where('status', 'approved')
            ->pluck('document_type')
            ->toArray();

        // Business Logo (5%)
        if (in_array('business_logo', $approvedDocs)) {
            $score += 5;
        }

        // GST (10%)
        if (in_array('gst_certificate', $approvedDocs)) {
            $score += 10;
        }

        // PAN (10%)
        if (in_array('pan_card', $approvedDocs)) {
            $score += 10;
        }

        // Business Images (10%)
        if (in_array('business_image', $approvedDocs) || in_array('office_image', $approvedDocs)) {
            $score += 10;
        }

        // Portfolio (20%)
        if (in_array('portfolio_document', $approvedDocs)) {
            $score += 20;
        }

        return min(100, $score);
    }

    private function determineVerificationLevel(User $user): string
    {
        // Default level
        $level = 'unverified';

        // Check if basic (Level 0)
        if ($user->email_verified_at && $user->phone) {
            $level = 'mobile_verified'; // Corresponds to Level 0
        }

        $approvedDocs = UserDocument::where('user_id', $user->id)
            ->where('status', 'approved')
            ->pluck('document_type')
            ->toArray();

        $hasVerifiedBusinessDocs = in_array('gst_certificate', $approvedDocs) 
            && in_array('pan_card', $approvedDocs)
            && in_array('business_logo', $approvedDocs)
            && (in_array('business_image', $approvedDocs) || in_array('office_image', $approvedDocs));

        // Note: For demo/simplicity, we're assuming if they have address and photo, the basic member stuff is met
        if ($hasVerifiedBusinessDocs && $user->avatar) {
            $level = 'business_verified'; // Corresponds to Level 1
        }

        $hasTrustedDocs = in_array('portfolio_document', $approvedDocs) || in_array('work_history', $approvedDocs);

        if ($level === 'business_verified' && $hasTrustedDocs) {
            // Also requires 5+ portfolio projects, we can check galleries here
            $profile = $user->listing ?? $user->worker ?? $user->builder ?? $user->supplier;
            $galleryCount = 0;
            if ($profile && method_exists($profile, 'galleries')) {
                $galleryCount = $profile->galleries()->count();
            }
            // Fallback for workers/builders who might have uploaded 'portfolio_document' directly
            if ($galleryCount >= 5 || in_array('portfolio_document', $approvedDocs)) {
                $level = 'site_verified'; // Corresponds to Level 2 (Trusted/Elite)
            }
        }

        if ($level === 'site_verified') {
            // Elite requires Reviews, Completed Projects, High Rating
            $profile = $user->listing ?? $user->worker ?? $user->builder ?? $user->supplier;
            
            $reviewCount = $profile->review_count ?? ($profile ? $profile->approvedReviews()->count() : 0);
            $avgRating = $profile->avg_rating ?? ($profile ? $profile->approvedReviews()->avg('rating') : 0);

            if ($profile && $reviewCount >= 5 && $avgRating >= 4.0) {
                $level = 'site_verified'; // Cap at site_verified since DB doesn't support elite_professional
            }
        }

        return $level;
    }

    private function calculateTrustScore(User $user, int $completionScore, string $verificationLevel): int
    {
        $trustScore = 0;

        // Profile Completion (35%)
        // Ensures that just completing the profile yields a decent score
        $trustScore += ($completionScore / 100) * 35;

        // Verification Level (25%)
        $levelScores = [
            'unverified' => 0,
            'mobile_verified' => 5,
            'identity_verified' => 10,
            'business_verified' => 15,
            'site_verified' => 25,
        ];

        $trustScore += $levelScores[$verificationLevel] ?? 0;

        // Reviews (25%)
        $profile = $user->listing ?? $user->worker ?? $user->builder ?? $user->supplier;
        if ($profile) {
            $avgRating = $profile->avg_rating ?? $profile->approvedReviews()->avg('rating') ?? 0;
            $ratingScore = min(25, ($avgRating / 5) * 25);
            $trustScore += $ratingScore;
        }

        // Project Success / Profile Activity (15%)
        // Give base 10 points just for having a profile
        if ($profile) {
             $reviewCount = $profile->review_count ?? $profile->approvedReviews()->count() ?? 0;
             $projectScore = 10;
             if ($reviewCount >= 5) {
                 $projectScore += 5;
             }
             $trustScore += $projectScore;
        }

        return (int) round(min(100, $trustScore));
    }
}
