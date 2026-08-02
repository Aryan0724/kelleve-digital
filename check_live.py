import urllib.request
import re

req = urllib.request.Request('https://findmyinterior.com', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

# Find all JS chunk URLs
chunks = re.findall(r'/_next/static/chunks/.*?\.js', html)
print("Chunks found:", len(chunks))

found = False
for chunk in chunks:
    chunk_url = 'https://findmyinterior.com' + chunk
    try:
        req2 = urllib.request.Request(chunk_url, headers={'User-Agent': 'Mozilla/5.0'})
        js = urllib.request.urlopen(req2).read().decode('utf-8')
        if 'Use current location' in js or 'navigator.geolocation' in js:
            print("FOUND IN:", chunk)
            found = True
            break
    except Exception as e:
        pass

if not found:
    print("NOT FOUND IN ANY CHUNK!")
