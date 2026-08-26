const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/DietUI.js', 'utf8');

content = content.replace(/await DatabaseManager\.addDietLog\(\{[\s\S]*?\}\);[\s\S]*?DietUI\.loadTodayData\(\);/,
`try {
                await DatabaseManager.addDietLog({
                    date: today,
                    meal_type: 'Inny',
                    food_name: result.food_name || 'Nieznany posiłek',
                    calories: currentKcal,
                    protein: parseInt(result.protein) || 0,
                    carbs: parseInt(result.carbs) || 0,
                    fat: parseInt(result.fat) || 0,
                    thumbnail: thumbnail
                });
                
                if (contextInput) contextInput.value = '';
                DietUI.attachedImages = [];
                DietUI.renderImagePreviews();
                
                DietUI.loadTodayData();
            } catch(e) {
                alert("Wystąpił błąd podczas zapisu posiłku. Prawdopodobnie brak miejsca (Disk I/O). Odśwież aplikację.");
                console.error(e);
            }`);

fs.writeFileSync('src/modules/ui/DietUI.js', content);
