<?php
use App\Models\Location;
use App\Models\Setting;
use Illuminate\Support\Str;

$cities = ["Patna", "Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Noida", "Gurugram"];
foreach ($cities as $city) {
    Location::updateOrCreate(
        ["name" => $city],
        ["slug" => Str::slug($city), "is_active" => true]
    );
}

$settings = [
    ["key" => "bid_fee_contractor", "value" => "10.00", "type" => "integer", "group" => "fees", "description" => "Bid fee for Contractors"],
    ["key" => "bid_fee_builder", "value" => "25.00", "type" => "integer", "group" => "fees", "description" => "Bid fee for Builders"],
    ["key" => "bid_fee_architect", "value" => "15.00", "type" => "integer", "group" => "fees", "description" => "Bid fee for Architects"],
    ["key" => "bid_fee_interior", "value" => "15.00", "type" => "integer", "group" => "fees", "description" => "Bid fee for Interior Designers"],
    ["key" => "bid_fee_worker", "value" => "0.00", "type" => "integer", "group" => "fees", "description" => "Bid fee for Skilled Workers"],
    ["key" => "bid_fee_supplier", "value" => "5.00", "type" => "integer", "group" => "fees", "description" => "Bid fee for Suppliers"],
    ["key" => "platform_commission_percent", "value" => "5", "type" => "integer", "group" => "fees", "description" => "Platform commission percentage on completed projects"],
    ["key" => "contact_unlock_fee", "value" => "50.00", "type" => "integer", "group" => "fees", "description" => "Fee to unlock a lead contact"],
];

foreach ($settings as $s) {
    Setting::updateOrCreate(
        ["key" => $s["key"]],
        $s
    );
}
echo "Seeded successfully.";

