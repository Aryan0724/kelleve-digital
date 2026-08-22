<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuilderProjectImage extends Model
{
    protected $connection = 'fmi_mysql';
    protected $fillable = ['builder_project_id', 'image_url', 'caption', 'sort_order'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(BuilderProject::class, 'builder_project_id');
    }
}
