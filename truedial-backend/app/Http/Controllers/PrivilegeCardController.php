<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PrivilegeCard;
use App\Traits\ApiResponse;

class PrivilegeCardController extends Controller
{
    use ApiResponse;

    public function generate(Request $request)
    {
        $user = $request->user();
        
        $existing = PrivilegeCard::where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if ($existing) {
            return $this->success($existing, 'Existing active Privilege Card retrieved');
        }

        $cardNumber = 'TD-' . strtoupper(substr(uniqid(), -4)) . '-' . rand(1000, 9999);

        $card = PrivilegeCard::create([
            'user_id' => $user->id,
            'card_number' => $cardNumber,
            'status' => 'active',
            'valid_until' => now()->addYear(),
        ]);

        return $this->success($card, 'Privilege Card issued successfully', 201);
    }

    public function myCards(Request $request)
    {
        $cards = PrivilegeCard::where('user_id', $request->user()->id)->get();
        return $this->success($cards);
    }
}
