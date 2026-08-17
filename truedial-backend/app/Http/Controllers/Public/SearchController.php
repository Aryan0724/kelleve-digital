<?php
namespace App\Http\Controllers\Public;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\Category;
use App\Traits\ApiResponse;
class SearchController extends Controller {
    use ApiResponse;
    public function index(Request $request) {
        $query = Listing::active();
        if ($q = $request->q) $query->where('title', 'like', "%$q%");
        return $this->paginated($query->paginate(10));
    }
    public function autocomplete(Request $request) {
        $query = Listing::active()->select('id', 'title', 'slug', 'city')->limit(10);
        if ($q = $request->q) $query->where('title', 'like', "%$q%");
        return $this->success($query->get());
    }
    public function categories() {
        return $this->success(Category::active()->ordered()->get());
    }
}
