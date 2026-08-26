const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/TemplateBuilderUI.js', 'utf8');

content = content.replace(/<input type="checkbox" id="builder-select-\$\{index\}" checked/g,
`<input type="checkbox" id="builder-select-\${index}" \${ex.sets.length === 0 ? 'checked' : ''}`);

fs.writeFileSync('src/modules/ui/TemplateBuilderUI.js', content);
