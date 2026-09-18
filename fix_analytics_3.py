import sys
f = 'tests/e2e/analytics.spec.js'
c = open(f).read()

# Fix isVisible() anti-pattern
c = c.replace("const advancedTitle = await page.locator('text=Analiza składu ciała').isVisible();\n    expect(advancedTitle).toBeTruthy();", "await expect(page.locator('text=Analiza składu ciała')).toBeVisible();")
c = c.replace("const bfTitle = await page.locator('text=Szacunkowy BF%').isVisible();\n    expect(bfTitle).toBeTruthy();", "await expect(page.locator('text=Szacunkowy BF%')).toBeVisible();")
c = c.replace("const ffmiTitle = await page.locator('text=FFMI (Index Beztłuszczowy)').isVisible();\n    expect(ffmiTitle).toBeTruthy();", "await expect(page.locator('text=FFMI (Index Beztłuszczowy)')).toBeVisible();")
c = c.replace("const whrTitle = await page.locator('text=WHR (Talia-Biodra)').isVisible();\n    expect(whrTitle).toBeTruthy();", "await expect(page.locator('text=WHR (Talia-Biodra)')).toBeVisible();")
c = c.replace("const missingWarning = await page.locator('text=Brak danych do wyliczenia BF%').isVisible();\n    expect(missingWarning).toBeTruthy();", "await expect(page.locator('text=Brak danych BF%')).toBeVisible();")
c = c.replace("const missingNeckText = await page.locator('text=Uzupełnij: Szyja').isVisible();\n    expect(missingNeckText).toBeTruthy();", "await expect(page.locator('text=Uzupełnij: Szyja.')).toBeVisible();")

open(f, 'w').write(c)
