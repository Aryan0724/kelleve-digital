import urllib.request
import re

try:
    req = urllib.request.Request(
        'https://findmyinterior.com', 
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    html = urllib.request.urlopen(req).read().decode('utf-8')
    
    # Find all classes like w-[...px] or min-w-[...px]
    matches = re.findall(r'w-\[\d+px\]|min-w-\[\d+px\]', html)
    print("Found fixed widths in SSR HTML:", set(matches))
    
    # Check for any inline styles with width
    styles = re.findall(r'style="[^"]*width:[^"]*"', html)
    print("Found inline styles with width in SSR HTML:", set(styles))
    
except Exception as e:
    print(f"Error: {e}")
