import sys
f = 'tests/e2e/trainingHistory.spec.js'
c = open(f).read()

c = c.replace("await page.fill('.exercise-name-input', 'Wyciskanie sztangi leżąc');", "await page.fill('.exercise-name-input', 'Wyciskanie sztangi leżąc');\n    await page.keyboard.press('Enter');\n    await page.waitForTimeout(200);")

open(f, 'w').write(c)
