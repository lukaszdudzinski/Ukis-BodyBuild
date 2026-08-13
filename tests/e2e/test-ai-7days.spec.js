const { test, expect } = require('@playwright/test');

test('Test 7 days AI analysis', async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => window.switchTab('ai-analytics-dashboard'));
    await page.waitForTimeout(500);
    
    // Dispatch custom event to trigger render
    await page.evaluate(() => document.dispatchEvent(new CustomEvent('tabChanged', { detail: { tab: 'ai-analytics-dashboard' } })));
    await page.waitForTimeout(500);

    const html = await page.innerHTML('#ai-analytics-content');
    console.log("Container HTML length:", html.length);
    
    if (html.length > 0) {
        await page.click('#ai-gen-weekly-btn');
        await page.waitForTimeout(500);
        await page.click('#sleep-confirm');
        await expect(page.locator('#ai-status-bar')).toBeHidden({ timeout: 15000 });
        
        // Let's see what happens after generate
        const dialog = await new Promise(r => {
             const t = setTimeout(() => r({ message: () => "NO DIALOG" }), 5000);
             page.once('dialog', d => { clearTimeout(t); r(d); });
        });
        console.log("Dialog: " + dialog.message());
        if (dialog.accept) await dialog.accept();
    }
});
