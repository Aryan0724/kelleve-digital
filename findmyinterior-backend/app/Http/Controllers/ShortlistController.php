<?php

namespace App\Http\Controllers;

use App\Models\Shortlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShortlistController extends Controller
{
    public function index(Request $request)
    {
        $shortlists = Shortlist::with(['professional', 'project'])
            ->where('user_id', Auth::id())
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $shortlists
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'professional_id' => 'required|exists:users,id',
            'project_id' => 'nullable|exists:projects,id',
        ]);

        $shortlist = Shortlist::firstOrCreate([
            'user_id' => Auth::id(),
            'professional_id' => $request->professional_id,
        ], [
            'project_id' => $request->project_id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Professional shortlisted successfully',
            'data' => $shortlist
        ], 201);
    }

    public function destroy($professional_id)
    {
        $deleted = Shortlist::where('user_id', Auth::id())
            ->where('professional_id', $professional_id)
            ->delete();

        if ($deleted) {
            return response()->json([
                'status' => 'success',
                'message' => 'Professional removed from shortlist'
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Shortlist entry not found'
        ], 404);
    }
}
