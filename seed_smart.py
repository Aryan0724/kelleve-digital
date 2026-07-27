import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

php_script = """
use App\\Models\\SeoPage;
use App\\Models\\Advertisement;
use App\\Models\\User;

// 1. Create a dynamic CMS page
$page = SeoPage::updateOrCreate(
    ['slug' => 'dynamic-test-page'],
    [
        'title' => 'Welcome to {{ current_year }}!',
        'meta_title' => 'Test Page',
        'meta_description' => 'We currently have {{ total_professionals }} professionals.',
        'content' => '<h1>Hello</h1><p>There are {{ total_cities }} cities active.</p>',
        'blocks_json' => [
            'blocks' => [
                ['type' => 'header', 'data' => ['text' => 'This is a dynamic block', 'level' => 2]],
                ['type' => 'paragraph', 'data' => ['text' => 'This block was parsed by Next.js']]
            ]
        ],
        'schema_json' => ['@context' => 'https://schema.org', '@type' => 'WebPage', 'name' => 'Test'],
        'is_active' => true
    ]
);
echo "CMS Page Created.\\n";

// 2. Create a smart self-serve ad
$admin = User::first(); // Just get any user
$ad = Advertisement::updateOrCreate(
    ['title' => 'Smart Rotating Ad - Test'],
    [
        'location' => 'hero_banner',
        'media_type' => 'html',
        'custom_code' => '<div style="background: linear-gradient(90deg, #ff8a00, #e52e71); color: white; padding: 20px; text-align: center; border-radius: 8px;"><h2>Special Professional Offer</h2><p>Click me! (Auto-pauses after 5 clicks)</p></div>',
        'budget' => 500,
        'max_impressions' => 100,
        'max_clicks' => 5,
        'priority' => 100,
        'is_active' => true,
        'user_id' => $admin->id,
        'created_by' => $admin->id
    ]
);
echo "Smart Ad Created.\\n";
"""

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Write php script to temp file and run tinker
sftp = client.open_sftp()
with sftp.file('/var/www/find-my-interior/findmyinterior-backend/seed_smart.php', 'w') as f:
    f.write("<?php\n" + php_script)
sftp.close()

print("Running seeder...")
stdin, stdout, stderr = client.exec_command('cd /var/www/find-my-interior/findmyinterior-backend && docker exec fmi_backend php artisan tinker /var/www/html/seed_smart.php')
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))

client.close()
