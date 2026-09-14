<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';

    public function up(): void
    {
        if (!Schema::connection('fmi_mysql')->hasTable('advertisement_stats')) {
            Schema::connection('fmi_mysql')->create('advertisement_stats', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('advertisement_id');
                $table->date('date');
                $table->unsignedBigInteger('impressions')->default(0);
                $table->unsignedBigInteger('clicks')->default(0);
                $table->timestamps();

                $table->foreign('advertisement_id')->references('id')->on('advertisements')->onDelete('cascade');
                $table->unique(['advertisement_id', 'date']);
            });
        }
    }

    public function down(): void
    {
        Schema::connection('fmi_mysql')->dropIfExists('advertisement_stats');
    }
};
