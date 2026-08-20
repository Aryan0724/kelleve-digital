<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $table = 'bids';

    protected $guarded = ['id'];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->requirement_type = 'job';
        });
    }

    public function job()
    {
        return $this->belongsTo(Requirement::class, 'requirement_id');
    }

    public function worker()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }
}
