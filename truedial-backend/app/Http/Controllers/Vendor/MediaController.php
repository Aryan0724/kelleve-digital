<?php
namespace App\Http\Controllers\Vendor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Media;
use App\Traits\ApiResponse;
class MediaController extends Controller {
    use ApiResponse;
    public function index() { return $this->success([]); }
    public function upload(Request $request) { return $this->success(null); }
    public function destroy($id) { return $this->success(null); }
}
