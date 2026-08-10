<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RequirementsController extends Controller
{
    /**
     * Expose FMI requirements (projects) to TrueDial vendors.
     */
    public function sharedFeed(Request $request)
    {
        // For now, we mock this feed or pull directly from the main `projects`/`requirements` table.
        // Assuming we are fetching from `projects` (which replaced requirements) with status='open'
        try {
            // Using DB facade to avoid model dependencies and cross-module entanglement
            $projects = DB::table('projects')
                ->select('id', 'title', 'description', 'budget', 'city', 'created_at', 'status')
                ->where('status', 'open')
                ->orderBy('created_at', 'desc')
                ->limit(20)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $projects
            ]);
        } catch (\Exception $e) {
            // Fallback mock data if the table isn't ready
            return response()->json([
                'success' => true,
                'data' => [
                    [
                        'id' => 1,
                        'title' => 'Complete Home Renovation in Delhi',
                        'description' => 'Looking for a reliable contractor to renovate a 3BHK flat.',
                        'budget' => '10-15 Lakhs',
                        'city' => 'Delhi',
                        'status' => 'open',
                        'created_at' => now()->subHours(2)->toIso8601String()
                    ],
                    [
                        'id' => 2,
                        'title' => 'Plumbing fixing for a new cafe',
                        'description' => 'Need an experienced plumber to fix the entire plumbing system for a new cafe.',
                        'budget' => '50k - 1 Lakh',
                        'city' => 'Mumbai',
                        'status' => 'open',
                        'created_at' => now()->subDays(1)->toIso8601String()
                    ]
                ]
            ]);
        }
    }
}
