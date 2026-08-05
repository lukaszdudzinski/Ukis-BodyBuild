import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        new_content = content.replace('#00d1b2', '#D81B60')
        new_content = new_content.replace('0, 209, 178', '216, 27, 96')
        new_content = new_content.replace('#00bcdd', '#AD1457')
        new_content = new_content.replace('#00bc9f', '#AD1457')

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.css') or file.endswith('.html') or file.endswith('.js'):
            replace_in_file(os.path.join(root, file))

print("Done.")
