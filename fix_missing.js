const fs = require('fs');
let code = fs.readFileSync('tests/e2e/analytics.spec.js', 'utf8');
code = code.replace(/'Brak danych do wyliczenia BF%'/g, "'Brak danych BF%'");
code = code.replace(/'Uzupełnij: Szyja'/g, "'Uzupełnij: Szyja.'");
fs.writeFileSync('tests/e2e/analytics.spec.js', code);
