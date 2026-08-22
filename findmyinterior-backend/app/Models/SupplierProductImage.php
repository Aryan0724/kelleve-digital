<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupplierProductImage extends Model
{
    protected $connection = 'fmi_mysql';
    protected $fillable = ['supplier_product_id', 'image_url', 'sort_order'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(SupplierProduct::class, 'supplier_product_id');
    }
}
