<?php

namespace Tests\Feature\Architecture;

use Tests\TestCase;
use App\Models\Requirement;
use App\Models\Listing;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class CrossDatabaseIsolationTest extends TestCase
{
    public function test_models_resolve_to_correct_connections()
    {
        $project = new \App\Models\Project();
        $this->assertEquals('fmi_mysql', $project->getConnectionName(), 'Project must use fmi_mysql connection');

        $listing = new Listing();
        $this->assertEquals('truedial_mysql', $listing->getConnectionName(), 'Listing must use truedial_mysql connection');
    }

    public function test_fmi_tables_exist_only_in_fmi_db()
    {
        // Prove Projects exist in FMI DB
        $fmiSchema = DB::connection('fmi_mysql')->getSchemaBuilder();
        $this->assertTrue($fmiSchema->hasTable('projects'), 'FMI DB must have projects table');

        // Prove Projects DO NOT exist in TrueDial DB
        $tdSchema = DB::connection('truedial_mysql')->getSchemaBuilder();
        $this->assertFalse($tdSchema->hasTable('projects'), 'TrueDial DB MUST NOT have projects table');
        
        // Assert Negative Isolation: Querying Project on TrueDial connection should fail
        $this->expectException(QueryException::class);
        $this->expectExceptionMessageMatches('/(Table|View).*projects.*doesn\'t exist/');
        \App\Models\Project::on('truedial_mysql')->first();
    }

    public function test_truedial_tables_exist_only_in_truedial_db()
    {
        // Prove Listings exist in TrueDial DB
        $tdSchema = DB::connection('truedial_mysql')->getSchemaBuilder();
        $this->assertTrue($tdSchema->hasTable('listings'), 'TrueDial DB must have listings table');

        // Prove Listings DO NOT exist in FMI DB
        $fmiSchema = DB::connection('fmi_mysql')->getSchemaBuilder();
        $this->assertFalse($fmiSchema->hasTable('listings'), 'FMI DB MUST NOT have listings table');

        // Assert Negative Isolation: Querying Listing on FMI connection should fail
        $this->expectException(QueryException::class);
        $this->expectExceptionMessageMatches('/(Table|View).*listings.*doesn\'t exist/');
        Listing::on('fmi_mysql')->first();
    }
}
