<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Requirement;
use App\Models\VendorMetric;
use Illuminate\Support\Facades\DB;

class InviteController extends Controller
{
    public function invite(Request $request, $id): JsonResponse
    {
        $request->validate([
            'vendor_id' => 'required|exists:users,id'
        ]);

        $type = $request->query('requirement_type', 'project');
        $modelClass = \App\Models\Requirement::class;
        if ($type === 'rfq') $modelClass = \App\Models\Rfq::class;
        if ($type === 'job') $modelClass = \App\Models\WorkerJob::class;
        
        $requirement = $modelClass::findOrFail($id);
        $vendorId = $request->vendor_id;

        // Ensure only the requirement owner or admin can invite
        if ($request->user()->id !== $requirement->user_id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Update recommendation audit table
        $updated = DB::table('requirement_recommendations')
            ->where('requirement_id', $requirement->id)
            ->where('requirement_type', $modelClass)
            ->where('vendor_id', $vendorId)
            ->update([
                'invited_at' => now(),
                'updated_at' => now()
            ]);

        // If they were recommended and updated, increment invites_received
        if ($updated) {
            VendorMetric::where('vendor_id', $vendorId)->increment('invites_received');
        }

        // Send notification unconditionally
        DB::table('notifications')->insert([
            'user_id'    => $vendorId,
            'type'       => 'invite_to_bid',
            'title'      => 'You have been invited to bid!',
            'message'    => "The customer for project '{$requirement->title}' has specifically invited you to submit a quote.",
            'data'       => json_encode(['requirement_id' => $requirement->id]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Vendor invited successfully.']);
    }
}
