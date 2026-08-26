<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $fillable = [
        'user_id', 'title', 'slug', 'company_name', 'company_logo',
        'location', 'job_type', 'experience_level', 'salary_range',
        'description', 'requirements', 'contact_email', 'contact_phone',
        'apply_url', 'is_active'
    ];

    protected $casts = [
        'requirements' => 'json',
        'is_active' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
