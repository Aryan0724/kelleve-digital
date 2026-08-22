with open('tests/Feature/C1/Marketplace/OwnershipTest.php', 'r') as f:
    c = f.read()
c = c.replace("'professional_id' => $pro->id,", "")
c = c.replace("$quote = Bid::create([", "$project->professional_id = $pro->id;\n        $project->save();\n\n        $quote = Bid::create([")
with open('tests/Feature/C1/Marketplace/OwnershipTest.php', 'w') as f:
    f.write(c)
