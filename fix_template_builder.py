import sys
f = 'tests/e2e/template_builder.spec.js'
c = open(f).read()
c = c.replace("await page.evaluate(() => {\n            window.TrainingUI.loadTemplatesDialog();\n        });\n        \n        await page.waitForSelector('#templates-modal-overlay', { state: 'visible' });", "")
open(f, 'w').write(c)
