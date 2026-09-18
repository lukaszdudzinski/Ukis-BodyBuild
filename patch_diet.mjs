import fs from 'fs';

let js = fs.readFileSync('src/modules/ui/DietUI.js', 'utf8');

const oldMealHtml = `                    item.style.cssText = 'background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid #FF9800;';
                    item.innerHTML = \`
                        <div style="display: flex; align-items: center; flex: 1; max-width: 70%;">
                            \${log.thumbnail ? \`<img id="diet-list-thumb-\${log.id}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 15px; border: 1px solid #FF9800; flex-shrink: 0;">\` : ''}
                            <div>
                                <div style="font-weight: bold; font-size: 1.2em; color: #fff; word-break: break-word;">\${log.food_name}</div>
                                <div style="font-size: 1.05em; color: #ddd; margin-top: 8px; display: flex; gap: 15px; font-weight: 500;">
                                    <span><strong style="color: #4CAF50; font-size: 1.1em;">B:</strong> \${log.protein}g</span>
                                    <span><strong style="color: #2196F3; font-size: 1.1em;">W:</strong> \${log.carbs}g</span>
                                    <span><strong style="color: #E91E63; font-size: 1.1em;">T:</strong> \${log.fat}g</span>
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1.2em; font-weight: bold; color: #FF9800;">\${log.calories} kcal</div>
                            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px;">
                                <button class="clone-diet-btn" data-log='\${JSON.stringify(log).replace(/'/g, "&apos;")}' style="background: rgba(0, 191, 255, 0.1); border: 1px solid #00BFFF; color: #00BFFF; font-size: 0.8em; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Klonuj</button>
                                <button class="delete-diet-btn" data-id="\${log.id}" style="background: rgba(255, 68, 68, 0.1); border: 1px solid #ff4444; color: #ff4444; font-size: 0.8em; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Usuń</button>
                            </div>
                        </div>
                    \`;`;

const newMealHtml = `                    item.style.cssText = 'margin-bottom: 16px; display: block;';
                    item.innerHTML = \`
                        <div style="background-color: #1C1C1E; border: 1px solid #333333; border-radius: 16px; padding: 16px; box-sizing: border-box;">
                          <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                            \${log.thumbnail ? 
                                \\\`<img id="diet-list-thumb-\\\${log.id}" style="width: 64px; height: 64px; object-fit: cover; border-radius: 12px; flex-shrink: 0;">\\\` 
                                : \\\`<div style="width: 64px; height: 64px; background-color: #2C2C2E; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 32px;">🥞</div>\\\`
                            }
                            <div style="flex-grow: 1; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                              <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #FFFFFF; line-height: 1.3;">\${log.food_name}</h3>
                              <span style="color: #FF9800; font-weight: 600; font-size: 16px; white-space: nowrap;">\${log.calories} kcal</span>
                            </div>
                          </div>
                          
                          <!-- Action Buttons -->
                          <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                            <button class="clone-diet-btn" data-log='\${JSON.stringify(log).replace(/'/g, "&apos;")}' style="flex: 1; background-color: transparent; border: 1px solid #0A84FF; color: #0A84FF; border-radius: 10px; padding: 10px; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; -webkit-tap-highlight-color: transparent;">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                              Klonuj
                            </button>
                            <button class="delete-diet-btn" data-id="\${log.id}" style="flex: 1; background-color: transparent; border: 1px solid #FF453A; color: #FF453A; border-radius: 10px; padding: 10px; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; -webkit-tap-highlight-color: transparent;">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              Usuń
                            </button>
                          </div>

                          <!-- Macros -->
                          <div style="display: flex; justify-content: space-between; border-top: 1px solid #333333; padding-top: 14px; font-size: 14px; font-weight: 600;">
                            <span style="color: #30D158;">B: \${log.protein}g</span>
                            <span style="color: #0A84FF;">W: \${log.carbs}g</span>
                            <span style="color: #FF453A;">T: \${log.fat}g</span>
                          </div>
                        </div>
                    \`;`;

js = js.replace(oldMealHtml, newMealHtml);

// And update the History Chart rendering
const oldChartHtml = `                    const bar = document.createElement('div');
                    bar.style.cssText = \`flex: 1; background: #FF9800; border-radius: 4px 4px 0 0; min-width: 8px; cursor: pointer; opacity: \${isToday ? '1' : '0.6'}; height: \${heightPct}%;\`;
                    bar.title = \`\${d.date}: \${d.totalKcal} kcal\`;`;

const newChartHtml = `                    const bar = document.createElement('div');
                    bar.style.cssText = \`flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; gap: 4px; min-width: 25px; cursor: pointer;\`;
                    bar.title = \`\${d.date}: \${d.totalKcal} kcal\`;
                    bar.innerHTML = \`
                        <span style="color: \${isToday ? '#FF9800' : '#888'}; font-size: 10px; \${isToday ? 'font-weight: bold;' : ''}">\${d.totalKcal}</span>
                        <div style="width: 100%; background-color: #FF9800; border-radius: 6px 6px 0 0; height: \${heightPct}%; opacity: \${isToday ? '1' : '0.7'};"></div>
                    \`;`;

js = js.replace(oldChartHtml, newChartHtml);

// Remove the hardcoded height from chart container in renderUI so the labels have room
js = js.replace('height: 120px; border-bottom: 1px solid #444; margin-bottom: 20px;', 'height: 160px; border-bottom: 1px solid #444; margin-bottom: 20px; box-sizing: border-box;');


fs.writeFileSync('src/modules/ui/DietUI.js', js);
console.log('Diet UI patched with new design');
