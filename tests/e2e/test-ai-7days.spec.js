const { test, expect } = require('../fixtures');

test('Test 7 days AI analysis', async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    // Obsługa dialogów rejestrowana PRZED nawigacją i przed jakąkolwiek akcją, która mogłaby je wywołać
    // (bez nasłuchu Playwright sam odrzuca dialog, a późne accept() kończy się błędem protokołu).
    // W tym teście dialog potrafi się pojawić niezależnie od analizy AI: BackupUI.js:6 po 5 s od startu
    // pyta confirm-em o kopię zapasową, gdy brak 'uki_last_backup_date'.
    const dialogs = [];
    page.on('dialog', async dialog => {
        dialogs.push(dialog.message());
        await dialog.dismiss();
    });

    await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); window.localStorage.setItem('uki_premium_access', 'true'); });
    await page.goto('/');
    await page.waitForTimeout(1000);

    await page.evaluate(() => window.switchTab('ai-analytics-dashboard'));
    await page.waitForTimeout(500);

    // Dispatch custom event to trigger render
    await page.evaluate(() => document.dispatchEvent(new CustomEvent('tabChanged', { detail: { tab: 'ai-analytics-dashboard' } })));

    await page.click('#ai-gen-weekly-btn');
    await page.click('#ai-interview-submit');
    await expect(page.locator('#ai-status-bar')).toBeHidden({ timeout: 15000 });

    // Świeża baza nie ma treningów z ostatnich 7 dni, więc AiAnalyticsUI.generateAnalysis
    // (AiAnalyticsUI.js:255-258) zamiast analizy pokazuje modal "Brak danych do analizy" (bez alert()).
    await expect(page.locator('#ai-nodata-modal')).toBeVisible();
    await expect(page.locator('#ai-nodata-modal')).toContainText('Brak danych do analizy');

    // Żaden dialog nie może pochodzić z błędu analizy (AiAnalyticsUI.js:280, :285)
    for (const message of dialogs) {
        expect(message).not.toContain('Błąd generowania analizy');
        expect(message).not.toContain('Trener Edward nie odpowiedział');
    }
});
