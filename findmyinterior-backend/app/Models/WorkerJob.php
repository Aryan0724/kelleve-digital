<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkerJob extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'worker_jobs';

    protected $fillable = [
        'user_id', 'title', 'description', 'city', 'district',
        'opportunity_type', 'requirement_type', 'creator_role', 'target_roles',
        'status',
    ];

    protected $casts = [
        'target_roles' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class, 'requirement_id'); // Temporary until bids table migrates to polymorphic
    }
}
