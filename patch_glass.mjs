import fs from 'fs';

let css = fs.readFileSync('styles/glassmorphism.css', 'utf8');

// Replace the buggy display: flex override
css = css.replace('.glass-dashboard {\n    display: flex;\n    flex-direction: column !important;\n}', 
`.glass-dashboard.active-tab {
    display: flex !important;
    flex-direction: column !important;
}
.glass-dashboard:not(.active-tab) {
    display: none !important;
}`);

fs.writeFileSync('styles/glassmorphism.css', css);
console.log('patched');
