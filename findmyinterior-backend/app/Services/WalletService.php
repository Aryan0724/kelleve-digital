<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;

class WalletService
{
    /**
     * Get user's wallet balance
     */
    public function getBalance(User $user): float
    {
        $wallet = DB::table('wallets')->where('user_id', $user->id)->first();
        return $wallet ? (float) $wallet->balance : 0.0;
    }

    /**
     * Deduct funds from wallet (e.g. for unlocking contact)
     */
    public function deduct(User $user, float $amount, string $description, array $meta = []): bool
    {
        if ($amount <= 0) {
            throw new Exception("Deduction amount must be positive.");
        }

        return DB::transaction(function () use ($user, $amount, $description, $meta) {
            $wallet = DB::table('wallets')->where('user_id', $user->id)->lockForUpdate()->first();
            
            if (!$wallet || $wallet->balance < $amount) {
                throw new Exception("Insufficient wallet balance.");
            }

            // Deduct
            DB::table('wallets')->where('id', $wallet->id)->decrement('balance', $amount);

            // Record transaction
            DB::table('wallet_transactions')->insert([
                'wallet_id' => $wallet->id,
                'type' => 'debit',
                'amount' => $amount,
                'description' => $description,
                'source' => $meta['source'] ?? null,
                'reference_type' => $meta['reference_type'] ?? null,
                'reference_id' => $meta['reference_id'] ?? null,
                'status' => $meta['status'] ?? 'success',
                'created_by' => $meta['created_by'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return true;
        });
    }

    /**
     * Add funds to wallet (e.g. via Razorpay recharge)
     */
    public function addFunds(User $user, float $amount, string $description, array $meta = []): bool
    {
        if ($amount <= 0) {
            throw new Exception("Add amount must be positive.");
        }

        return DB::transaction(function () use ($user, $amount, $description, $meta) {
            $wallet = DB::table('wallets')->where('user_id', $user->id)->lockForUpdate()->first();
            
            if (!$wallet) {
                // Create wallet if it doesn't exist
                $walletId = DB::table('wallets')->insertGetId([
                    'user_id' => $user->id,
                    'balance' => $amount,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                DB::table('wallets')->where('id', $wallet->id)->increment('balance', $amount);
                $walletId = $wallet->id;
            }

            // Record transaction
            DB::table('wallet_transactions')->insert([
                'wallet_id' => $walletId,
                'type' => 'credit',
                'amount' => $amount,
                'description' => $description,
                'source' => $meta['source'] ?? null,
                'reference_type' => $meta['reference_type'] ?? null,
                'reference_id' => $meta['reference_id'] ?? null,
                'status' => $meta['status'] ?? 'success',
                'created_by' => $meta['created_by'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return true;
        });
    }
}
