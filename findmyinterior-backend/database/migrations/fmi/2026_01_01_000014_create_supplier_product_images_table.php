<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::create('supplier_product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_product_id')->constrained('supplier_products')->cascadeOnDelete();
            $table->string('image_url');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('supplier_product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supplier_product_images');
    }
};
