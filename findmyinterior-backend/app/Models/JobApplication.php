<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $connection = 'fmi_mysql';
    protected $table = 'job_applications';

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
        return $this->belongsTo(WorkerJob::class, 'requirement_id');
    }

    public function professional()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }
}
