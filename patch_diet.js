const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/DietUI.js', 'utf8');

content = content.replace(/handleImageAttach: async \(e\) => \{[\s\S]*?const cameraInput = document\.getElementById\('diet-camera-input'\);\s*if \(cameraInput\) cameraInput\.value = '';\s*\}/,
`handleImageAttach: async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        
        try {
            for (const file of files) {
                if (DietUI.attachedImages.length >= 3) {
                    alert('Możesz dodać maksymalnie 3 zdjęcia posiłku na raz.');
                    break;
                }
                const base64 = await DietUI.resizeAndToBase64(file);
                const id = await MediaManager.saveMedia(base64);
                DietUI.attachedImages.push(id);
            }
            DietUI.renderImagePreviews();
        } catch (error) {
            alert('Błąd podczas ładowania zdjęcia: ' + error.message);
        }
        
        const cameraInput = document.getElementById('diet-camera-input');
        if (cameraInput) cameraInput.value = '';
    }`);

content = content.replace(/renderImagePreviews: \(\) => \{[\s\S]*?\}\s*\}\s*\n\s*\}/m, 
`renderImagePreviews: () => {
        const previewContainer = document.getElementById('diet-image-previews');
        if (!previewContainer) return;
        
        previewContainer.innerHTML = '';
        
        if (DietUI.attachedImages.length > 0) {
            previewContainer.style.display = 'flex';
            
            DietUI.attachedImages.forEach((id, index) => {
                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                
                const img = document.createElement('img');
                img.style.width = '60px';
                img.style.height = '60px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '8px';
                img.style.border = '1px solid #FF9800';
                
                MediaManager.getMediaUrl(id).then(url => {
                    if(url) img.src = url;
                });
                
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'X';
                removeBtn.style.position = 'absolute';
                removeBtn.style.top = '-5px';
                removeBtn.style.right = '-5px';
                removeBtn.style.background = '#F44336';
                removeBtn.style.color = '#fff';
                removeBtn.style.border = 'none';
                removeBtn.style.borderRadius = '50%';
                removeBtn.style.width = '22px';
                removeBtn.style.height = '22px';
                removeBtn.style.fontSize = '12px';
                removeBtn.style.cursor = 'pointer';
                removeBtn.style.fontWeight = 'bold';
                removeBtn.onclick = () => DietUI.removeAttachedImage(index);
                
                wrapper.appendChild(img);
                wrapper.appendChild(removeBtn);
                previewContainer.appendChild(wrapper);
            });
            
            const hint = document.createElement('span');
            hint.style.display = 'inline-block';
            hint.style.alignSelf = 'center';
            hint.style.marginLeft = '10px';
            hint.style.fontSize = '0.85em';
            hint.style.color = '#aaa';
            hint.textContent = \`Zdjęć: \${DietUI.attachedImages.length}/3\`;
            previewContainer.appendChild(hint);
        } else {
            previewContainer.style.display = 'none';
        }
    }`);

content = content.replace(/handleAnalyze: async \(\) => \{[\s\S]*?const result = await DietAIEngine\.analyzeImage\(DietUI\.attachedImages, contextText\);/m,
`handleAnalyze: async () => {
        if (window.PremiumUI && !window.PremiumUI.checkPremium()) {
            window.PremiumUI.showPremiumPaywall();
            return;
        }
        
        const contextInput = document.getElementById('diet-context-input');
        const contextText = contextInput ? contextInput.value.trim() : '';
        
        if (!contextText && DietUI.attachedImages.length === 0) {
            alert('Napisz opis posiłku lub załącz zdjęcie!');
            return;
        }

        const loading = document.getElementById('diet-loading');
        const analyzeBtn = document.getElementById('diet-analyze-btn');
        
        if (loading) loading.style.display = 'block';
        if (analyzeBtn) analyzeBtn.style.display = 'none';

        try {
            // Resolve base64 for AI Engine
            const base64Images = await Promise.all(DietUI.attachedImages.map(id => MediaManager.getBase64(id)));
            const result = await DietAIEngine.analyzeImage(base64Images.filter(Boolean), contextText);`);

content = content.replace(/removeAttachedImage: \(index\) => \{\s*DietUI\.attachedImages\.splice\(index, 1\);\s*DietUI\.renderImagePreviews\(\);\s*\}/,
`removeAttachedImage: (index) => {
        const id = DietUI.attachedImages[index];
        MediaManager.deleteMedia(id);
        DietUI.attachedImages.splice(index, 1);
        DietUI.renderImagePreviews();
    }`);

content = content.replace(/\$\{thumbnail \? \`\<img src="\$\{thumbnail\}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 15px; border: 2px solid #FF9800;"\>\` : ''\}/,
`<div id="diet-result-thumbnail-container" style="margin-bottom: 15px;"></div>`);

content = content.replace(/document\.body\.appendChild\(modal\);/,
`document.body.appendChild(modal);
        if (thumbnail) {
            const container = document.getElementById('diet-result-thumbnail-container');
            MediaManager.getMediaUrl(thumbnail).then(url => {
                if(url && container) {
                    container.innerHTML = \`<img src="\${url}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 2px solid #FF9800;">\`;
                }
            });
        }`);

content = content.replace(/loadTodayData: async \(\) => \{[\s\S]*?renderMealsList:\s*\(logs\)\s*=>/m, (match) => {
    return match.replace(/thumbnailElement\.innerHTML = \`<img src="\$\{log\.thumbnail\}" [^>]+>\`;/,
    `MediaManager.getMediaUrl(log.thumbnail).then(url => {
                        if (url) {
                            thumbnailElement.innerHTML = \`<img src="\${url}" style="width: 100%; height: 100%; object-fit: cover; display: block;">\`;
                        }
                    });`);
});


fs.writeFileSync('src/modules/ui/DietUI.js', content);
