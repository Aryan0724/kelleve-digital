<?php
namespace App\Http\Controllers\Public;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
class AcademyController extends Controller {
    use ApiResponse;
    public function courses() { return $this->success([]); }
}
