const { test, expect } = require('@playwright/test');
const fs = require('fs'); const path = require('path'); const vm = require('vm');
const ROOT = path.join(__dirname, '../..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const SW_SRC = read('sw.js');
const CACHE_NAME = SW_SRC.match(/const CACHE_NAME = '([^']+)';/)[1];
function loadSw(names) {
  const store = new Set(names); const handlers = {};
  const caches = { keys: async () => [...store], delete: async k => store.delete(k), open: async k => { store.add(k); return { put: async () => {} }; } };
  const self = { addEventListener: (t, fn) => { handlers[t] = fn; }, clients: { claim: async () => {} }, skipWaiting: () => {} };
  vm.runInNewContext(SW_SRC, { self, caches, fetch: async () => { throw new Error('offline'); }, Request: class {}, Response: class {}, console });
  return { store, handlers };
}
test.describe('sw.js activate (D1)', () => {
  test('usuwa tylko własne stare cache, cudze zostają', async () => {
    const { store, handlers } = loadSw([CACHE_NAME, 'ukis-bodybuild-v1', 'ukis-bodybuild-cache-v2026.8.14.04', 'uki-bodybuild-v2026.8.14.03', 'ukis-bikelog-v1', 'ukis-dive-tools-v1', 'ssi-standards-trainer-v1']);
    const pending = []; handlers.activate({ waitUntil: p => pending.push(p) }); await Promise.all(pending);
    expect([...store].sort()).toEqual([CACHE_NAME, 'ssi-standards-trainer-v1', 'ukis-bikelog-v1', 'ukis-dive-tools-v1'].sort());
  });
  test('CACHE_NAME pasuje do version.mjs i do własnego prefiksu', async () => {
    expect(SW_SRC).toMatch(/const CACHE_NAME = 'ukis-bodybuild-(.*?)';/);
    const prefixes = JSON.parse(SW_SRC.match(/const OWN_CACHE_PREFIXES = (\[[^\]]*\]);/)[1].replace(/'/g, '"'));
    expect(prefixes).toEqual(['ukis-bodybuild-', 'uki-bodybuild-']);
    expect(prefixes.some(p => CACHE_NAME.startsWith(p))).toBe(true);
  });
});
test.describe('repozytorium i CI', () => {
  test('npm test, fsevents opcjonalny, brak vercel.json, workflow blokuje publikację', async () => {
    const pkg = JSON.parse(read('package.json')); const lock = JSON.parse(read('package-lock.json'));
    expect(pkg.scripts.test).toBe('playwright test');
    expect(pkg.dependencies.fsevents).toBeUndefined();
    expect(lock.packages['node_modules/fsevents'].optional).toBe(true);
    expect(fs.existsSync(path.join(ROOT, 'vercel.json'))).toBe(false);
    const wf = read('.github/workflows/deploy.yml');
    for (const s of ['needs: test', "github.ref == 'refs/heads/master'", 'actions/jekyll-build-pages@v1', 'npx playwright install --with-deps chromium', '--update-snapshots=missing']) expect(wf).toContain(s);
    expect(wf).not.toMatch(/path:\s*['"]?\.['"]?\s*$/m);
  });
});
