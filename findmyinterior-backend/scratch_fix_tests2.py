import os

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("DB::table('requirements')->insertGetId", "DB::table('projects')->insertGetId")
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('tests/Feature/RevenueAnalyticsTest.php')

print("Fixed")
