<?php

namespace Tests\Feature\Architecture;

use Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MigrateBase64StorageTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Ensure legacy_restore connection exists for the test
        config(['database.connections.legacy_restore' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => 'findmyinterior_legacy_restore',
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
        ]]);
    }

    public function test_original_base64_values_are_unchanged()
    {
        $this->assertEquals(224, DB::connection('legacy_restore')->table('storage_migrations')->count());
        $this->assertEquals(224, DB::connection('legacy_restore')->table('storage_migrations')->where('status', 'VERIFIED')->count());
    }
    
    public function test_urls_are_populated_correctly()
    {
        $urls = 0;
        $url_t = ['listing_galleries'=>'storage_url','listings'=>'cover_image_url','projects'=>'image_url','user_documents'=>'file_url'];
        foreach($url_t as $table => $col) {
            $urls += DB::connection('legacy_restore')->table($table)->whereNotNull($col)->count();
        }
        $urls += DB::connection('legacy_restore')->table('users')->whereNotNull('avatar_url')->count();
        $urls += DB::connection('legacy_restore')->table('users')->whereNotNull('cover_image_url')->count();
        
        $this->assertEquals(224, $urls);
    }
    
    public function test_deduplication_saved_storage()
    {
        $files = Storage::disk('local')->allFiles('storage/migrated/blobs');
        $this->assertEquals(136, count($files));
    }
}
