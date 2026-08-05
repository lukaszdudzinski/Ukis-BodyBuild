const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`PAGE ERROR: ${msg.text()}`);
    } else {
        console.log(`PAGE LOG: ${msg.text()}`);
    }
  });

  page.on('pageerror', exception => {
    console.log(`UNCAUGHT EXCEPTION: ${exception}`);
  });

  // Start a local server first
  const { exec } = require('child_process');
  const server = exec('python3 -m http.server 8080');
  
  // Wait for server to boot
  await new Promise(r => setTimeout(r, 2000));

  await page.goto('http://localhost:8080/');
  
  // Try to click a tile
  try {
      await page.click('text="Pomiary Ciała"');
      await page.waitForTimeout(1000);
  } catch (e) {
      console.log('Error clicking tile:', e.message);
  }

  await browser.close();
  server.kill();
})();
