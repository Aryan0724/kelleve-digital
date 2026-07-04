<?php
use App\Models\User;
use App\Models\Listing;
use App\Models\Role;
use App\Models\Category;
use Illuminate\Support\Str;

$cities = ["Delhi", "Mumbai", "Bangalore", "Gaya"];
$contractorRole = Role::where("slug", "contractor")->first();
$contractorCat = Category::where("slug", "contractor")->first();
$architectRole = Role::where("slug", "architect")->first();
$architectCat = Category::where("slug", "architect")->first();

foreach($cities as $city) {
    // Create contractor in city
    $u = User::updateOrCreate(["email" => "contractor.$city@mock3.com"], ["name" => "Mock Contractor $city", "password" => bcrypt("password"), "phone" => "9876543".rand(100,999)]);
    if($contractorRole && !$u->roles->contains($contractorRole->id)) $u->roles()->attach($contractorRole->id);
    $u->markEmailAsVerified();
    
    Listing::updateOrCreate(
        ["user_id" => $u->id], 
        [
            "title" => "Build$city Contractors", 
            "slug" => Str::slug("Build$city Contractors-".rand(10,99)),
            "category_id" => $contractorCat ? $contractorCat->id : null,
            "city" => $city, 
            "is_verified" => true, 
            "status" => "active"
        ]
    );
    
    // Create architect in city
    $u2 = User::updateOrCreate(["email" => "architect.$city@mock3.com"], ["name" => "Mock Architect $city", "password" => bcrypt("password"), "phone" => "8765432".rand(100,999)]);
    if($architectRole && !$u2->roles->contains($architectRole->id)) $u2->roles()->attach($architectRole->id);
    $u2->markEmailAsVerified();

    Listing::updateOrCreate(
        ["user_id" => $u2->id], 
        [
            "title" => "Design$city Architects", 
            "slug" => Str::slug("Design$city Architects-".rand(10,99)),
            "category_id" => $architectCat ? $architectCat->id : null,
            "city" => $city, 
            "is_verified" => true, 
            "status" => "active"
        ]
    );
}
echo "Seeded mock 3 in other cities";

