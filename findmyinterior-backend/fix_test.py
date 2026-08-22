with open('tests/Feature/C1/Marketplace/OwnershipTest.php', 'r') as f:
    c = f.read()
c = c.replace("'user_id' => $pro->id", "'professional_id' => $pro->id")
with open('tests/Feature/C1/Marketplace/OwnershipTest.php', 'w') as f:
    f.write(c)
