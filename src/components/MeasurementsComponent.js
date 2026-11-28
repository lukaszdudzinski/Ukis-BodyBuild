// wyglad: zar
import { naglowek } from '../modules/wyglad/naglowek.js';
import { ikona } from '../modules/wyglad/ikony.js';

// Pole liczbowe formularza: podpis nad polem, `id` jak dotąd (zapis i odczyt stoją na tych id).
const pole = (id, podpis, atrybuty = '') => `
    <div class="z-pole">
        <label for="${id}" class="z-mut">${podpis}</label>
        <input type="number" id="${id}" class="z-in" inputmode="decimal" ${atrybuty}>
    </div>`;

export const MeasurementsComponent = {
    render: () => {
        return `
            ${naglowek({ wariant: 'back', tytul: 'Pomiary ciała', podtytul: 'Waga i obwody', wroc: 'welcome-screen' })}

            <form id="measurementsForm" class="z-pomiary-form">
                <div class="z-card z-pomiary-karta">
                    <div class="z-siatka-2">
                        <div class="z-pole">
                            <label for="measureDate" class="z-mut">Data pomiaru</label>
                            <input type="date" id="measureDate" class="z-in" required>
                        </div>
                        <div class="z-pole">
                            <span id="measureGenderLabel" class="z-mut">Płeć</span>
                            <div id="measureGender" class="z-tabs" role="tablist" aria-labelledby="measureGenderLabel" tabindex="-1" data-value="">
                                <button type="button" class="z-tab" role="tab" aria-selected="false" data-plec="male">Mężczyzna</button>
                                <button type="button" class="z-tab" role="tab" aria-selected="false" data-plec="female">Kobieta</button>
                            </div>
                        </div>
                        ${pole('measureWeight', 'Waga (kg)', 'step="0.1" min="25" max="350" required')}
                        ${pole('measureHeight', 'Wzrost (cm)', 'step="1" min="100" max="250"')}
                    </div>

                    <hr class="z-sep">

                    <h2 class="z-pomiary-tyt">Obwody (cm) <span class="z-mut">· opcjonalne, do wzoru US Navy</span></h2>
                    <p class="z-mut z-pomiary-wskazowka">Kompletne dane (obwód szyi, talii, u kobiet także bioder, oraz wzrost) pozwalają dokładnie wyliczyć tkankę tłuszczową (BF%). Podawanie ich ułatwia analizy, ale nie jest obowiązkowe.</p>
                    <div class="z-siatka-3">
                        ${pole('measureChest', 'Klatka', 'step="0.5"')}
                        ${pole('measureWaist', 'Talia', 'step="0.5"')}
                        ${pole('measureHips', 'Biodra', 'step="0.5"')}
                        ${pole('measureThigh', 'Udo', 'step="0.5"')}
                        ${pole('measureBiceps', 'Biceps', 'step="0.5"')}
                        ${pole('measureNeck', 'Szyja', 'step="0.5"')}
                    </div>

                    <div class="z-pomiary-akcje">
                        <input type="file" id="measurePhoto" class="z-sr" accept="image/*">
                        <label for="measurePhoto" class="z-ghost z-pomiary-foto">
                            ${ikona('camera', 18)}
                            Zdjęcie sylwetki
                        </label>
                        <button type="submit" class="z-btn">
                            ${ikona('check', 18)}
                            Zapisz pomiary
                        </button>
                    </div>
                    <img id="measurePhotoPreview" class="z-pomiary-podglad" alt="Podgląd zdjęcia sylwetki" hidden>
                </div>
            </form>

            <section class="z-pomiary-historia" aria-labelledby="measurementsHistoryTitle">
                <h2 id="measurementsHistoryTitle" class="z-pomiary-tyt">Historia pomiarów</h2>
                <div id="measurements-list" class="z-pomiary-lista">
                    <p class="z-mut z-pomiary-pusto">Brak dodanych pomiarów.</p>
                </div>
            </section>
        `;
    }
};
