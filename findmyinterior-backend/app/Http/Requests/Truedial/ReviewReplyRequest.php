<?php

namespace App\Http\Requests\Truedial;

use Illuminate\Foundation\Http\FormRequest;

class ReviewReplyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // We do authorization via Policy in controller/service
    }

    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'max:2000'],
        ];
    }
}
