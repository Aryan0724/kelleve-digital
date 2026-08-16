import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

php_script = r"""<?php
require_once '/var/www/html/vendor/autoload.php';
$app = require '/var/www/html/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

function testResolve($slug) {
    echo "--- TESTING: '$slug' ---\n";
    
    // 1. Exact slug
    $listing = \App\Models\Listing::withoutGlobalScopes()->where('slug', $slug)->first();
    if ($listing) {
        echo "MATCH 1 (Exact slug): ID {$listing->id} | Title: {$listing->title} | User: {$listing->user?->name}\n";
        return;
    }

    // 2. Numeric ID (id or user_id)
    if (is_numeric($slug)) {
        $listing = \App\Models\Listing::withoutGlobalScopes()->where('id', $slug)->orWhere('user_id', $slug)->first();
        if ($listing) {
            echo "MATCH 2 (Numeric ID): ID {$listing->id} | Title: {$listing->title} | User: {$listing->user?->name}\n";
            return;
        }
    }

    // 3. Match all words in slug across title, slug, and user.name
    $words = array_values(array_filter(explode('-', $slug), fn($w) => strlen($w) >= 3 && !is_numeric($w)));
    if (!empty($words)) {
        $query = \App\Models\Listing::withoutGlobalScopes();
        foreach ($words as $word) {
            $query->where(function($q) use ($word) {
                $q->where('slug', 'LIKE', "%{$word}%")
                  ->orWhere('title', 'LIKE', "%{$word}%")
                  ->orWhereHas('user', fn($uq) => $uq->where('name', 'LIKE', "%{$word}%"));
            });
        }
        $listing = $query->first();
        if ($listing) {
            echo "MATCH 3 (Word match " . implode(',', $words) . "): ID {$listing->id} | Title: {$listing->title} | User: {$listing->user?->name}\n";
            return;
        }
    }

    echo "NO MATCH FOUND\n";
}

testResolve('integral-groups-database-1BdHBH');
testResolve('integral-groups-1786820946');
testResolve('integral-groups-1786697922');
testResolve('2311');
"""

sftp = client.open_sftp()
with sftp.file('/tmp/test_slug_resolver.php', 'w') as f:
    f.write(php_script)
sftp.close()

cmd = "docker cp /tmp/test_slug_resolver.php fmi_backend:/tmp/test_slug_resolver.php && docker exec fmi_backend php /tmp/test_slug_resolver.php"
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode('utf-8', errors='replace'))
client.close()
