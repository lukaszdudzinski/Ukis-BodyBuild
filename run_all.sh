pkill -f http-server || true
CI=1 npx playwright test --workers=1
