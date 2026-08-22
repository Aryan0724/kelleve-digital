<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogTag extends Model
{
    protected $connection = 'fmi_mysql';
    public $timestamps = false;

    protected $fillable = ['blog_id', 'tag'];

    public function blog(): BelongsTo
    {
        return $this->belongsTo(Blog::class);
    }
}
