<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);
        return [
            'name'      => ucfirst($name),
            'slug'      => Str::slug($name) . '-' . fake()->unique()->randomNumber(4),
            'icon'      => null,
            'image'     => null,
            'is_active' => true,
            'sort_order'=> 0,
        ];
    }
}
