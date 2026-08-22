with open('tests/Feature/C1/Marketplace/OwnershipTest.php', 'r') as f:
    c = f.read()
c = c.replace("'professional_id' => $pro->id,", "'professional_id' => $pro->id,\n            'amount' => 100,")
with open('tests/Feature/C1/Marketplace/OwnershipTest.php', 'w') as f:
    f.write(c)
