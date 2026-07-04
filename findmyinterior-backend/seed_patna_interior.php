<?php
use App\Models\User;
use App\Models\Listing;
use App\Models\Role;
use App\Models\Category;
use Illuminate\Support\Str;

$interiorRole = Role::where("slug", "designer")->first() ?? Role::where("slug", "interior_designer")->first();
$interiorCat = Category::where("slug", "interior-designers")->first();

$u = User::updateOrCreate(["email" => "interior.patna2@mock.com"], ["name" => "Mock Interior Patna 2", "password" => bcrypt("password"), "phone" => "9876543".rand(100,999)]);
if($interiorRole && !$u->roles->contains($interiorRole->id)) $u->roles()->attach($interiorRole->id);
$u->markEmailAsVerified();

Listing::updateOrCreate(
    ["user_id" => $u->id], 
    [
        "title" => "Patna Interior Studio", 
        "slug" => Str::slug("Patna Interior Studio-".rand(10,99)),
        "category_id" => $interiorCat ? $interiorCat->id : null,
        "city" => "Patna", 
        "description" => "A very nice interior design studio in Patna.",
        "tagline" => "Best interiors",
        "is_verified" => true, 
        "status" => "active"
    ]
);
echo "Seeded interior designer in Patna";

