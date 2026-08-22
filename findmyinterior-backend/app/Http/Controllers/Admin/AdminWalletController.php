<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\WalletService;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminWalletController extends Controller
{
    private WalletService $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    /**
     * PATCH /api/v1/admin/users/{id}/wallet/adjust
     */
    public function adjustBalance(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|not_in:0',
            'reason' => 'required|string|max:500'
        ]);

        $user = User::findOrFail($id);
        $amount = (float) $validated['amount'];
        $reason = $validated['reason'];
        
        $adminId = auth()->id();
        $isCredit = $amount > 0;
        $eventType = $isCredit ? 'ADMIN_CREDIT' : 'ADMIN_DEBIT';

        return DB::transaction(function () use ($user, $amount, $reason, $adminId, $eventType, $isCredit) {
            $beforeBalance = $this->walletService->getBalance($user);
            
            $meta = [
                'source' => 'admin_adjustment',
                'created_by' => $adminId
            ];

            if ($isCredit) {
                $this->walletService->addFunds($user, $amount, $reason, $meta);
            } else {
                $this->walletService->deduct($user, abs($amount), $reason, $meta);
            }

            $afterBalance = $this->walletService->getBalance($user);

            ActivityLog::recordAdminAction(
                $adminId,
                $eventType,
                $user,
                ['balance' => $beforeBalance],
                ['balance' => $afterBalance],
                $reason
            );

            return response()->json([
                'success' => true,
                'message' => 'Wallet balance adjusted successfully.',
                'before_balance' => $beforeBalance,
                'after_balance' => $afterBalance,
                'adjustment_amount' => $amount
            ]);
        });
    }
}
