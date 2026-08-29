# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: trainingHistory.spec.js >> Training and History Flow >> powinien poprawnie wyświetlać Blok Łączony w oknie modalnym historii (bez Nieznane ćwiczenie)
- Location: tests/e2e/trainingHistory.spec.js:108:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('text=Trening z superserią test').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Trening z superserią test').first()
    13 × locator resolved to <strong>Trening z superserią test</strong>
       - unexpected value "hidden"

```

```yaml
- navigation:
  - img "Logo"
  - heading "Uki's BodyBuild" [level=1]
  - list:
    - listitem:
      - link "Pulpit Główny":
        - /url: "#"
    - listitem:
      - link "Pomiary Ciała":
        - /url: "#"
    - listitem:
      - link "Trening":
        - /url: "#"
    - listitem:
      - link "Historia Treningów":
        - /url: "#"
    - listitem:
      - link "Analiza Progresu":
        - /url: "#"
    - listitem:
      - link "Dieta i Żywienie":
        - /url: "#"
    - listitem:
      - link "Diagnostyka":
        - /url: "#"
    - listitem:
      - link "Profil i Ustawienia":
        - /url: "#"
  - link "☕ Podoba Ci się to narzędzie? Postaw mi kawę!":
    - /url: https://suppi.pl/ukidives
    - text: ☕ Podoba Ci się to narzędzie?
    - strong: Postaw mi kawę!
  - text: Trial (7 dni) v2026.8.29.01
- main:
  - heading "Historia Treningów" [level=2]
  - paragraph: Rozwiń, by zobaczyć szczegóły
  - text: 📥 Importuj trening
  - heading "sierpień 2026" [level=3]
  - strong: 🏋️ 2026-08-29 - Trening z superserią test
  - text: 1 ćwiczeń | 0 kg ▼
