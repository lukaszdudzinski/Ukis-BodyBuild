import fs from 'fs';

let content = fs.readFileSync('styles/glassmorphism.css', 'utf8');

// Replace body background with something transparent, and restore blobs? 
// The user has a wallpaper set somewhere (maybe layout.css or body inline?).
// Let's remove the forced #0A0A0F from body, use a slight tint.
content = content.replace(/body \{\n    font-family: 'Outfit', sans-serif !important;\n    background-color: #0A0A0F;\n\}/g, 
`body {
    font-family: 'Outfit', sans-serif !important;
    background-color: #000; /* Fallback */
}`);

// Wait, the cards are solid #111118 because I explicitly set them in inline styles in JS and HTML!
// The user complained about the background. My solid inline styles block the background.
// I should use `rgba(17, 17, 24, 0.65)` with `backdrop-filter: blur(20px)` to let the background show.

fs.writeFileSync('styles/glassmorphism.css', content);
console.log('Fixed glassmorphism.css');
