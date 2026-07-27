import urllib.request
import re

try:
    html = urllib.request.urlopen('https://findmyinterior.com/login').read().decode('utf-8')
    js_files = set(re.findall(r'/_next/static/chunks/[^"]+\.js', html))
    print('Found JS files:', len(js_files))
    
    for f in js_files:
        try:
            js = urllib.request.urlopen('https://findmyinterior.com' + f).read().decode('utf-8')
            urls = re.findall(r'https?://(?:localhost|187\.127\.164\.142|findmyinterior\.com)[^"\'\`\s]*', js)
            if urls:
                print(f'Match in {f}:', set(urls))
        except Exception as e:
            print('Error fetching', f, e)
except Exception as e:
    print('Error:', e)
