const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/TrainingUI.js', 'utf8');

content = content.replace(/\$\{ex\.machinePhoto \? \`<img src="\$\{ex\.machinePhoto\}"([^>]+)>\` : ''\}/g,
`\${ex.machinePhoto ? \`<img data-media-id="\${ex.machinePhoto}" src="" \${$1}>\` : ''}`);

content = content.replace(/renderCurrentExercises: \(\) => \{[\s\S]*?list\.innerHTML = html;\s*TrainingUI\.saveDraft\(\);\s*\}/m,
(match) => {
    return match.replace(/list\.innerHTML = html;\s*TrainingUI\.saveDraft\(\);/,
`list.innerHTML = html;
        
        // Resolve media URLs
        const mediaImgs = list.querySelectorAll('img[data-media-id]');
        mediaImgs.forEach(img => {
            const id = img.getAttribute('data-media-id');
            if (id) {
                MediaManager.getMediaUrl(id).then(url => {
                    if (url) img.src = url;
                });
            }
        });

        TrainingUI.saveDraft();`);
});

fs.writeFileSync('src/modules/ui/TrainingUI.js', content);
