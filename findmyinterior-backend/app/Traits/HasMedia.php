<?php

namespace App\Traits;

use App\Models\Media;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasMedia
{
    /**
     * Get all of the models's media.
     */
    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'model')->orderBy('sort_order');
    }

    /**
     * Get the model's primary image/cover.
     */
    public function primaryMedia(): MorphOne
    {
        return $this->morphOne(Media::class, 'model')->where('collection_name', 'cover')->orderBy('sort_order');
    }

    /**
     * Scope a query to include media.
     */
    public function scopeWithMedia($query)
    {
        return $query->with('media');
    }
}
