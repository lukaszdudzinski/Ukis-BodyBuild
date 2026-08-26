const fs = require('fs');
let content = fs.readFileSync('src/modules/ui/TemplateBuilderUI.js', 'utf8');

content = content.replace(/TemplateBuilderUI\.renderCart\(\);\s*if \(window\.navigator && window\.navigator\.vibrate\)/,
`// Oznacz ćwiczenia jako ustawione (odznacz checkboxa) by łatwiej konfigurować kolejne
        TemplateBuilderUI.cart.forEach((ex, index) => {
            const cb = document.getElementById(\`builder-select-\${index}\`);
            if (cb && cb.checked) cb.checked = false;
        });

        TemplateBuilderUI.renderCart();
        
        if (window.navigator && window.navigator.vibrate)`);

fs.writeFileSync('src/modules/ui/TemplateBuilderUI.js', content);
