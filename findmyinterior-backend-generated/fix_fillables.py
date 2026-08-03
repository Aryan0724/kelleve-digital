import os
import re

dangerous_fields = [
    "'role'", '"role"',
    "'is_active'", '"is_active"',
    "'is_verified'", '"is_verified"',
    "'is_featured'", '"is_featured"',
    "'is_premium'", '"is_premium"',
    "'avg_rating'", '"avg_rating"',
    "'review_count'", '"review_count"',
    "'views_count'", '"views_count"',
    "'status'", '"status"',
    "'is_approved'", '"is_approved"'
]

models_dir = r"d:\find my interior\findmyinterior-backend\app\Models"
log_file = r"C:\Users\Aryan\.gemini\antigravity-ide\brain\a5378ccc-dc52-4fc5-a346-7f595a5f65f8\SECURITY_FIXES.md"

fixes_made = []

for root, dirs, files in os.walk(models_dir):
    for file in files:
        if file.endswith(".php"):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            new_content = content
            modified = False

            # We want to remove dangerous fields from the $fillable array
            for field in dangerous_fields:
                if field in new_content:
                    # Remove field, preceding/trailing spaces, and optional comma
                    # Example matches: "'role', ", " 'role',", "'role'"
                    pattern = r"[\s]*" + re.escape(field) + r"[\s]*,?"
                    new_content = re.sub(pattern, "", new_content)
                    modified = True
                    fixes_made.append(f"- Removed `{field}` from `$fillable` in `{file}`")

            if modified:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)

with open(log_file, 'w', encoding='utf-8') as f:
    f.write("# Security Fixes\n\n")
    if fixes_made:
        f.write("\n".join(fixes_made))
    else:
        f.write("No dangerous fillables found.")

print("Fillables scrubbing complete.")
