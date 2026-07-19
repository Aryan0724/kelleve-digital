<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $data = \Illuminate\Support\Facades\Cache::remember('locations_dropdown_' . ($request->has('active_only') ? 'active' : 'all'), 3600, function () use ($request) {
            $query = Location::query();
            if ($request->has('active_only')) {
                $query->where('is_active', true);
            }
            return $query->orderBy('name')->get()->toArray();
        });

        return response()->json(['success' => true, 'data' => $data]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:locations,name',
            'state' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);
        
        $validated['slug'] = Str::slug($validated['name']);
        if (!isset($validated['is_active'])) $validated['is_active'] = true;
        
        $location = Location::create($validated);
        \Illuminate\Support\Facades\Cache::forget('locations_dropdown_active');
        \Illuminate\Support\Facades\Cache::forget('locations_dropdown_all');
        return response()->json(['success' => true, 'data' => $location], 201);
    }

    public function update(Request $request, $id)
    {
        $location = Location::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:locations,name,'.$id,
            'state' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);
        
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        
        $location->update($validated);
        \Illuminate\Support\Facades\Cache::forget('locations_dropdown_active');
        \Illuminate\Support\Facades\Cache::forget('locations_dropdown_all');
        return response()->json(['success' => true, 'data' => $location]);
    }

    public function destroy($id)
    {
        Location::findOrFail($id)->delete();
        \Illuminate\Support\Facades\Cache::forget('locations_dropdown_active');
        \Illuminate\Support\Facades\Cache::forget('locations_dropdown_all');
        return response()->json(['success' => true]);
    }
}
