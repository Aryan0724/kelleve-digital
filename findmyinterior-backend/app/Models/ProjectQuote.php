<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectQuote extends Model
{
    protected $connection = 'fmi_mysql';
    protected $table = 'bids';

    protected $guarded = ['id'];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->requirement_type = 'project';
        });
    }

    public function project()
    {
        return $this->belongsTo(Requirement::class, 'requirement_id');
    }

    public function professional()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }
}
