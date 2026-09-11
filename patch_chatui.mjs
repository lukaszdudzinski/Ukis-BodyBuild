import fs from 'fs';

let js = fs.readFileSync('src/modules/ui/ChatUI.js', 'utf8');

// Add dragging logic inside bindEvents
const targetStr = 'const toggleBtn = document.getElementById(\'edward-chat-toggle\');';
const idx = js.indexOf(targetStr);

if (idx !== -1) {
    const dragLogic = `
        const toggleBtn = document.getElementById('edward-chat-toggle');
        
        // --- DRAGGABLE LOGIC ---
        let isDragging = false;
        let startY, startX, initialBottom, initialRight;
        
        const onTouchStart = (e) => {
            isDragging = true;
            toggleBtn.style.transition = 'none';
            const touch = e.touches ? e.touches[0] : e;
            startY = touch.clientY;
            startX = touch.clientX;
            initialBottom = parseInt(window.getComputedStyle(toggleBtn).bottom, 10);
            initialRight = parseInt(window.getComputedStyle(toggleBtn).right, 10);
            e.preventDefault(); // prevent scroll while dragging
        };
        
        const onTouchMove = (e) => {
            if (!isDragging) return;
            const touch = e.touches ? e.touches[0] : e;
            const dy = startY - touch.clientY;
            const dx = startX - touch.clientX;
            
            // Limit bounds roughly
            let newBottom = initialBottom + dy;
            let newRight = initialRight + dx;
            
            if (newBottom < 80) newBottom = 80;
            if (newRight < 10) newRight = 10;
            if (newRight > window.innerWidth - 70) newRight = window.innerWidth - 70;
            if (newBottom > window.innerHeight - 70) newBottom = window.innerHeight - 70;

            toggleBtn.style.bottom = newBottom + 'px';
            toggleBtn.style.right = newRight + 'px';
        };
        
        const onTouchEnd = () => {
            isDragging = false;
            toggleBtn.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        };

        if (toggleBtn) {
            toggleBtn.addEventListener('touchstart', onTouchStart, {passive: false});
            toggleBtn.addEventListener('touchmove', onTouchMove, {passive: false});
            toggleBtn.addEventListener('touchend', onTouchEnd);
            toggleBtn.addEventListener('mousedown', onTouchStart);
            window.addEventListener('mousemove', onTouchMove);
            window.addEventListener('mouseup', onTouchEnd);
        }
        // -----------------------
        
`;
    js = js.slice(0, idx) + dragLogic + js.slice(idx + targetStr.length);
    fs.writeFileSync('src/modules/ui/ChatUI.js', js);
    console.log('ChatUI patched with draggable logic');
}
