<?php
namespace App\Traits;
trait ApiResponse {
    protected function success($data, $message = '', $code = 200) {
        return response()->json(['success' => true, 'data' => $data, 'message' => $message], $code);
    }
    protected function error($message, $code = 400) {
        return response()->json(['success' => false, 'message' => $message], $code);
    }
    protected function paginated($paginator, $message = '') {
        return response()->json([
            'success' => true, 'message' => $message, 'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(), 'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(), 'total' => $paginator->total()
            ]
        ]);
    }
}
