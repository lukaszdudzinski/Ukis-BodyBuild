import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

const newDiet = `<div id="diet-dashboard" class="tab-content" style="display: none; padding-bottom: 90px;">
                    <div style="margin-bottom: 20px;">
                        <h2 style="color: #FFF; font-size: 28px; font-weight: 700; margin: 0 0 5px 0;">Dieta i Kalorie</h2>
                        <p style="color: #888; margin: 0; font-size: 14px;">Dzisiaj</p>
                    </div>

                    <!-- Daily Goal Card -->
                    <div style="background: rgba(10, 10, 15, 0.65); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,152,0,0.5); border-radius: 20px; padding: 25px; margin-bottom: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <h3 style="color: #FFF; font-size: 18px; margin: 0 0 20px 0; font-weight: 600;">Twój cel: 2000 kcal</h3>
                        
                        <!-- Circular Progress Placeholder -->
                        <div style="width: 160px; height: 160px; border-radius: 50%; border: 12px solid rgba(255,255,255,0.05); border-top-color: #333; margin: 0 auto 25px auto; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                            <span style="color: #FFF; font-size: 12px; font-weight: 700; letter-spacing: 1px;">ZJEDZONO</span>
                            <span style="color: #FFF; font-size: 42px; font-weight: 800; line-height: 1.1;">0</span>
                            <span style="color: #888; font-size: 14px;">kcal</span>
                        </div>

                        <!-- Macros -->
                        <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px;">
                            <div style="flex: 1;">
                                <div style="color: #00D26A; font-size: 20px; font-weight: 800; margin-bottom: 4px;">0g</div>
                                <div style="color: #888; font-size: 13px;">Białko</div>
                            </div>
                            <div style="flex: 1; border-left: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05);">
                                <div style="color: #00BFFF; font-size: 20px; font-weight: 800; margin-bottom: 4px;">0g</div>
                                <div style="color: #888; font-size: 13px;">Węgle</div>
                            </div>
                            <div style="flex: 1;">
                                <div style="color: #E91E63; font-size: 20px; font-weight: 800; margin-bottom: 4px;">0g</div>
                                <div style="color: #888; font-size: 13px;">Tłuszcze</div>
                            </div>
                        </div>
                    </div>

                    <!-- AI Input Card -->
                    <div style="background: rgba(10, 10, 15, 0.65); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,152,0,0.5); border-radius: 20px; padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <h3 style="color: #FFF; font-size: 16px; margin: 0 0 15px 0; font-weight: 600; text-align: center;">Co dzisiaj jadłeś?</h3>
                        
                        <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                            <textarea placeholder="Napisz lub podyktuj...&#10;(np. Jajecznica z 3 jaj)" style="flex: 2; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; color: #FFF; font-size: 14px; outline: none; resize: none; height: 90px; box-sizing: border-box;"></textarea>
                            
                            <button style="flex: 1; background: rgba(255,152,0,0.05); border: 1px dashed rgba(255,152,0,0.5); border-radius: 12px; color: #FF9800; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; height: 90px; box-sizing: border-box;">
                                <span style="font-size: 24px; margin-bottom: 5px;">📸</span>
                                <span style="font-size: 11px; font-weight: 700; text-transform: uppercase;">Dodaj Zdjęcie</span>
                            </button>
                        </div>
                        
                        <button style="width: 100%; background: linear-gradient(90deg, #FF9800, #F44336); border: none; border-radius: 12px; color: #FFF; font-weight: 700; font-size: 16px; padding: 18px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(255,152,0,0.3);">
                            <span style="font-size: 20px;">🤖</span> Zapytaj AI Edwarda o kaloryczność
                        </button>
                    </div>
                </div>`;

const oldDietRegex = /<div id="diet-dashboard" class="tab-content" style="display: none;">[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(oldDietRegex, newDiet);

fs.writeFileSync('index.html', content);
console.log('Patched diet screen.');
