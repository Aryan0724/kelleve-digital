<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectMilestone extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id', 'title', 'description', 'percentage', 'amount',
        'status', 'payment_status', 'images'
    ];

    protected $casts = [
        'images' => 'array',
        'percentage' => 'integer',
        'amount' => 'decimal:2',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
