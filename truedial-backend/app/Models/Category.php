<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    
    protected $fillable = ['name', 'slug', 'icon', 'image', 'description', 'parent_id', 'sort_order', 'is_active', 'tenant_id'];

    public function scopeActive($query) { return $query->where('is_active', true); }
    public function scopeOrdered($query) { return $query->orderBy('sort_order'); }
    
    public function children() { return $this->hasMany(Category::class, 'parent_id'); }
    public function listings() { return $this->hasMany(Listing::class); }
}

