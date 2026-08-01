import urllib.request
import re
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

url = "https://findmyinterior.com/"

try:
    print(f"1. Fetching full HTML from {url}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='replace')
        print(f"   -> HTTP Status: {resp.status} (Length: {len(html)} bytes)")

    # Extract all asset URLs (<script src="...">, <link href="...">, <img src="...">)
    script_urls = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html)
    link_urls = re.findall(r'<link[^>]+href=["\']([^"\']+)["\']', html)
    
    print(f"\n2. Found {len(script_urls)} <script> tags and {len(link_urls)} <link> tags.")
    
    # Test first 10 assets
    all_assets = (script_urls + link_urls)[:10]
    for asset in all_assets:
        full_url = asset if asset.startswith('http') else 'https://findmyinterior.com' + ('/' if not asset.startswith('/') else '') + asset
        try:
            areq = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(areq, timeout=5) as aresp:
                print(f"   [OK 200] {full_url[:80]} ({len(aresp.read())} bytes)")
        except Exception as ae:
            print(f"   [ERROR] {full_url[:80]} -> {ae}")

except Exception as e:
    print("ERROR loading page:", e)
