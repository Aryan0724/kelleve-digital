with open('tests/Feature/C1/Marketplace/OwnershipTest.php', 'r') as f:
    c = f.read()
c = c.replace("'status' => 'awarded',", "'status' => 'awarded',\n            'professional_id' => $pro->id,")
with open('tests/Feature/C1/Marketplace/OwnershipTest.php', 'w') as f:
    f.write(c)
