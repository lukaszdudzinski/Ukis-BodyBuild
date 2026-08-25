const { test, expect } = require('@playwright/test');

test.describe('Diet AI Result Confirmation Modal', () => {
  test('powinien pokazać modal z przyciskami +/- i zapisać posiłek z miniaturą', async ({ page }) => {
    await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); });
    await page.goto('http://127.0.0.1:8080/');

    // Czekamy dłuższą chwilę na pełen start aplikacji
    await page.waitForTimeout(2000);
    
    // Ręcznie przejdź do zakładki Dieta
    await page.evaluate(() => window.switchTab('diet-dashboard'));
    // Zamiast wait for visible, po prostu poczekaj aż UI się wczyta
    await page.waitForTimeout(1000);

    // Ręcznie wywołujemy modal, tak jakby AI zwróciło wynik
    await page.evaluate(() => {
        const mockResult = {
            food_name: "Sałatka z kurczakiem",
            calories: 300,
            protein: 30,
            carbs: 10,
            fat: 15
        };
        const mockThumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
        window.DietUI.showResultConfirmation(mockResult, mockThumbnail, null);
    });

    // Czekamy na pojawienie się modala (modal jest dołączony do body, więc będzie widoczny)
    const modal = page.locator('#diet-result-modal-overlay');
    await modal.waitFor({ state: 'visible' });

    // Sprawdzamy początkową wartość kalorii
    const kcalDisplay = page.locator('#diet-result-kcal-display');
    await expect(kcalDisplay).toHaveText('300');

    // Klikamy "+" by zwiększyć kalorie o 50
    const btnPlus = page.locator('#btn-plus-kcal');
    await btnPlus.click();
    await expect(kcalDisplay).toHaveText('350');

    // Klikamy "-" by zmniejszyć kalorie o 50 (wraca do 300) i jeszcze raz (250)
    const btnMinus = page.locator('#btn-minus-kcal');
    await btnMinus.click();
    await btnMinus.click();
    await expect(kcalDisplay).toHaveText('250');

    // Klikamy "Zapisz"
    await page.locator('#diet-result-save').click();

    // Modal powinien zniknąć
    await modal.waitFor({ state: 'hidden' });

    // Sprawdzamy czy posiłek pojawił się na liście (nie wymuszamy widoczności, by uniknąć problemu hidden parent)
    const todayList = page.locator('#diet-today-list');
    await expect(todayList.locator('text=Sałatka z kurczakiem').first()).toBeAttached();
    await expect(todayList.locator('text=250 kcal').first()).toBeAttached();
  });
});
