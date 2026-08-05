import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove SOS tile
content = re.sub(
    r'<div class="dashboard-card tile-sos"[^>]*>.*?</div>\s*</div>',
    '</div>\n                        </div>',
    content,
    flags=re.DOTALL
)

# Remove all old modules and inject new ones
new_modules = '''
                <!-- BodyBuild Modules -->
                <div id="measurements-dashboard" class="tab-content" style="display: none;">
                    <div class="view-header">
                        <h2>Pomiary Ciała</h2>
                        <p style="color: #b0b0b0;">Śledź wagę i obwody</p>
                    </div>
                </div>
                
                <div id="training-dashboard" class="tab-content" style="display: none;">
                    <div class="view-header">
                        <h2>Trening</h2>
                        <p style="color: #b0b0b0;">Wprowadzanie i kalendarz</p>
                    </div>
                </div>

                <div id="analytics-dashboard" class="tab-content" style="display: none;">
                    <div class="view-header">
                        <h2>Analiza Progresu</h2>
                        <p style="color: #b0b0b0;">Wykresy i statystyki</p>
                    </div>
                </div>

                <div id="diet-dashboard" class="tab-content" style="display: none;">
                    <div class="view-header">
                        <h2>Dieta i Żywienie</h2>
                        <p style="color: #b0b0b0;">Under construction</p>
                    </div>
                </div>

                <div id="settings-panel"'''

content = re.sub(
    r'<!-- Lunar Calendar Tab -->.*?<div id="settings-panel"',
    new_modules,
    content,
    flags=re.DOTALL
)

# Remove the emergency content modal
content = re.sub(
    r'<!-- Emergency Content Template \(Hidden\) -->.*?<!-- Global Tooltip',
    '<!-- Global Tooltip',
    content,
    flags=re.DOTALL
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
