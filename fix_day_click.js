const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.spec.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Fix the escaped backslashes in the regex
            content = content.replace(/\/\^\\\\s\*15\\\\s\*\$\//g, "/^\\s*15\\s*$/");
            fs.writeFileSync(fullPath, content);
        }
    }
}

processDir(path.join(__dirname, 'tests/e2e'));
console.log("Done");
