<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequirementImage extends Model
{
    protected $connection = 'fmi_mysql';
    protected $fillable = ['requirement_id', 'image_url'];

    public function requirement(): BelongsTo
    {
        return $this->belongsTo(Requirement::class);
    }
}
