<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $user = User::where('email', 'admin@findmyinterior.com')->first();
        if ($user) {
            $user->email = 'Aryantiwari@findmyinterior.com';
            $user->password = Hash::make('findmyinterior');
            $user->save();
        } else {
            $user = User::where('email', 'Aryantiwari@findmyinterior.com')->first();
            if ($user) {
                $user->password = Hash::make('findmyinterior');
                $user->role = 'admin';
                $user->save();
            } else {
                User::create([
                    'name' => 'FindMyInterior Admin',
                    'email' => 'Aryantiwari@findmyinterior.com',
                    'password' => Hash::make('findmyinterior'),
                    'role' => 'admin',
                    'verification_level' => 'verified_business'
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
