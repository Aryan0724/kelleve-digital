<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoPage extends Model
{
    protected $connection = 'fmi_mysql';
    protected $fillable = [
        'title', 'slug', 'meta_title', 'meta_description', 'content', 'blocks_json', 'schema_json', 'is_active'
    ];

    protected $casts = [
        'schema_json' => 'array',
        'blocks_json' => 'array',
        'is_active' => 'boolean',
    ];

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // ─── Static Helpers ───────────────────────────────────────────────────────

    public static function forSlug(string $slug): ?self
    {
        return static::active()->where('slug', $slug)->first();
    }
}
