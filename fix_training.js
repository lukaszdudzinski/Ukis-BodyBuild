const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');

// Replace the broken line
content = content.replace(
    /\$\{ex\.machinePhoto \? \`<img data-media-id="\$\{ex\.machinePhoto\}" src="" \$\{ style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin-top: 10px; border: 1px solid \$\{isNested \? '#E91E63' : '#00BFFF'\};" alt="Maszyna"\}>\` : ''\}/,
    `\${ex.machinePhoto ? \`<img data-media-id="\${ex.machinePhoto}" src="" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin-top: 10px; border: 1px solid \${isNested ? '#E91E63' : '#00BFFF'};" alt="Maszyna">\` : ''}`
);

fs.writeFileSync('src/modules/ui/TrainingUI.js', content);
