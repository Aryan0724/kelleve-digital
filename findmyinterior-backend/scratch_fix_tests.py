import os

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("assertDatabaseHas('requirements'", "assertDatabaseHas('projects'")
    content = content.replace("'reviewable_type' => \\App\\Models\\Listing::class,\n            'reviewable_id' => $listing->id", "'listing_id' => $listing->id")
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('tests/Feature/GoldenFlowTest.php')
fix_file('tests/Feature/GoldenPathTest.php')

print("Fixed")
