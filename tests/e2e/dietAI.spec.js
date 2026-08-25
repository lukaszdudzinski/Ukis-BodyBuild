const { test, expect } = require('@playwright/test');

test.describe('Diet AI Result Confirmation Modal', () => {
  test('powinien pokazać modal z przyciskami +/- i zapisać posiłek z miniaturą', async ({ page }) => {
    await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); });
    await page.goto('http://127.0.0.1:8080/');

    // Czekamy dłuższą chwilę, aż aplikacja w pełni zainicjuje DOM i nadpisze domyślne widoki
    await page.waitForTimeout(2000);
    
    // Przejdź do zakładki Dieta
    await page.evaluate(() => window.switchTab('diet-dashboard'));
    await page.waitForSelector('#diet-dashboard', { state: 'visible' });

    // Ręcznie wywołujemy modal, tak jakby AI zwróciło wynik
    await page.evaluate(() => {
        const mockResult = {
            food_name: "Sałatka z kurczakiem",
            calories: 300,
            protein: 30,
            carbs: 10,
            fat: 15
        };
        const mockThumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="; // 1x1 red pixel
        window.DietUI.showResultConfirmation(mockResult, mockThumbnail, null);
    });

    // Czekamy na pojawienie się modala
    const modal = page.locator('#diet-result-modal-overlay');
    await expect(modal).toBeVisible();

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
    await expect(modal).toBeHidden();

    // Sprawdzamy czy posiłek pojawił się na liście
    // Kontener listy znajduje się w #diet-today-list
    const todayList = page.locator('#diet-today-list');
    
    // Sprawdzamy tekst "Sałatka z kurczakiem"
    await expect(todayList.locator('text=Sałatka z kurczakiem').first()).toBeVisible();
    
    // Sprawdzamy, czy kalorie to 250 (po modyfikacji)
    await expect(todayList.locator('text=250 kcal').first()).toBeVisible();

    // Sprawdzamy obecność miniatury (element <img> w kontenerze)
    const thumbnailImg = todayList.locator('img').first();
    await expect(thumbnailImg).toBeVisible();
    
    // Sprawdzamy czy źródło (src) pokrywa się z naszym bazowym mockowanym obrazkiem
    const imgSrc = await thumbnailImg.getAttribute('src');
    expect(imgSrc).toContain('data:image/png;base64');
  });
});
