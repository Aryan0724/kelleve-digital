<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PodcastEpisode;

class PodcastController extends Controller
{
    public function index()
    {
        $episodes = PodcastEpisode::latest()->get();
        return response()->json([
            'success' => true,
            'data' => $episodes
        ]);
    }
}
