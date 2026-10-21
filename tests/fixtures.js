const fs = require('fs');
const path = require('path');
const base = require('@playwright/test');

// Bieżąca wersja aplikacji (ta sama, którą AppUI.js porównuje z `uki-bodybuild-last-version`).
const CURRENT_VERSION = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'CHANGELOG.json'), 'utf8')
)[0].version;

// Wspólna fikstura: domyślnie wycisza dwie nakładki, które zasłaniałyby interfejs w testach:
//  - modal „Witaj w Nowym Wyglądzie!” (z-index 999999): `uki-ui-welcome-seen` = 'true',
//  - changelog po aktualizacji: `uki-bodybuild-last-version` = bieżąca wersja z CHANGELOG.json.
// Test wyłącza wyciszenie przez `test.use({ skipUiWelcome: false })` / `test.use({ skipChangelog: false })`.
// Init-script z samego speca biegnie po fiksturze, więc celowe nadpisania w specach wygrywają.
const test = base.test.extend({
  skipUiWelcome: [true, { option: true }],
  skipChangelog: [true, { option: true }],
  page: async ({ page, skipUiWelcome, skipChangelog }, use) => {
    if (skipUiWelcome || skipChangelog) {
      await page.addInitScript(
        ({ welcome, changelogVersion }) => {
          if (welcome) localStorage.setItem('uki-ui-welcome-seen', 'true');
          if (changelogVersion) localStorage.setItem('uki-bodybuild-last-version', changelogVersion);
        },
        { welcome: skipUiWelcome, changelogVersion: skipChangelog ? CURRENT_VERSION : null }
      );
    }
    await use(page);
  },
});

module.exports = { test, expect: base.expect };
