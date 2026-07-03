import os
import re

models_dir = r"d:\find my interior\findmyinterior-backend\app\Models"

for root, _, files in os.walk(models_dir):
    for file in files:
        if file.endswith(".php"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Remove duplicate consecutive imports
            new_content = re.sub(r'(use Illuminate\\Database\\Eloquent\\Relations\\HasMany;\s+)+', r'use Illuminate\\Database\\Eloquent\\Relations\\HasMany;\n', content)
            
            if new_content != content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Fixed duplicate HasMany in {file}")
