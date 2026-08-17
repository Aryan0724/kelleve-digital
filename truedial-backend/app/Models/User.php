<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, SoftDeletes;
    protected $fillable = [
        'name', 'email', 'phone', 'password', 'professional_type', 'avatar',
        'is_active', 'is_mock', 'is_verified', 'is_verified_business',
        'verification_level', 'profile_completion_score', 'trust_score',
        'daily_notification_limit', 'primary_role_id'
    ];
    protected $hidden = ['password', 'remember_token'];
    
    public function roles() {
        return $this->belongsToMany(Role::class, 'user_roles');
    }
    public function wallet() {
        // Mock wallet for now
        return $this->hasOne(Wallet::class); // assuming Wallet exists or not needed to fully define
    }
}

