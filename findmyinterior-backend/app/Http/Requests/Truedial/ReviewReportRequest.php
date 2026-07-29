<?php

namespace App\Http\Requests\Truedial;

use Illuminate\Foundation\Http\FormRequest;

class ReviewReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'in:Spam,Fake review,Offensive,Wrong business,Other'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
