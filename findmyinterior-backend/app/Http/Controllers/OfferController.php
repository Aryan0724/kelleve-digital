<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Offer;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        $offers = Offer::where('status', 'active')->with('listing')->get();
        return response()->json(['success' => true, 'data' => $offers]);
    }

    public function claim(Request $request)
    {
        return response()->json(['success' => true, 'message' => 'Offer successfully saved!']);
    }
}
