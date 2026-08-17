<?php
namespace App\Http\Controllers\Public;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
class JobBoardController extends Controller {
    use ApiResponse;
    public function index() { return $this->success([]); }
}
