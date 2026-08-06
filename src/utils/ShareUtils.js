export const ShareUtils = {
    generateAndShareImage: async (title, statsList, avatarBase64, nickname, customMessage) => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size
            canvas.width = 1080;
            canvas.height = 1080;
            
            // Draw background
            ctx.fillStyle = '#1e1e1e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw header / logo area
            ctx.fillStyle = '#00BFFF';
            ctx.font = 'bold 60px Arial';
            ctx.textAlign = 'center';
            ctx.fillText("Uki's BodyBuild", canvas.width / 2, 100);
            
            // Draw Title
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 80px Arial';
            ctx.fillText(title, canvas.width / 2, 220);
            
            // Draw Stats
            ctx.font = 'bold 50px Arial';
            let y = 400;
            statsList.forEach(stat => {
                ctx.fillStyle = '#aaa';
                ctx.fillText(stat.label, canvas.width / 2, y);
                ctx.fillStyle = stat.color || '#2ECC71';
                ctx.fillText(stat.value, canvas.width / 2, y + 60);
                y += 180;
            });
            
                // Draw Avatar and Nickname (Footer)
            const drawFooter = () => {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 45px Arial';
                ctx.textAlign = 'right';
                const nickText = nickname || "BodyBuilder";
                ctx.fillText(nickText, canvas.width - 150, canvas.height - 110);
                
                // Add encouragement text
                ctx.fillStyle = '#00BFFF';
                ctx.font = 'italic 35px Arial';
                ctx.textAlign = 'center';
                ctx.fillText("Trenuj z Uki's BodyBuild - Dołącz do nas!", canvas.width / 2, canvas.height - 40);
                
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
                const img = new Image();
                img.onload = () => {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(canvas.width - 90, canvas.height - 120, 50, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(img, canvas.width - 140, canvas.height - 170, 100, 100);
                    ctx.restore();
                    drawFooter();
                };
                img.onerror = () => {
                    drawFooter(); // Draw without avatar if it fails
                }
                img.src = avatarBase64;
            } else {
                drawFooter();
            }
        });
    }
};
