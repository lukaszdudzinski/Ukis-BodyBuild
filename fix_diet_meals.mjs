import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');
let subagentHtml = fs.readFileSync('/Users/lukaszdudzinski/.gemini/antigravity/brain/774e957a-72e9-46ba-ac80-cadf53704e2b/scratch/diet_meals.html', 'utf8');

const targetAnchor = `                    </div>\n                </div>\n\n                <div id="diagnostics-dashboard"`;
content = content.replace(targetAnchor, `                    </div>\n                    \n                    <!-- Injected by Subagent UI Designer -->\n${subagentHtml}\n                </div>\n\n                <div id="diagnostics-dashboard"`);

fs.writeFileSync('index.html', content);
console.log('Injected Dzisiejsze Posiłki to index.html');
