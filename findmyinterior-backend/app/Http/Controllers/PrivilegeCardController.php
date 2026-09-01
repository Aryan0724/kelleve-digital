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
            // Auto generate basic card for TrueDial users
            $card = PrivilegeCard::create([
                'user_id' => $request->user()->id,
                'card_number' => 'TD-' . rand(1000, 9999) . '-' . rand(1000, 9999),
                'card_type' => 'Silver', // Default tier
                'price' => 0,
                'status' => 'active',
                'valid_until' => now()->addYear(),
            ]);
        }
        return response()->json(['success' => true, 'data' => $card]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'plan' => 'required|string|in:Silver,Gold,Platinum',
            'price' => 'required|numeric'
        ]);

        $card = PrivilegeCard::where('user_id', $request->user()->id)->first();

        if ($card) {
            $card->update([
                'card_type' => $request->plan,
                'price' => $request->price,
                'valid_until' => now()->addYear() // renew for a year
            ]);
        } else {
            $card = PrivilegeCard::create([
                'user_id' => $request->user()->id,
                'card_number' => 'TD-' . rand(1000, 9999) . '-' . rand(1000, 9999),
                'card_type' => $request->plan,
                'price' => $request->price,
                'status' => 'active',
                'valid_until' => now()->addYear(),
            ]);
        }

        return response()->json(['success' => true, 'data' => $card, 'message' => 'Privilege Card purchased successfully.']);
    }

    public function claim(Request $request)
    {
        return response()->json(['success' => true, 'message' => 'Offer claimed using Privilege Card']);
    }
}
