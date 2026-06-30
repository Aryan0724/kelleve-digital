<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bid extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'requirement_id',
        'requirement_type',
        'professional_id',
        'amount',
        'timeline_days',
        'warranty_months',
        'material_included',
        'labour_included',
        'design_included',
        'supervision_included',
        'portfolio_urls',
        'previous_projects_count',
        'proposal_message',
        'smart_bid_score',
        'status',
    ];
    
    protected $casts = [
        'portfolio_urls' => 'array',
        'material_included' => 'boolean',
        'labour_included' => 'boolean',
        'design_included' => 'boolean',
        'supervision_included' => 'boolean',
        'estimated_cost' => 'decimal:2',
        'smart_bid_score' => 'decimal:2',
    ];

    public function requirement()
    {
        return $this->morphTo(__FUNCTION__, 'requirement_type', 'requirement_id');
    }

    public function professional(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professional_id');
    }
}
