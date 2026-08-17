<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use SoftDeletes;
    
    protected $fillable = ['tenant_id', 'model_type', 'model_id', 'collection_name', 'file_name', 'mime_type', 'disk', 'size', 'width', 'height', 'alt_text', 'sort_order', 'is_cover'];
    
    public function model() { return $this->morphTo(); }
}

