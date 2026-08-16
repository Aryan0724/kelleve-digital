<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Listing;

class SyncUserMediaCommand extends Command
{
    protected $signature = 'app:sync-media';
    protected $description = 'Sync user avatar and cover image';

    public function handle()
    {
        $users = User::withoutGlobalScopes()->where('name', 'like', '%integral%')->orWhere('id', 2311)->get();
        foreach ($users as $u) {
            $u->avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb';
            $u->cover_image = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6';
            $u->save();
            $this->info("Updated User #{$u->id} ({$u->name}) avatar and cover.");

            $listings = Listing::withoutGlobalScopes()->where('user_id', $u->id)->get();
            foreach ($listings as $l) {
                $l->cover_image = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6';
                $l->save();
                $this->info("Updated Listing #{$l->id} (user_id #{$l->user_id}) cover image.");
            }
        }
    }
}
