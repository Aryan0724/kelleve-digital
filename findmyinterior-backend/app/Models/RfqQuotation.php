<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RfqQuotation extends Model
{
    protected $table = 'bids';

    protected $guarded = ['id'];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->requirement_type = 'rfq';
        });
    }

    public function rfq()
    {
        return $this->belongsTo(Requirement::class, 'requirement_id');
    }

    public function supplier()
    {
        return $this->belongsTo(User::class, 'professional_id');
    }
}
