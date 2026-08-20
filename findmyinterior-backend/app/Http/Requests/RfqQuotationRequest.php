<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RfqQuotationRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user() && ($this->user()->isBusiness() || $this->user()->isSupplier() || $this->user()->isBuilder());
    }

    public function rules()
    {
        return [
            'amount' => 'required|numeric|min:1',
            'estimated_cost' => 'required|numeric|min:1',
            'proposal_message' => 'required|string|max:2000',
            'timeline_days' => 'required|integer|min:1',
            'warranty_months' => 'nullable|integer|min:0',
        ];
    }
}
