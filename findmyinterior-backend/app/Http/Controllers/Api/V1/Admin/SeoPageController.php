<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoPage;
use Illuminate\Http\Request;

class SeoPageController extends Controller
{
    public function index()
    {
        $pages = SeoPage::orderBy('id', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $pages
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:seo_pages',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'blocks_json' => 'nullable|array',
            'schema_json' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        $page = SeoPage::create($validated);

        return response()->json([
            'status' => 'success',
            'data' => $page
        ], 201);
    }

    public function show($id)
    {
        $page = SeoPage::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $page
        ]);
    }

    public function update(Request $request, $id)
    {
        $page = SeoPage::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'slug' => 'string|max:255|unique:seo_pages,slug,' . $id,
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'blocks_json' => 'nullable|array',
            'schema_json' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        $page->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => $page
        ]);
    }

    public function destroy($id)
    {
        $page = SeoPage::findOrFail($id);
        $page->delete();

        return response()->json([
            'status' => 'success'
        ]);
    }
}
