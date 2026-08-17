<?php
namespace App\Http\Controllers\Public;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
class NewsController extends Controller {
    use ApiResponse;
    public function index() { return $this->success([]); }
}
