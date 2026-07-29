<?php

namespace App\Http\Requests\Truedial;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class BusinessStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'city_id' => 'required|exists:cities,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'phone' => 'required|string',
            'email' => 'nullable|email',
            'address' => 'required|string',
            'district' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'website' => 'nullable|url',
            'years_experience' => 'nullable|integer|min:0',
            'team_size' => 'nullable|integer|min:1',
            'budget_tier' => 'nullable|string|in:low,medium,high,premium',
            'languages' => 'nullable|array',
            'languages.*' => 'string',
            'social_links' => 'nullable|array',
            'social_links.facebook' => 'nullable|url',
            'social_links.instagram' => 'nullable|url',
            'social_links.linkedin' => 'nullable|url',
            'social_links.twitter' => 'nullable|url',
            'social_links.youtube' => 'nullable|url',
            'availability' => 'nullable|array', // { "monday": ["09:00", "18:00"], ... }
        ];
    }
}
