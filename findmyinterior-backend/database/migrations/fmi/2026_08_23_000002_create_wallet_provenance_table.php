<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';

    /**
     * Wallet provenance audit table.
     *
     * Every wallet record (all 2,301 in the legacy dataset) receives exactly one
     * provenance record. This table provides an immutable migration/audit trail
     * without modifying the application wallet schema.
     *
     * Classification rules (evaluated per-wallet at migration time):
     *   REAL_LEDGER_RECONCILED        – real user (is_mock=0), balance matches wallet_transactions sum
     *   REAL_UNRECONCILED             – real user (is_mock=0), balance present, no matching ledger trail
     *   LEGACY_SYNTHETIC_OPENING_BALANCE – mock user (is_mock=1), balance seeded directly
     *   UNVERIFIED_LEGACY_BALANCE     – admin or special case, origin cannot be proven
     *
     * Financial restriction: LEGACY_SYNTHETIC_OPENING_BALANCE wallets MUST NOT be
     * treated as real-world purchasing power in any production context.
     */
    public function up(): void
    {
        Schema::create('wallet_provenance', function (Blueprint $table) {
            $table->id();

            // FK to migrated wallet
            $table->foreignId('wallet_id')->constrained('wallets')->cascadeOnDelete();

            // FK to owner
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // Classification as evaluated at migration time
            $table->string('classification')->comment(
                'REAL_LEDGER_RECONCILED | REAL_UNRECONCILED | LEGACY_SYNTHETIC_OPENING_BALANCE | UNVERIFIED_LEGACY_BALANCE'
            );

            // Financial restriction flag — true if this balance cannot be real purchasing power
            $table->boolean('is_synthetic')->default(false);

            // The legacy balance at time of migration (immutable audit reference)
            $table->decimal('legacy_balance', 15, 2)->default(0);

            // The sum of wallet_transactions for this user at migration time
            $table->decimal('ledger_balance', 15, 2)->default(0);

            // Difference between stored balance and ledger sum (positive = unledgered credit)
            $table->decimal('unledgered_balance', 15, 2)->default(0);

            // The legacy user's is_mock flag at migration time (snapshot)
            $table->boolean('was_mock_at_migration')->default(false);

            // Free-text justification for the classification
            $table->text('classification_reason')->nullable();

            // Timestamp this provenance record was written
            $table->timestamp('migrated_at')->useCurrent();

            $table->index('wallet_id');
            $table->index('user_id');
            $table->index('classification');
            $table->index('is_synthetic');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallet_provenance');
    }
};
