const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/NumpadUI.js', 'utf8');

content = content.replace(/if \(NumpadUI\.targetInput\.value\.length < 6\) \{\s*NumpadUI\.targetInput\.value \+= char;\s*\}/,
`if (NumpadUI.targetInput.value === '0' && char !== '.') {
                NumpadUI.targetInput.value = char;
            } else if (NumpadUI.targetInput.value.length < 6) {
                NumpadUI.targetInput.value += char;
            }`);

fs.writeFileSync('src/modules/ui/NumpadUI.js', content);
