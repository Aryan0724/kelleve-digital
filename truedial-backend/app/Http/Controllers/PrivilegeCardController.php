<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\PrivilegeCard;
use App\Traits\ApiResponse;
class PrivilegeCardController extends Controller {
    use ApiResponse;
    public function generate(Request $request) { return $this->success(PrivilegeCard::create($request->all())); }
    public function myCards(Request $request) { return $this->success(PrivilegeCard::where('user_id', $request->user()->id)->get()); }
}
