<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CallLogController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_type' => 'required|string|in:listing,builder,supplier,worker,builder_project',
            'receiver_id' => 'required|integer',
        ]);

        $morphMap = [
            'listing'  => \App\Models\Listing::class,
            'builder'  => \App\Models\Builder::class,
            'supplier' => \App\Models\Supplier::class,
            'worker'   => \App\Models\Worker::class,
            'builder_project' => \App\Models\BuilderProject::class,
        ];

        \App\Models\CallLog::create([
            'caller_id' => $request->user('sanctum')?->id,
            'caller_ip' => $request->ip(),
            'receiver_type' => $morphMap[$validated['receiver_type']],
            'receiver_id' => $validated['receiver_id'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Call intent logged successfully.'
        ]);
    }
}
