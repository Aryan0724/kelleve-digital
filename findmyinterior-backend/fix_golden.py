with open('tests/Feature/C1/Marketplace/GoldenFlowTest.php', 'r') as f:
    c = f.read()
c = c.replace("'city_id' => City::firstOrCreate(['name' => 'TestCity', 'state_id' => 1])->id,", "'city_id' => City::first()->id,")
c = c.replace("'district_id' => District::firstOrCreate(['name' => 'TestDistrict', 'city_id' => City::first()->id])->id,", "'district_id' => District::first()->id,")
with open('tests/Feature/C1/Marketplace/GoldenFlowTest.php', 'w') as f:
    f.write(c)
