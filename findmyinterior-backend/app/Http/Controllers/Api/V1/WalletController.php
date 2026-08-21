<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\WalletService;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    private WalletService $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    /**
     * Get user's wallet balance and transactions
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $balance = $this->walletService->getBalance($user);
        
        $wallet = DB::table('wallets')->where('user_id', $user->id)->first();
        
        $transactions = [];
        if ($wallet) {
            $transactions = DB::table('wallet_transactions')
                ->where('wallet_id', $wallet->id)
                ->orderByDesc('created_at')
                ->paginate(15);
        }

        return response()->json([
            'balance' => $balance,
            'transactions' => $transactions
        ]);
    }

    /**
     * Optional endpoint for admins to add funds manually, or a webhook processor
     * for Razorpay. For now, a placeholder for testing.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized. Only admins can manually add funds.'], 403);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id', // Specify which user gets funds
        ]);

        $targetUser = \App\Models\User::findOrFail($validated['user_id']);
        
        $description = $validated['description'] ?? 'Admin Wallet Adjustment';
        $this->walletService->addFunds($targetUser, $validated['amount'], $description, [
            'source' => 'ADMIN_ADJUSTMENT',
            'created_by' => $user->id,
            'status' => 'success'
        ]);

        return response()->json([
            'message' => 'Funds added successfully.',
            'new_balance' => $this->walletService->getBalance($targetUser)
        ]);
    }
}
