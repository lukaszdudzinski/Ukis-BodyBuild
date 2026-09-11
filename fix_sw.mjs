import fs from 'fs';
let sw = fs.readFileSync('sw.js', 'utf8');

sw = sw.replace(/self\.addEventListener\('install', \(e\) => \{/, "self.addEventListener('install', (e) => {\n    self.skipWaiting();");
sw = sw.replace(/self\.addEventListener\('activate', \(e\) => \{/, "self.addEventListener('activate', (e) => {\n    e.waitUntil(self.clients.claim());");

fs.writeFileSync('sw.js', sw);
console.log("Fixed sw.js to auto-update");
