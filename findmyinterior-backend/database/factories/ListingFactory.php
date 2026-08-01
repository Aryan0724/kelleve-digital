<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\City;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ListingFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->company();
        return [
            'user_id'     => User::factory(),
            'category_id' => Category::factory(),
            'city_id'     => null,
            'title'       => $title,
            'slug'        => Str::slug($title) . '-' . fake()->unique()->randomNumber(5),
            'description' => fake()->paragraph(),
            'status'      => 'active',
            'phone'       => fake()->phoneNumber(),
            'city'        => fake()->city(),
            'district'    => fake()->state(),
            'state'       => fake()->state(),
        ];
    }
}
