import urllib.request
import sys

try:
    req = urllib.request.Request(
        'https://findmyinterior.com', 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    html = urllib.request.urlopen(req).read().decode('utf-8')
    # Print the first 2000 chars of HTML to see the head
    print(html[:2000])
except Exception as e:
    print(f"Error: {e}")
