import requests
import re

try:
    response = requests.get('https://findmyinterior.com/login')
    html = response.text
    # Search for api base url in the html or js files
    matches = re.findall(r'https://[a-zA-Z0-9.-]+/api/v1', html)
    print("Found API URLs in HTML:")
    for match in set(matches):
        print(match)
        
    # Also find all JS script src
    scripts = re.findall(r'src="([^"]+\.js)"', html)
    for script in scripts:
        if script.startswith('/'):
            script_url = 'https://findmyinterior.com' + script
        else:
            script_url = script
        js_res = requests.get(script_url)
        js_matches = re.findall(r'https://[a-zA-Z0-9.-]+/api/v1', js_res.text)
        if js_matches:
            print(f"Found in {script}:")
            for match in set(js_matches):
                print(match)
except Exception as e:
    print(f"Error: {e}")
