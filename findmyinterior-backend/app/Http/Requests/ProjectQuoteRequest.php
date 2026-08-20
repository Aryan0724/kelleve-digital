<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectQuoteRequest extends FormRequest
{
    public function authorize()
    {
        // Workers apply to worker-jobs, not interior projects
        return $this->user() && ($this->user()->isBusiness() || $this->user()->isBuilder());
    }

    public function rules()
    {
        return [
            'amount' => 'required|numeric|min:1',
            'estimated_cost' => 'required|numeric|min:1', // Some tests rely on this
            'proposal_message' => 'required|string|max:2000',
            'timeline_days' => 'required|integer|min:1',
            'warranty_months' => 'nullable|integer|min:0',
            'design_included' => 'nullable|boolean',
            'supervision_included' => 'nullable|boolean',
            'portfolio_urls' => 'nullable|array',
            'previous_projects_count' => 'nullable|integer|min:0',
        ];
    }
}
