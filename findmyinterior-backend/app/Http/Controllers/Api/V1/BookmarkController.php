<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use App\Models\Listing;
use App\Models\Project;
use App\Models\Requirement;
use App\Models\Worker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $bookmarks = Bookmark::with('bookmarkable')
            ->where('user_id', $user->id)
            ->latest()
            ->get();
            
        // Process bookmarks to include display details
        $formatted = $bookmarks->map(function($bookmark) {
            $item = $bookmark->bookmarkable;
            if (!$item) return null;
            
            $type = class_basename($bookmark->bookmarkable_type);
            
            $displayItem = [
                'id' => $bookmark->id,
                'item_id' => $item->id,
                'type' => $type,
                'created_at' => $bookmark->created_at,
            ];
            
            if ($type === 'Listing') {
                $displayItem['title'] = $item->title ?? $item->business_name ?? $item->name ?? 'Professional';
                $displayItem['subtitle'] = is_string($item->category) ? $item->category : ($item->category?->name ?? 'Professional Service');
                $displayItem['image'] = $item->cover_image ?? $item->user?->avatar;
                $displayItem['link'] = "/professionals/" . ($item->slug ?: $item->id);
            } elseif ($type === 'Worker') {
                $displayItem['title'] = $item->name ?? $item->user?->name ?? 'Worker';
                $displayItem['subtitle'] = $item->skill ?? $item->trade ?? 'Skilled Worker';
                $displayItem['image'] = $item->avatar ?? $item->user?->avatar ?? null;
                $displayItem['link'] = "/workers/" . ($item->slug ?: $item->id);
            } elseif ($type === 'Requirement' || $type === 'Project') {
                $displayItem['title'] = $item->title ?? 'Project Requirement';
                $displayItem['subtitle'] = is_string($item->project_category) ? $item->project_category : ($item->type ?? 'Project');
                $displayItem['image'] = null;
                $displayItem['link'] = "/projects/" . $item->id;
            } else {
                $displayItem['title'] = $item->title ?? $item->name ?? 'Saved Item';
                $displayItem['subtitle'] = is_string($item->subtitle ?? '') ? ($item->subtitle ?? '') : '';
                $displayItem['image'] = null;
                $displayItem['link'] = "#";
            }
            
            return $displayItem;
        })->filter()->values();

        return response()->json([
            'status' => 'success',
            'data' => $formatted
        ]);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'type' => 'required|string|in:Listing,Worker,Requirement,Project'
        ]);

        $user = Auth::user();
        
        // Resolve model class
        $modelClass = match($request->type) {
            'Listing' => Listing::class,
            'Worker' => Worker::class,
            'Requirement' => Requirement::class,
            'Project' => Project::class,
            default => null
        };
        
        if (!$modelClass) {
            return response()->json(['error' => 'Invalid type'], 400);
        }
        
        $item = $modelClass::find($request->id);
        if (!$item) {
            return response()->json(['error' => 'Item not found'], 404);
        }
        
        $bookmark = Bookmark::where('user_id', $user->id)
            ->where('bookmarkable_id', $item->id)
            ->where('bookmarkable_type', $modelClass)
            ->first();
            
        if ($bookmark) {
            $bookmark->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Removed from bookmarks',
                'is_bookmarked' => false
            ]);
        } else {
            Bookmark::create([
                'user_id' => $user->id,
                'bookmarkable_id' => $item->id,
                'bookmarkable_type' => $modelClass
            ]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Added to bookmarks',
                'is_bookmarked' => true
            ]);
        }
    }
}
