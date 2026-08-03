import os
import re
import csv

src_dir = r'd:\find my interior\findmyinterior-frontend\src'
output = []

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            rel_path = os.path.relpath(path, src_dir)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find buttons
            for match in re.finditer(r'<button[^>]*>(.*?)</button>', content, re.DOTALL | re.IGNORECASE):
                btn_attrs = match.group(0)
                btn_text = re.sub(r'<[^>]+>', '', match.group(1)).strip()[:30]
                onclick = re.search(r'onClick=\{([^}]+)\}', btn_attrs)
                handler = onclick.group(1).strip() if onclick else 'None'
                output.append({'file': rel_path, 'type': 'Button', 'text': btn_text, 'handler': handler})
                
            # Find forms
            for match in re.finditer(r'<form[^>]*>', content, re.IGNORECASE):
                form_attrs = match.group(0)
                onsubmit = re.search(r'onSubmit=\{([^}]+)\}', form_attrs)
                handler = onsubmit.group(1).strip() if onsubmit else 'None'
                output.append({'file': rel_path, 'type': 'Form', 'text': 'Form Submit', 'handler': handler})
                
            # Find links
            for match in re.finditer(r'<Link[^>]*href=["\'{]([^"\'\}]+)["\'\}][^>]*>(.*?)</Link>', content, re.DOTALL | re.IGNORECASE):
                href = match.group(1)
                text = re.sub(r'<[^>]+>', '', match.group(2)).strip()[:30]
                output.append({'file': rel_path, 'type': 'Link', 'text': text, 'handler': href})

with open(r'd:\find my interior\findmyinterior-frontend\action_inventory.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['file', 'type', 'text', 'handler'])
    writer.writeheader()
    writer.writerows(output)
print(f'Found {len(output)} actions.')
