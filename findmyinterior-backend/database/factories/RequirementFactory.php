<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\City;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RequirementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'      => User::factory(),
            'category_id'  => Category::factory(),
            'city_id'      => null,
            'district_id'  => null,
            'title'        => fake()->sentence(4),
            'description'  => fake()->paragraph(),
            'project_type' => 'residential',
            'budget_min'   => 50000,
            'budget_max'   => 200000,
            'city'         => fake()->city(),
            'district'     => fake()->state(),
            'name'         => fake()->name(),
            'phone'        => fake()->phoneNumber(),
            'email'        => fake()->safeEmail(),
            'status'       => 'open',
        ];
    }
}
