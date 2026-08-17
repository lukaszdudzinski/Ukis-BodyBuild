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
                
                // No overlay text in footer
                
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
                        // Wymuszamy błąd, aby aktywować fallback tekstowy (kopiowanie opisu) na urządzeniach bez natywnego udostępniania
                        reject(new Error("Udostępnianie natywne nie jest wspierane na tym urządzeniu. Zrzut został pobrany."));
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
            
            // Draw Stats - dynamiczne skalowanie w zależności od liczby rekordów
            const itemCount = statsList.length;
            const startY = itemCount >= 4 ? 470 : (itemCount === 3 ? 500 : 540);
            const stepY = itemCount >= 4 ? 135 : 160;
            const labelFontSize = itemCount >= 4 ? 38 : 46;
            const valueFontSize = itemCount >= 4 ? 46 : 52;

            let y = startY;
            statsList.forEach(stat => {
                ctx.font = `bold ${labelFontSize}px Arial`;
                ctx.fillStyle = '#aaa';
                ctx.fillText(stat.label, canvas.width / 2, y);

                ctx.font = `bold ${valueFontSize}px Arial`;
                ctx.fillStyle = stat.color || '#2ECC71';
                ctx.fillText(stat.value, canvas.width / 2, y + (itemCount >= 4 ? 50 : 60));
                
                y += stepY;
            });

            drawFooter();
        });
    },

    generateTrainingReceipt: async (training, avatarBase64, nickname) => {
        return new Promise(async (resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Helper to load image
            const loadImage = (src) => {
                return new Promise((res, rej) => {
                    const img = new Image();
                    img.onload = () => res(img);
                    img.onerror = () => rej(new Error('Failed to load image'));
                    img.src = src;
                });
            };

            // Calculate height
            let contentHeight = 450; // Header + Avatar
            training.exercises.forEach(ex => {
                contentHeight += 60; // Exercise title
                if (ex.sets) contentHeight += ex.sets.length * 40; // Sets
                contentHeight += 20; // Margin
            });
            contentHeight += 200; // Footer
            
            canvas.width = 1080;
            canvas.height = Math.max(1080, contentHeight);
            
            ctx.fillStyle = '#1e1e1e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

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
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 60px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(training.name || 'Mój Trening', canvas.width / 2, 240);

            ctx.fillStyle = '#00BFFF';
            ctx.font = 'bold 40px Arial';
            ctx.fillText(training.date, canvas.width / 2, 300);

            let currentY = 360;

            if (avatarBase64) {
                try {
                    const avatarImg = await loadImage(avatarBase64);
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(canvas.width / 2, currentY + 60, 60, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(avatarImg, canvas.width / 2 - 60, currentY, 120, 120);
                    ctx.restore();
                    currentY += 150;
                } catch (e) {
                    console.log('Brak / Błąd avatara', e);
                }
            }

            // Draw total volume & sets
            const totalSets = training.exercises.reduce((sum, ex) => sum + (ex.sets ? ex.sets.length : 0), 0);
            const totalVolume = training.exercises.reduce((sum, ex) => {
                if (!ex.sets) return sum;
                return sum + ex.sets.reduce((sSum, set) => sSum + (set.weight * set.reps), 0);
            }, 0);

            ctx.fillStyle = '#aaa';
            ctx.font = '40px Arial';
            ctx.fillText(`${totalSets} serii | ${totalVolume} kg | ${training.exercises.length} ćwiczeń`, canvas.width / 2, currentY);
            currentY += 80;

            // Draw exercises
            ctx.textAlign = 'left';
            const leftMargin = 100;
            
            training.exercises.forEach((ex, i) => {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 45px Arial';
                ctx.fillText(`${i + 1}. ${ex.name || 'Nieznane ćwiczenie'}`, leftMargin, currentY);
                currentY += 50;

                if (ex.sets && ex.sets.length > 0) {
                    ctx.fillStyle = '#aaa';
                    ctx.font = '35px Arial';
                    ex.sets.forEach((set, sIdx) => {
                        ctx.fillText(`Seria ${sIdx + 1}: ${set.weight} kg x ${set.reps} powt.`, leftMargin + 40, currentY);
                        currentY += 40;
                    });
                } else {
                    ctx.fillStyle = '#777';
                    ctx.font = 'italic 35px Arial';
                    ctx.fillText(`Brak serii`, leftMargin + 40, currentY);
                    currentY += 40;
                }
                currentY += 20;
            });

            // Footer
            currentY += 50;
            ctx.fillStyle = '#00BFFF';
            ctx.font = 'italic 35px Arial';
            ctx.textAlign = 'center';
            ctx.fillText("UkiBodyBuild (Kliknij w link poniżej by dołączyć!)", canvas.width / 2, currentY);
            
            // convert canvas to blob and share
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    return reject("Could not generate image blob");
                }
                const file = new File([blob], 'trening.png', { type: 'image/png' });
                const textToShare = `Właśnie ukończyłem trening: ${training.name || 'Trening'}! 💪 Dołącz do nas: https://lukaszdudzinski.github.io/Ukis-BodyBuild/`;

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: 'Mój Trening',
                            text: textToShare,
                            files: [file]
                        });
                        resolve(true);
                    } catch (err) {
                        reject(err);
                    }
                } else {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'trening.png';
                    a.click();
                    reject(new Error("Udostępnianie natywne nie jest wspierane. Zrzut został pobrany."));
                }
            }, 'image/png');
        });
    }
};
