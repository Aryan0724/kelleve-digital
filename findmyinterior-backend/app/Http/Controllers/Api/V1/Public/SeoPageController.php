<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\SeoPage;
use App\Services\ShortcodeService;
use Illuminate\Http\Request;

class SeoPageController extends Controller
{
    public function show($slug)
    {
        $page = SeoPage::active()->where('slug', $slug)->first();

        if (!$page) {
            return response()->json([
                'status' => 'error',
                'message' => 'Page not found'
            ], 404);
        }

        // Process dynamic shortcodes
        $page->title = ShortcodeService::parse($page->title);
        $page->meta_title = ShortcodeService::parse($page->meta_title);
        $page->meta_description = ShortcodeService::parse($page->meta_description);
        $page->content = ShortcodeService::parse($page->content);

        // blocks_json can also be parsed if it's dynamic, but usually it's just raw data
        // If we want to parse it, we can convert to JSON string, parse, and decode back
        if (!empty($page->blocks_json)) {
            $jsonString = json_encode($page->blocks_json);
            $parsedString = ShortcodeService::parse($jsonString);
            $page->blocks_json = json_decode($parsedString, true);
        }

        return response()->json([
            'status' => 'success',
            'data' => $page
        ]);
    }
}
