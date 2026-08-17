<?php
namespace App\Http\Controllers\Vendor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Offer;
use App\Traits\ApiResponse;
class OfferManagementController extends Controller {
    use ApiResponse;
    public function index() { return $this->success(Offer::all()); }
    public function store(Request $request) { return $this->success(Offer::create($request->all())); }
    public function update(Request $request, $id) { $offer = Offer::findOrFail($id); $offer->update($request->all()); return $this->success($offer); }
    public function destroy($id) { Offer::destroy($id); return $this->success(null); }
}
