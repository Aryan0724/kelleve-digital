<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionPlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $badge = '1 YEAR';
        $durationMonths = 12;
        $formattedPrice = '₹' . number_format((float) $this->price_yearly, 2);

        if ($this->slug === 'starter' || $this->price_yearly == 0) {
            $badge = 'FREE';
            $durationMonths = 0;
            $formattedPrice = 'Free';
        } elseif ($this->slug === 'quickstart') {
            $badge = '3 MONTHS';
            $durationMonths = 3;
            $formattedPrice = '₹' . number_format((float) $this->price_yearly, 2);
        } elseif ($this->slug === 'growthplus') {
            $badge = '6 MONTHS';
            $durationMonths = 6;
            $formattedPrice = '₹' . number_format((float) $this->price_yearly, 2);
        }

        return [
            'id'                       => $this->id,
            'name'                     => $this->name,
            'slug'                     => $this->slug,
            'target_role_category'     => $this->target_role_category,
            'price'                    => (float) $this->price_yearly,
            'price_monthly'            => $this->price_monthly,
            'price_yearly'             => $this->price_yearly,
            'formatted_price'          => $formattedPrice,
            'billing_badge'            => $badge,
            'duration_months'          => $durationMonths,
            'is_popular'               => $this->slug === 'probusiness',
            'features'                 => $this->features ?? [],
            'max_listings'             => $this->max_listings,
            'max_gallery_images'       => $this->max_gallery_images,
            'can_see_all_leads'        => $this->can_see_all_leads,
            'is_featured_listing'      => $this->is_featured_listing,
            'monthly_wallet_credit'    => $this->monthly_wallet_credit,
            'badge_type'               => $this->badge_type,
        ];
    }
}
