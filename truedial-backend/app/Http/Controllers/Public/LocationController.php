<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\City;
use App\Models\District;
use App\Models\Location;
use App\Traits\ApiResponse;

class LocationController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $cities = City::where('is_active', true)->orderBy('name')->get();
        $districts = District::where('is_active', true)->orderBy('name')->get();

        return $this->success([
            'cities' => $cities,
            'districts' => $districts,
        ]);
    }

    public function cities(Request $request)
    {
        $cities = City::where('is_active', true)->orderBy('name')->get();
        return $this->success($cities);
    }

    public function districts(Request $request)
    {
        $districts = District::where('is_active', true)->orderBy('name')->get();
        return $this->success($districts);
    }
}
