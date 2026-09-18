const fs = require('fs');
let template = fs.readFileSync('tests/e2e/template_builder.spec.js', 'utf8');
template = template.replace(
    /await page\.fill\('#builder-custom-name', `Cwiczenie Testowe \$\{i\}`\);\n\s*await page\.evaluate\(\(\) => window\.TemplateBuilderUI\.openCatalogModal\(\)\); await page\.waitForTimeout\(300\); await page\.click\('\.builder-catalog-item:has-text\("Cwiczenie Testowe"\)'\);/,
    "await page.evaluate(() => window.TemplateBuilderUI.openCatalogModal());\n            await page.waitForTimeout(300);\n            await page.fill('#builder-custom-name', `Cwiczenie Testowe ${i}`);\n            await page.click('button:has-text(\"Dodaj\")');"
);
fs.writeFileSync('tests/e2e/template_builder.spec.js', template);
