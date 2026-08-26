const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/DietUI.js', 'utf8');

const modalFunction = `
    showHistoryMealsModal: async (date) => {
        const logs = await DatabaseManager.getDietLogs(date);
        
        const modal = document.createElement('div');
        modal.id = 'diet-history-meals-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; justify-content: center; align-items: center; padding: 15px; box-sizing: border-box;';
        
        let mealsHtml = '';
        if (logs.length === 0) {
            mealsHtml = '<p style="color:#aaa; text-align:center;">Brak posiłków tego dnia.</p>';
        } else {
            logs.forEach(log => {
                mealsHtml += \`
                    <div style="background: rgba(0,0,0,0.3); border: 1px solid #333; border-radius: 8px; padding: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="color: #FF9800; font-weight: bold; font-size: 1.05em; margin-bottom: 5px;">\${log.food_name || 'Posiłek'}</div>
                            <div style="display:flex; gap:10px; font-size:0.85em;">
                                <span style="color:#4CAF50">B: \${log.protein}g</span>
                                <span style="color:#2196F3">W: \${log.carbs}g</span>
                                <span style="color:#E91E63">T: \${log.fat}g</span>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="color: #fff; font-weight: bold; font-size: 1.1em;">\${log.calories} kcal</div>
                            <button onclick="DatabaseManager.deleteDietLog(\${log.id}).then(() => { document.getElementById('diet-history-meals-modal').remove(); window.DietUI.loadTodayData(); })" style="background: transparent; color: #ff4444; border: 1px solid #ff4444; border-radius: 4px; padding: 3px 8px; font-size: 0.8em; margin-top: 5px; cursor: pointer;">Usuń</button>
                        </div>
                    </div>
                \`;
            });
        }
        
        modal.innerHTML = \`
            <div style="background: #1e1e1e; padding: 20px; border-radius: 12px; border: 1px solid #FF9800; max-width: 400px; width: 100%; max-height: 80vh; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 15px;">
                    <h3 style="color: #FF9800; margin: 0;">Posiłki z dnia: \${date}</h3>
                    <button onclick="this.closest('#diet-history-meals-modal').remove()" style="background: none; border: none; color: #fff; font-size: 1.5em; cursor: pointer;">&times;</button>
                </div>
                <div style="overflow-y: auto; flex: 1;">
                    \${mealsHtml}
                </div>
            </div>
        \`;
        
        document.body.appendChild(modal);
    },
`;

content = content.replace(/loadHistoryChart: async \(tdee\) => \{/, modalFunction + '\n    loadHistoryChart: async (tdee) => {');

content = content.replace(/barContainer\.style\.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; min-width: 30px; flex-shrink: 0;';/,
`barContainer.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; min-width: 30px; flex-shrink: 0; cursor: pointer;';
            barContainer.onclick = () => DietUI.showHistoryMealsModal(log.date);`);

fs.writeFileSync('src/modules/ui/DietUI.js', content);
