<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DatabaseExplorerController extends Controller
{
    /**
     * GET /api/v1/admin/database/tables
     * List all database tables.
     */
    public function tables(): JsonResponse
    {
        // For MySQL/PostgreSQL/SQLite in Laravel 11
        $tables = array_column(Schema::getTables(), 'name');

        return response()->json([
            'success' => true,
            'data'    => $tables,
        ]);
    }

    /**
     * GET /api/v1/admin/database/query/{table}
     * Query a specific table with pagination.
     */
    public function query(Request $request, string $table): JsonResponse
    {
        if (!Schema::hasTable($table)) {
            return response()->json(['success' => false, 'message' => 'Table not found.'], 404);
        }

        $query = DB::table($table);

        // Basic search functionality if requested
        if ($request->filled('search') && $request->filled('search_column')) {
            $query->where($request->search_column, 'LIKE', '%' . $request->search . '%');
        }

        // Sorting
        $sortCol = $request->get('sort_by', 'id');
        $sortDir = $request->get('sort_dir', 'desc');

        if (Schema::hasColumn($table, $sortCol)) {
            $query->orderBy($sortCol, $sortDir);
        }

        $data = $query->paginate(15);
        $columns = Schema::getColumnListing($table);

        return response()->json([
            'success' => true,
            'data'    => $data->items(),
            'columns' => $columns,
            'meta'    => [
                'total'        => $data->total(),
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
            ]
        ]);
    }
    
    /**
     * DELETE /api/v1/admin/database/query/{table}/{id}
     * Delete a row (God Mode)
     */
    public function deleteRow(string $table, string $id): JsonResponse
    {
        if (!Schema::hasTable($table)) {
            return response()->json(['success' => false, 'message' => 'Table not found.'], 404);
        }
        
        DB::table($table)->where('id', $id)->delete();
        
        return response()->json(['success' => true, 'message' => 'Row deleted forever.']);
    }
}
