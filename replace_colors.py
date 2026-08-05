import os
import glob

files = glob.glob('styles/**/*.css', recursive=True)
files.append('style.css')
files.append('index.html')

for filepath in files:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', errors='ignore') as f:
        content = f.read()
    new_content = content.replace('#D81B60', '#00BFFF').replace('var(--primary-color)', '#00BFFF').replace('rgba(216, 27, 96', 'rgba(0, 191, 255')
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f'Updated {filepath}')
