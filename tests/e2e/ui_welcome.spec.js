const { test, expect } = require('../fixtures');

test.describe('Modal „Witaj w Nowym Wyglądzie!”', () => {
  test.describe('nowy użytkownik', () => {
    test.use({ skipUiWelcome: false });

    test('pokazuje modal nowemu użytkownikowi i zapamiętuje zamknięcie', async ({ page }) => {
      await page.goto('/');
      const overlay = page.locator('#uki-new-ui-welcome-overlay');
      await expect(overlay.getByRole('heading', { name: 'Witaj w Nowym Wyglądzie!' })).toBeVisible();
      await page.locator('#btn-welcome-explore').click();
      await expect(overlay).toHaveCount(0);
      expect(await page.evaluate(() => localStorage.getItem('uki-ui-welcome-seen'))).toBe('true');
      await page.reload();
      await page.waitForTimeout(1000);
      await expect(overlay).toHaveCount(0);
    });
  });

  test('fikstura pomija modal', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await expect(page.locator('#uki-new-ui-welcome-overlay')).toHaveCount(0);
  });

  test('uki-ui-version=classic przenosi na classic.html bez modala', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('uki-ui-version', 'classic'));
    await page.goto('/');
    await expect(page).toHaveURL(/\/classic\.html$/);
    await page.waitForTimeout(1000);
    await expect(page.locator('#uki-new-ui-welcome-overlay')).toHaveCount(0);
  });
});
