const fs = require('fs');
const file = 'tests/e2e/trainingHistory.spec.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix const addSetBtns
content = content.replace(/const addSetBtns = await page\.\$\$\('button:has-text\("\\+ Seria"\)'\);/g, "const addSetBtns = page.locator('button:has-text(\"+ Seria\")');");

// 2. Fix Add third exercise button
content = content.replace(/await page\.click\('text=Dodaj kolejne ćwiczenie'\);/g, "await page.click('#add-exercise-to-plan-btn');");

// 3. Fix third exercise locators
content = content.replace(/const weightInputs3 = await page\.\$\$\('input\[placeholder="kg"\]'\);/g, "const weightInputs3 = page.locator('input[placeholder=\"kg\"]');");
content = content.replace(/const repsInputs3 = await page\.\$\$\('input\[placeholder="powt"\]'\);/g, "const repsInputs3 = page.locator('input[placeholder=\"powt\"]');");
content = content.replace(/const addSetBtns3 = await page\.\$\$\('button:has-text\("\\+ Seria"\)'\);/g, "const addSetBtns3 = page.locator('button:has-text(\"+ Seria\")');");
for (let i = 0; i < 5; i++) {
    content = content.replace(new RegExp(`weightInputs3\\[${i}\\]`, 'g'), `weightInputs3.nth(${i})`);
    content = content.replace(new RegExp(`repsInputs3\\[${i}\\]`, 'g'), `repsInputs3.nth(${i})`);
    content = content.replace(new RegExp(`addSetBtns3\\[${i}\\]`, 'g'), `addSetBtns3.nth(${i})`);
}

// 4. Add training name
content = content.replace(/await page\.click\('#start-new-session-btn'\);/g, "await page.click('#start-new-session-btn');\n    await page.waitForTimeout(500);\n    await page.fill('#training-name-input', 'Trening siłowy test');");

// 5. Fix finish button
content = content.replace(/await page\.click\('text=Zakończ i Zapisz Trening'\);/g, "await page.click('#finish-training-btn');");

// 6. Fix assertion text
content = content.replace(/await expect\(page\.locator\('text=Trening siłowy'\)\.first\(\)\)\.toBeVisible\(\);/g, "await expect(page.locator('text=Trening siłowy test').first()).toBeVisible();");

fs.writeFileSync(file, content);
console.log("trainingHistory.spec.js fixed!");
