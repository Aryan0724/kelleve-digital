with open('tests/Feature/C1/Marketplace/OwnershipTest.php', 'r') as f:
    c = f.read()
c = c.replace("'amount' => 100,", "'amount' => 100,\n            'timeline_days' => 30,\n            'proposal_message' => 'I can do it!',")
with open('tests/Feature/C1/Marketplace/OwnershipTest.php', 'w') as f:
    f.write(c)
