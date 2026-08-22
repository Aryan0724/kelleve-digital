<?php

namespace Tests\Feature\Performance;

use Illuminate\Foundation\Testing\DatabaseTruncation;
use Tests\TestCase;
use App\Models\Requirement;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class NPlusOneTest extends TestCase
{
    use DatabaseTruncation;
    protected $seeder = \Database\Seeders\SecurityTestSeeder::class;

    public function test_projects_endpoint_prevents_n_plus_one_queries()
    {
        \Illuminate\Support\Facades\Queue::fake();
        $user = User::factory()->create();
        
        // Create 30 projects
        Requirement::factory()->count(30)->create([
            'opportunity_type' => null,
            'category_id' => 2 // Assumes category ID 2 is not 'workers'
        ]);

        DB::enableQueryLog();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/projects?per_page=20');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data',
            'meta' => ['current_page', 'per_page', 'total', 'last_page']
        ]);

        $queries = collect(DB::getQueryLog());
        dump("EXACT QUERY COUNT: " . $queries->count());
        
        $this->assertLessThan(10, $queries->count(), 'Found N+1 query vulnerability! Executed ' . $queries->count() . ' queries.');
    }
}
