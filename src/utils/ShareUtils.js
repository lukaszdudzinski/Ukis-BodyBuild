export const ShareUtils = {
    generateAndShareImage: async (title, statsList, avatarBase64, nickname, customMessage, backgroundBase64 = null) => {
        return new Promise(async (resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size
            canvas.width = 1080;
            canvas.height = 1080;
            
            // Helper to load image
            const loadImage = (src) => {
                return new Promise((res, rej) => {
                    const img = new Image();
                    img.onload = () => res(img);
                    img.onerror = () => rej(new Error('Failed to load image'));
                    img.src = src;
                });
            };

            // Draw background
            if (backgroundBase64) {
                try {
                    const bgImg = await loadImage(backgroundBase64);
                    // Fill and cover
                    const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
                    const x = (canvas.width / 2) - (bgImg.width / 2) * scale;
                    const y = (canvas.height / 2) - (bgImg.height / 2) * scale;
                    ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
                    // Darken filter
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                } catch(e) {
                    ctx.fillStyle = '#1e1e1e';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            } else {
                ctx.fillStyle = '#1e1e1e';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Draw header / logo area
            
            // Draw header / logo area
            try {
                const logoImg = await loadImage('./img/logo.png');
                ctx.drawImage(logoImg, canvas.width / 2 - 80, 20, 160, 160);
            } catch (e) {
                ctx.fillStyle = '#00BFFF';
                ctx.font = 'bold 60px Arial';
                ctx.textAlign = 'center';
                ctx.fillText("Uki's BodyBuild", canvas.width / 2, 100);
            }
            
            // Draw Title
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 80px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(title, canvas.width / 2, 240);
            
            // Draw Avatar and Nickname w połowie by wyśrodkować
            const drawFooter = () => {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 45px Arial';
                ctx.textAlign = 'right';
                // Nie rysujemy nicka na dole z boku
                
                // Add encouragement text
                ctx.fillStyle = '#00BFFF';
                ctx.font = 'italic 35px Arial';
                ctx.textAlign = 'center';
                ctx.fillText("UkiBodyBuild (Kliknij w link poniżej by dołączyć!)", canvas.width / 2, canvas.height - 40);
                
                // convert canvas to blob and share
                canvas.toBlob(async (blob) => {
                    if (!blob) {
                        return reject("Could not generate image blob");
                    }
                    
                    const file = new File([blob], 'progress.png', { type: 'image/png' });
                    
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        try {
                            await navigator.share({
                                title: title,
                                text: customMessage || "Sprawdź mój progres z Uki's BodyBuild!",
                                files: [file]
                            });
                            resolve(true);
                        } catch (err) {
                            reject(err);
                        }
                    } else {
                        // Fallback: download the image if sharing is not supported
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = 'progress.png';
                        a.click();
                        resolve(false);
                    }
                }, 'image/png');
            };

            if (avatarBase64) {
                try {
                    const avatarImg = await loadImage(avatarBase64);
                    ctx.save();
                    ctx.beginPath();
                    // Awatar wysrodkowany pod Raport Progresu, czyli (canvas.width/2), (Y np. 340)
                    ctx.arc(canvas.width / 2, 360, 60, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(avatarImg, canvas.width / 2 - 60, 300, 120, 120);
                    ctx.restore();
                } catch (e) {
                    console.log('Brak / Błąd avatara', e);
                }
            }
            
            // Draw Stats - Przesuwamy Statsy niżej z powodu avatara (np z 430 na 500)
            ctx.font = 'bold 50px Arial';
            let y = 530;
            statsList.forEach(stat => {
                ctx.fillStyle = '#aaa';
                ctx.fillText(stat.label, canvas.width / 2, y);
                ctx.fillStyle = stat.color || '#2ECC71';
                ctx.fillText(stat.value, canvas.width / 2, y + 60);
                y += 160;
            });

            drawFooter();
        });
    }
};
