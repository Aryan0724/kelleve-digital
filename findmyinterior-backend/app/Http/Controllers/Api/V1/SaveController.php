<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SavedProject;
use App\Models\SavedVendor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SaveController extends Controller
{
    public function saveProject(Request $request, int $requirementId): JsonResponse
    {
        $type = $request->query('requirement_type', 'project');
        $morphType = 'Project';
        if ($type === 'rfq') $morphType = 'Rfq';
        if ($type === 'job') $morphType = 'WorkerJob';

        $saved = SavedProject::firstOrCreate([
            'user_id' => $request->user()->id,
            'requirement_id' => $requirementId,
            'requirement_type' => $morphType,
        ]);

        return response()->json([
            'message' => 'Requirement saved successfully',
            'saved' => $saved
        ]);
    }

    public function unsaveProject(Request $request, int $requirementId): JsonResponse
    {
        $type = $request->query('requirement_type', 'project');
        $morphType = 'Project';
        if ($type === 'rfq') $morphType = 'Rfq';
        if ($type === 'job') $morphType = 'WorkerJob';

        SavedProject::where('user_id', $request->user()->id)
            ->where('requirement_id', $requirementId)
            ->where('requirement_type', $morphType)
            ->delete();

        return response()->json([
            'message' => 'Requirement unsaved successfully'
        ]);
    }

    public function getSavedProjects(Request $request): JsonResponse
    {
        $projects = SavedProject::with('requirement')
            ->where('user_id', $request->user()->id)
            ->get();
            
        return response()->json(['success' => true, 'data' => $projects]);
    }

    public function saveVendor(Request $request, int $vendorId): JsonResponse
    {
        $saved = SavedVendor::firstOrCreate([
            'user_id' => $request->user()->id,
            'vendor_id' => $vendorId
        ]);

        return response()->json(['success' => true, 'message' => 'Vendor saved']);
    }

    public function unsaveVendor(Request $request, int $vendorId): JsonResponse
    {
        SavedVendor::where('user_id', $request->user()->id)
            ->where('vendor_id', $vendorId)
            ->delete();

        return response()->json(['success' => true, 'message' => 'Vendor unsaved']);
    }

    public function getSavedVendors(Request $request): JsonResponse
    {
        $vendors = SavedVendor::with('vendor')
            ->where('user_id', $request->user()->id)
            ->get();
            
        return response()->json(['success' => true, 'data' => $vendors]);
    }
}
