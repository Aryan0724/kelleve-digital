<?php
namespace App\Http\Controllers\Vendor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Listing;
use App\Traits\ApiResponse;
class BusinessController extends Controller {
    use ApiResponse;
    public function myBusiness(Request $request) {
        return $this->success(Listing::where('user_id', $request->user()->id)->get());
    }
    public function store(Request $request) {
        $listing = Listing::create($request->all() + ['user_id' => $request->user()->id]);
        return $this->success($listing);
    }
    public function update(Request $request, $id) {
        $listing = Listing::where('user_id', $request->user()->id)->findOrFail($id);
        $listing->update($request->all());
        return $this->success($listing);
    }
    public function updateProducts(Request $request, $id) { return $this->success(null); }
    public function updateServices(Request $request, $id) { return $this->success(null); }
}
