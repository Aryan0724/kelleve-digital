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
        \Illuminate\Support\Facades\DB::statement("UPDATE users SET avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', cover_image = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6' WHERE id = 2311 OR id = 773 OR name LIKE '%integral%'");
        \Illuminate\Support\Facades\DB::statement("UPDATE listings SET cover_image = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6' WHERE user_id = 2311 OR user_id = 773 OR title LIKE '%integral%'");
        $this->info("Direct SQL update completed for user 2311 & listing 1635.");
    }
}
