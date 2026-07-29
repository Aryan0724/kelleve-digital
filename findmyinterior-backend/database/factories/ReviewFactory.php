<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => 1,
            'user_id' => \App\Models\User::factory(),
            'reviewer_id' => \App\Models\User::factory(),
            'reviewable_type' => \App\Models\Listing::class,
            'reviewable_id' => 1, // Will be overridden or ignored usually if not used
            'listing_id' => null,
            'rating' => $this->faker->numberBetween(1, 5),
            'title' => $this->faker->sentence(),
            'body' => $this->faker->paragraph(),
            'status' => 'approved',
        ];
    }
}
