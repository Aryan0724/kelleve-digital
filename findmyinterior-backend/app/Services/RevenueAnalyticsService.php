<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class RevenueAnalyticsService
{
    /**
     * Get revenue broken down by type and time period.
     */
    public function getRevenueSummary(): array
    {
        $today    = now()->toDateString();
        $weekAgo  = now()->subDays(7)->toDateString();
        $monthAgo = now()->subDays(30)->toDateString();
        $yearAgo  = now()->subDays(365)->toDateString();

        // Revenue by type across all time
        $byType = DB::table('wallet_transactions')
            ->where('type', 'debit')
            ->selectRaw("description, SUM(amount) as total, COUNT(*) as count")
            ->groupBy('description')
            ->get();

        // Revenue today
        $revenueToday = DB::table('wallet_transactions')
            ->where('type', 'debit')
            ->whereDate('created_at', $today)
            ->sum('amount');

        // Revenue this week
        $revenueWeek = DB::table('wallet_transactions')
            ->where('type', 'debit')
            ->whereDate('created_at', '>=', $weekAgo)
            ->sum('amount');

        // Revenue this month
        $revenueMonth = DB::table('wallet_transactions')
            ->where('type', 'debit')
            ->whereDate('created_at', '>=', $monthAgo)
            ->sum('amount');

        // MRR (Monthly Recurring Revenue from subscriptions)
        $mrr = DB::table('wallet_transactions')
            ->where('type', 'debit')
            ->where('description', 'like', '%subscription%')
            ->whereDate('created_at', '>=', $monthAgo)
            ->sum('amount');

        // ARPU (Average Revenue Per User — total active users with any wallet activity)
        $activeUsers = DB::table('wallet_transactions')
            ->whereDate('created_at', '>=', $monthAgo)
            ->distinct('wallet_id')
            ->count('wallet_id');

        $arpu = $activeUsers > 0 ? round($revenueMonth / $activeUsers, 2) : 0;

        // Revenue by category (unlock, bid, subscription, recharge, ads)
        $categories = [
            'contact_unlock'  => DB::table('wallet_transactions')->where('type', 'debit')->where('description', 'like', '%unlock%')->sum('amount'),
            'subscription'    => DB::table('wallet_transactions')->where('type', 'debit')->where('description', 'like', '%subscription%')->sum('amount'),
            'bid'             => DB::table('wallet_transactions')->where('type', 'debit')->where('description', 'like', '%bid%')->sum('amount'),
            'recharges_total' => DB::table('wallet_transactions')->where('type', 'credit')->sum('amount'),
        ];

        return [
            'revenue_today'   => (float) $revenueToday,
            'revenue_week'    => (float) $revenueWeek,
            'revenue_month'   => (float) $revenueMonth,
            'mrr'             => (float) $mrr,
            'arpu'            => (float) $arpu,
            'by_type'         => $byType,
            'by_category'     => $categories,
        ];
    }

    /**
     * Get funnel conversion metrics.
     */
    public function getFunnelMetrics(): array
    {
        $totalRequirements = DB::table('projects')->count();
        $requirementsWithBids = DB::table('bids')->distinct('requirement_id')->count('requirement_id');
        $totalBids = DB::table('bids')->count();
        $awardedBids = DB::table('bids')->where('status', 'awarded')->count();
        $awardedRequirements = DB::table('projects')->where('status', 'awarded')->count();
        $completedRequirements = DB::table('projects')->where('status', 'completed')->count();

        $leadToBidRate = $totalRequirements > 0
            ? round(($requirementsWithBids / $totalRequirements) * 100, 2)
            : 0;

        $bidToAwardRate = $totalBids > 0
            ? round(($awardedBids / $totalBids) * 100, 2)
            : 0;

        $awardToCompletionRate = $awardedRequirements > 0
            ? round(($completedRequirements / $awardedRequirements) * 100, 2)
            : 0;

        return [
            'total_requirements'       => $totalRequirements,
            'requirements_with_bids'   => $requirementsWithBids,
            'total_bids'               => $totalBids,
            'awarded_bids'             => $awardedBids,
            'awarded_requirements'     => $awardedRequirements,
            'completed_requirements'   => $completedRequirements,
            'lead_to_bid_rate'         => $leadToBidRate,
            'bid_to_award_rate'        => $bidToAwardRate,
            'award_to_completion_rate' => $awardToCompletionRate,
        ];
    }
}
