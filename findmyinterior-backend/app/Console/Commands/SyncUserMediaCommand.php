<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Listing;

class SyncUserMediaCommand extends Command
{
    protected $signature = 'user:sync-media';
    protected $description = 'Sync user avatar and cover image';

    public function handle()
    {
        $u = User::withoutGlobalScopes()->where('name', 'like', '%integral%')->first()
            ?? User::withoutGlobalScopes()->find(2311);

        if ($u) {
            $u->avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb';
            $u->cover_image = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6';
            $u->save();

            $l = Listing::withoutGlobalScopes()->where('user_id', $u->id)->first();
            if ($l) {
                $l->cover_image = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6';
                $l->save();
            }

            $this->info("Updated user {$u->id} media cleanly.");
        } else {
            $this->error("User not found.");
        }
    }
}
