<?php

namespace App\Models;

use App\Traits\TenantAwareTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use HasFactory, TenantAwareTrait, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'model_type',
        'model_id',
        'collection_name',
        'file_name',
        'mime_type',
        'disk',
        'size',
        'width',
        'height',
        'alt_text',
        'blur_hash',
        'dominant_color',
        'sort_order',
        'is_cover',
    ];

    public function model(): MorphTo
    {
        return $this->morphTo();
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
