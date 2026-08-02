import urllib.request
import sys

try:
    req = urllib.request.Request(
        'https://findmyinterior.com', 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    html = urllib.request.urlopen(req).read().decode('utf-8')
    lines = html.split('\n')
    for i, line in enumerate(lines):
        if 'viewport' in line.lower():
            print(f"Found on line {i}: {line.strip()}")
            sys.exit(0)
    print("NO VIEWPORT TAG FOUND")
except Exception as e:
    print(f"Error: {e}")
