import sys
f = 'tests/e2e/test-ai-7days.spec.js'
c = open(f).read()
c = c.replace("window.localStorage.setItem('tutorial_global_v22', 'true');", "window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki_premium_access', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.01');")
if "window.localStorage.setItem('uki_premium_access'" not in c:
    c = c.replace("await page.goto('/');", "await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki_premium_access', 'true'); window.localStorage.setItem('uki-bodybuild-last-version', 'v2026.9.17.01'); });\n    await page.goto('/');")
open(f, 'w').write(c)
