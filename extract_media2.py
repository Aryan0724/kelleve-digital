import urllib.request
import re

try:
    req = urllib.request.Request(
        'https://findmyinterior.com/_next/static/chunks/35eux_6rgd406.css', 
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    css = urllib.request.urlopen(req).read().decode('utf-8')
    media_queries = re.findall(r'@media\s*[^{]+', css)
    print("Media Queries Found:", set(media_queries))
except Exception as e:
    print(f"Error: {e}")