- button "🤖"
```

# Test source

```ts
  41  |     await page.click('#add-exercise-to-plan-btn');
  42  |     await page.waitForTimeout(500);
  43  | 
  44  |     // --- Exercise 2: Wyciskanie skośne ---
  45  |     const exerciseInputs = page.locator('.exercise-name-input');
  46  |     await exerciseInputs.nth(1).fill('Wyciskanie skośne');
  47  | 
  48  |     const weightInputs = page.locator('input[placeholder="kg"]');
  49  |     const repsInputs = page.locator('input[placeholder="powt"]');
  50  |     const addSetBtns = page.locator('button:has-text("+ Seria")');
  51  |     
  52  |     await weightInputs.nth(1).fill('60');
  53  |     await repsInputs.nth(1).fill('15');
  54  |     await addSetBtns.nth(1).click();
  55  |     await weightInputs.nth(1).fill('65');
  56  |     await repsInputs.nth(1).fill('12');
  57  |     await addSetBtns.nth(1).click();
  58  |     await weightInputs.nth(1).fill('70');
  59  |     await repsInputs.nth(1).fill('10');
  60  |     await addSetBtns.nth(1).click();
  61  | 
  62  |     // Add third exercise
  63  |     await page.click('#add-exercise-to-plan-btn');
  64  |     await page.waitForTimeout(500);
  65  | 
  66  |     // --- Exercise 3: Triceps ---
  67  |     const exInputs3 = page.locator('.exercise-name-input');
  68  |     await exInputs3.nth(2).fill('Francuskie wyciskanie (Triceps)');
  69  | 
  70  |     const weightInputs3 = page.locator('input[placeholder="kg"]');
  71  |     const repsInputs3 = page.locator('input[placeholder="powt"]');
  72  |     const addSetBtns3 = page.locator('button:has-text("+ Seria")');
  73  | 
  74  |     await weightInputs3.nth(2).fill('30');
  75  |     await repsInputs3.nth(2).fill('15');
  76  |     await addSetBtns3.nth(2).click();
  77  |     await weightInputs3.nth(2).fill('35');
  78  |     await repsInputs3.nth(2).fill('12');
  79  |     await addSetBtns3.nth(2).click();
  80  |     await weightInputs3.nth(2).fill('40');
  81  |     await repsInputs3.nth(2).fill('10');
  82  |     await addSetBtns3.nth(2).click();
  83  | 
  84  |     // Finish training
  85  |     page.on('dialog', dialog => dialog.accept());
  86  |     await page.click('#finish-training-btn');
  87  |     await expect(page.locator('#training-calendar-view')).toBeVisible({ timeout: 5000 });
  88  | 
  89  |     // Go to History tab
  90  |     await page.evaluate(() => window.switchTab('history-dashboard'));
  91  | 
  92  |     // Wait for history to load
  93  |     await page.waitForTimeout(1000);
  94  | 
  95  |     // Assert that the training is in history
  96  |     await expect(page.locator('#history-dashboard >> text=Trening siłowy test').first()).toBeVisible();
  97  | 
  98  |     // Expand details
  99  |     await page.locator('text=▼').first().click();
  100 | 
  101 |     // Verify details are shown
  102 |     await expect(page.locator('text=Szczegóły ćwiczeń:').first()).toBeVisible();
  103 |     await expect(page.locator('text=Wyciskanie sztangi leżąc').first()).toBeVisible();
  104 |     await expect(page.locator('text=Wyciskanie skośne').first()).toBeVisible();
  105 |     await expect(page.locator('text=Francuskie wyciskanie (Triceps)').first()).toBeVisible();
  106 |   });
  107 | 
  108 |   test('powinien poprawnie wyświetlać Blok Łączony w oknie modalnym historii (bez Nieznane ćwiczenie)', async ({ page }) => {
  109 |     await page.addInitScript(() => { window.localStorage.setItem('tutorial_global_v22', 'true'); });
  110 |     await page.goto('http://127.0.0.1:8080/');
  111 | 
  112 |     // Utwórz trening z blokiem łączonym (manualnie wstrzyknięty do DB dla szybkości, by przetestować UI historii)
  113 |     await page.evaluate(async () => {
  114 |         const today = new Date().toISOString().split('T')[0];
  115 |         await window.DatabaseManager.addTraining({
  116 |             date: today,
  117 |             name: "Trening z superserią test",
  118 |             duration_seconds: 3600,
  119 |             type: "strength",
  120 |             exercises: [
  121 |                 {
  122 |                     id: "sup1",
  123 |                     type: "superset",
  124 |                     name: "",
  125 |                     exercises: [
  126 |                         { id: "s1", type: "strength", name: "Biceps", sets: [{weight: 10, reps: 10}] },
  127 |                         { id: "s2", type: "strength", name: "Triceps", sets: [{weight: 15, reps: 10}] }
  128 |                     ]
  129 |                 }
  130 |             ]
  131 |         });
  132 |     });
  133 | 
  134 |     await page.reload();
  135 | 
  136 |     // Idź do historii
  137 |     await page.evaluate(() => window.switchTab('history-dashboard'));
  138 |     await page.waitForSelector('#history-dashboard', { state: 'visible' });
  139 | 
  140 |     // Rozwiń trening z superserią
> 141 |     await expect(page.locator('text=Trening z superserią test').first()).toBeVisible();
      |                                                                          ^ Error: expect(locator).toBeVisible() failed
  142 |     
  143 |     // Kliknij żeby otworzyć modal podglądu (w Historii kliknięcie w kartę zazwyczaj otwiera podgląd viewTrainingFromHistory lub rozwija go)
  144 |     // Zrzut pokazuje, że po kliknięciu jest modal. Możemy wywołać podgląd bezpośrednio jeśli selektory są trudne, np. viewTrainingFromHistory
  145 |     await page.locator('text=Trening z superserią test').first().click();
  146 | 
  147 |     // Sprawdź czy jest Blok Łączony i nie ma "Nieznane ćwiczenie"
  148 |     await expect(page.locator('text=Blok Łączony (Superseria)').first()).toBeVisible();
  149 |     await expect(page.locator('text=Biceps').first()).toBeVisible();
  150 |     await expect(page.locator('text=Triceps').first()).toBeVisible();
  151 | 
  152 |     // Powinno nie być tekstu "Nieznane ćwiczenie"
  153 |     await expect(page.locator('text=Nieznane ćwiczenie')).toHaveCount(0);
  154 |   });
  155 | });
  156 | 
```