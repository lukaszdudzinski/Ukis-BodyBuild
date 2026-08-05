import os

def process_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to clear out the contents of measurements-dashboard and training-dashboard
    import re
    
    # 1. Clean measurements-dashboard
    content = re.sub(
        r'(<div id="measurements-dashboard" class="tab-content" style="display: none;">).*?(</div>\s*<div id="training-dashboard")',
        r'\1\n                \2',
        content,
        flags=re.DOTALL
    )
    
    # 2. Clean training-dashboard
    content = re.sub(
        r'(<div id="training-dashboard" class="tab-content" style="display: none;">).*?(</div>\s*<div id="analytics-dashboard")',
        r'\1\n                \2',
        content,
        flags=re.DOTALL
    )
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Cleaned index.html")

process_index()
