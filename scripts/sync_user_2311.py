import subprocess

php_code = r"""
$u = \App\Models\User::withoutGlobalScopes()->find(2311);
if ($u) {
    $u->avatar = '/storage/avatars/integral-logo.png';
    $u->cover_image = '/storage/covers/integral-cover.jpg';
    $u->save();
    
    $l = \App\Models\Listing::withoutGlobalScopes()->where('user_id', 2311)->first();
    if ($l) {
        $l->cover_image = '/storage/covers/integral-cover.jpg';
        $l->save();
    }
    echo "USER 2311 MEDIA POPULATED SUCCESSFULLY";
} else {
    echo "USER NOT FOUND";
}
"""

cmd = ['python', 'run_on_vps.py', f'docker exec fmi_backend php -r "{php_code.replace(chr(10), " ")} "']
res = subprocess.run(cmd, capture_output=True, text=True)
print(res.stdout)
