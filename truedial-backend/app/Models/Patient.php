<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 'patient_identifier', 'name', 'age', 'gender', 'phone',
        'blood_group', 'condition', 'status', 'allergies', 'notes', 'last_visit_at'
    ];

    protected $casts = [
        'last_visit_at' => 'datetime',
        'age' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
