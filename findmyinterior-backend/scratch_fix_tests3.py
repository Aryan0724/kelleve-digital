import os, glob

for filepath in glob.glob('tests/Feature/**/*.php', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple replacements
    content = content.replace("'requirements'", "'projects'")
    content = content.replace('"requirements"', '"projects"')
    content = content.replace("table('requirements')", "table('projects')")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
