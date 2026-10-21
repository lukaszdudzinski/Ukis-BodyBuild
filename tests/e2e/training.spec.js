import fs from 'fs';
import path from 'path';
import { test, expect } from '../fixtures.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { TrainingPage } from './pages/TrainingPage.js';

test.describe('Training Workflow', () => {
    test('Should navigate to training and open session form', async ({ page }) => {
        const dashboard = new DashboardPage(page);
        const trainingPage = new TrainingPage(page);

        // Given I am on the home page
        // Wyłącz też kontekstowy dymek przewodnika (pojawia się po 800 ms od wejścia w Trening
        // i przy obciążeniu trafiał w zrzut raz tak, raz nie).
        await page.addInitScript(() => {
            window.localStorage.setItem('tutorial_global_v22', 'true');
            window.localStorage.setItem('tutorial_context_training', 'true');
        });
        await dashboard.navigate();

        // When I click on Training tile
        await dashboard.goToTraining();

        // Then I should see the calendar
        await expect(page.locator('#training-calendar-view')).toBeVisible();

        // When I select day 15 (arbitrary day without training initially)
        await trainingPage.selectDay('15');

        // Then I should see the start new session button
        await expect(trainingPage.startNewSessionBtn).toBeVisible();

        // When I click start session
        await trainingPage.startNewSession();

        // Then I should see the active training view
        await expect(page.locator('#active-training-view')).toBeVisible();
        await expect(trainingPage.trainingNameInput).toBeVisible();

        // Po starcie sesji aplikacja dodaje pierwsze ćwiczenie i po 100 ms fokusuje jego pole oraz
        // płynnie przewija je na środek (TrainingUI.addExercise, scrollIntoView smooth). Playwright nie
        // wstrzymuje płynnego przewijania, więc przy obciążeniu zrzut łapał stronę w trakcie ruchu.
        // Czekamy na fokus pola ćwiczenia i na to, aż przewinięcie przestanie się zmieniać.
        await expect(page.locator('.exercise-name-input').last()).toBeFocused();
        await page.locator('.tab-content-wrapper').evaluate((el) => new Promise((resolve) => {
            let last = -1;
            let since = performance.now();
            const tick = () => {
                if (el.scrollTop !== last) { last = el.scrollTop; since = performance.now(); }
                if (performance.now() - since >= 300) resolve(); else requestAnimationFrame(tick);
            };
            tick();
        }));

        // Take a snapshot to ensure the form looks correct (Visual Regression)
        const mask = [page.locator('#training-timer')];
        const snapshotFile = test.info().snapshotPath('active-training-form.png');
        if (process.env.CI && !fs.existsSync(snapshotFile)) {
            // CI (Linux) bez wzorca: toHaveScreenshot zapisałby plik i oznaczył test jako nieudany.
            // Zapisujemy zrzut (idzie do artefaktu linux-snapshots), a porównanie wizualne jest
            // nieaktywne do czasu dodania wzorca *-linux.png do repozytorium.
            fs.mkdirSync(path.dirname(snapshotFile), { recursive: true });
            await page.screenshot({ path: snapshotFile, mask, animations: 'disabled', caret: 'hide', scale: 'css' });
            test.info().annotations.push({ type: 'brak-wzorca', description: 'Zapisano ' + path.basename(snapshotFile) + ' — porównanie wizualne nieaktywne do czasu commita wzorca' });
        } else {
            await expect(page).toHaveScreenshot('active-training-form.png', { maxDiffPixels: 100, mask });
        }
    });

    for (const variant of [
        { name: 'nowy wygląd', path: '/', classic: false },
        { name: 'klasyczny', path: '/classic.html', classic: true },
    ]) {
        test(`pole nazwy treningu ma tło inne niż kolor tekstu (${variant.name})`, async ({ page }) => {
            const trainingPage = new TrainingPage(page);

            await page.addInitScript((classic) => {
                window.localStorage.setItem('tutorial_global_v22', 'true');
                if (classic) window.localStorage.setItem('uki-ui-version', 'classic');
            }, variant.classic);
            await page.goto(variant.path);
            await page.waitForTimeout(1000);

            await page.evaluate(() => window.switchTab('training-dashboard'));
            await expect(page.locator('#training-calendar-view')).toBeVisible();
            await trainingPage.selectDay('15');
            await trainingPage.startNewSession();
            await expect(trainingPage.trainingNameInput).toBeVisible();
            await trainingPage.setTrainingName('Push A');

            const { backgroundColor, color } = await trainingPage.trainingNameInput.evaluate((el) => {
                const cs = getComputedStyle(el);
                return { backgroundColor: cs.backgroundColor, color: cs.color };
            });
            expect(backgroundColor).not.toBe(color);
            expect(backgroundColor).not.toBe('rgb(255, 255, 255)');
        });
    }
});
