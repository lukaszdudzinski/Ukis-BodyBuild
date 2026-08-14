const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', error => {
    console.error(`Page Error: ${error.message}`);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error(`Console Error: ${msg.text()}`);
    }
  });

  await page.goto('file://' + __dirname + '/index.html');
  await page.waitForTimeout(2000);
  await browser.close();
})();
