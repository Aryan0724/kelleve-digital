<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SubscriptionPlanController extends Controller
{
    use \App\Traits\ApiResponse;

    public function index(): JsonResponse
    {
        $plans = SubscriptionPlan::latest()->get();
        return $this->success($plans);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:subscription_plans,slug',
            'description' => 'nullable|string',
            'price_monthly' => 'required|numeric|min:0',
            'price_yearly' => 'required|numeric|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        $plan = SubscriptionPlan::create($validated);
        return $this->success($plan, 'Subscription Plan created successfully', 201);
    }

    public function update(Request $request, SubscriptionPlan $subscriptionPlan): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:subscription_plans,slug,' . $subscriptionPlan->id,
            'description' => 'nullable|string',
            'price_monthly' => 'sometimes|numeric|min:0',
            'price_yearly' => 'sometimes|numeric|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        $subscriptionPlan->update($validated);
        return $this->success($subscriptionPlan, 'Subscription Plan updated successfully');
    }

    public function destroy(SubscriptionPlan $subscriptionPlan): JsonResponse
    {
        $subscriptionPlan->delete();
        return $this->success(null, 'Subscription Plan deleted successfully');
    }
}
