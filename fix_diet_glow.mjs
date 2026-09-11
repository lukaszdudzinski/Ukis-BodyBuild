import fs from 'fs';
let content = fs.readFileSync('index.html', 'utf8');

// Replace glowing orange border with clean iOS style #1C1C1E and #333 border
content = content.replace(/background: #111118; border: 1px solid rgba\(255,152,0,0\.5\); border-radius: 20px; padding: 25px; margin-bottom: 20px; text-align: center; box-shadow: 0 10px 30px rgba\(0,0,0,0\.5\);/g, "background: #1C1C1E; border: 1px solid #333; border-radius: 20px; padding: 25px; margin-bottom: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);");

content = content.replace(/background: #111118; border: 1px solid rgba\(255,152,0,0\.5\); border-radius: 20px; padding: 20px; box-shadow: 0 10px 30px rgba\(0,0,0,0\.5\);/g, "background: #1C1C1E; border: 1px solid #333; border-radius: 20px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-bottom: 20px;");

fs.writeFileSync('index.html', content);
console.log('Fixed glowing borders on Diet screen.');
