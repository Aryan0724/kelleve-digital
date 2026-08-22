<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::create('districts', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->string('state', 100)->default('Bihar');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('state');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('districts');
    }
};
