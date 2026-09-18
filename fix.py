import sys
f = 'tests/e2e/trainingHistory.spec.js'
c = open(f).read()

# Replace button:has-text with text=
c = c.replace("button:has-text(\"+ Seria\")", "text=+ Seria")

# Press enter after filling exercise name to trigger blur
c = c.replace(".fill('Wyciskanie sztangi leżąc');", ".fill('Wyciskanie sztangi leżąc');\n    await page.keyboard.press('Enter');\n    await page.waitForTimeout(200);")
c = c.replace(".fill('Wyciskanie skośne');", ".fill('Wyciskanie skośne');\n    await page.keyboard.press('Enter');\n    await page.waitForTimeout(200);")
c = c.replace(".fill('Francuskie wyciskanie (Triceps)');", ".fill('Francuskie wyciskanie (Triceps)');\n    await page.keyboard.press('Enter');\n    await page.waitForTimeout(200);")

open(f, 'w').write(c)
