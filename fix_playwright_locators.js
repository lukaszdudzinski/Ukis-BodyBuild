const fs = require('fs');
const files = ['tests/e2e/trainingHistory.spec.js', 'tests/e2e/training-save.spec.js'];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace ElementHandle usage with Locators
    content = content.replace(/const weightInputs = await page\.\$\$\('input\[placeholder="kg"\]'\);/g, "const weightInputs = page.locator('input[placeholder=\"kg\"]');");
    content = content.replace(/const repsInputs = await page\.\$\$\('input\[placeholder="powt"\]'\);/g, "const repsInputs = page.locator('input[placeholder=\"powt\"]');");
    content = content.replace(/const addSetBtns = await page\.\$\$\('button:has-text\("\\+ Seria"\)'\);/g, "const addSetBtns = page.locator('button:has-text(\"+ Seria\")');");
    
    // For let declarations
    content = content.replace(/let weightInputs = await page\.\$\$\('input\[placeholder="kg"\]'\);/g, "let weightInputs = page.locator('input[placeholder=\"kg\"]');");
    content = content.replace(/let repsInputs = await page\.\$\$\('input\[placeholder="powt"\]'\);/g, "let repsInputs = page.locator('input[placeholder=\"powt\"]');");
    content = content.replace(/let addSetBtns = await page\.\$\$\('button:has-text\("\\+ Seria"\)'\);/g, "let addSetBtns = page.locator('button:has-text(\"+ Seria\")');");
    
    // Arrays elements access replace from [0] to .nth(0)
    for (let i = 0; i < 5; i++) {
        content = content.replace(new RegExp(`weightInputs\\[${i}\\]`, 'g'), `weightInputs.nth(${i})`);
        content = content.replace(new RegExp(`repsInputs\\[${i}\\]`, 'g'), `repsInputs.nth(${i})`);
        content = content.replace(new RegExp(`addSetBtns\\[${i}\\]`, 'g'), `addSetBtns.nth(${i})`);
    }

    // Also fix exerciseInputs
    content = content.replace(/const exerciseInputs = await page\.\$\$\('\.exercise-name-input'\);/g, "const exerciseInputs = page.locator('.exercise-name-input');");
    content = content.replace(/let exerciseInputs = await page\.\$\$\('\.exercise-name-input'\);/g, "let exerciseInputs = page.locator('.exercise-name-input');");
    content = content.replace(/const exInputs3 = await page\.\$\$\('\.exercise-name-input'\);/g, "const exInputs3 = page.locator('.exercise-name-input');");
    for (let i = 0; i < 5; i++) {
        content = content.replace(new RegExp(`exerciseInputs\\[${i}\\]`, 'g'), `exerciseInputs.nth(${i})`);
        content = content.replace(new RegExp(`exInputs3\\[${i}\\]`, 'g'), `exInputs3.nth(${i})`);
    }

    fs.writeFileSync(file, content);
}
console.log("Tests updated to use locators.");
