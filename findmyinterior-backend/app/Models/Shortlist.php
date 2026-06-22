<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shortlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'professional_id',
        'project_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function professional()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
