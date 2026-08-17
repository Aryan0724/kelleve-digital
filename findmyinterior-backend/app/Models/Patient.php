<?php

namespace App\Models;

use App\Traits\TenantAwareTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, TenantAwareTrait, SoftDeletes;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'patient_identifier',
        'name',
        'age',
        'gender',
        'phone',
        'blood_group',
        'condition',
        'status',
        'allergies',
        'notes',
        'last_visit_at',
    ];

    protected $casts = [
        'last_visit_at' => 'datetime',
    ];
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->patient_identifier)) {
                $model->patient_identifier = 'P-' . mt_rand(10000, 99999);
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
