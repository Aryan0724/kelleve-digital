<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PrivilegeCard;

class PrivilegeCardController extends Controller
{
    public function index(Request $request)
    {
        $card = PrivilegeCard::where('user_id', $request->user()->id)->first();
        if (!$card) {
            // Auto generate for TrueDial users
            $card = PrivilegeCard::create([
                'user_id' => $request->user()->id,
                'card_number' => 'TD-' . rand(1000, 9999) . '-' . rand(1000, 9999),
                'status' => 'active',
                'valid_until' => now()->addYear(),
            ]);
        }
        return response()->json(['success' => true, 'data' => $card]);
    }

    public function claim(Request $request)
    {
        return response()->json(['success' => true, 'message' => 'Offer claimed using Privilege Card']);
    }
}
