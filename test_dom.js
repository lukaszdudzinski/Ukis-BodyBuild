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

  const { exec } = require('child_process');
  const server = exec('python3 -m http.server 8080');
  await new Promise(r => setTimeout(r, 2000));

  await page.goto('http://localhost:8080/');
  await page.waitForTimeout(1000);
  
  console.log("Clicking Trening...");
  await page.evaluate(() => window.switchTab('training-dashboard'));
  await page.waitForTimeout(1000);
  
  const display = await page.evaluate(() => document.getElementById('training-dashboard').style.display);
  const html = await page.evaluate(() => document.getElementById('training-dashboard').innerHTML);
  
  console.log('Training Dashboard Display:', display);
  console.log('Training Dashboard HTML:', html ? html.substring(0, 150) + '...' : 'EMPTY');

  await browser.close();
  server.kill();
})();
