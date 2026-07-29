<?php

namespace App\Http\Requests\Truedial;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Listing;

class BusinessUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check(); // Further authorized in controller policy
    }

    public function rules(): array
    {
        return [
            'category_id' => 'sometimes|required|exists:categories,id',
            'city_id' => 'sometimes|required|exists:cities,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'phone' => 'sometimes|required|string',
            'email' => 'nullable|email',
            'address' => 'sometimes|required|string',
            'district' => 'sometimes|required|string|max:100',
            'state' => 'sometimes|required|string|max:100',
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
            'availability' => 'nullable|array',
        ];
    }
}
