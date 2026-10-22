const OVERLOAD_MSG = "Serwery Google AI są teraz przeciążone. Spróbuj ponownie za kilka minut.";
const QUOTA_MSG = "Darmowy limit zapytań AI został wyczerpany na dziś. Wróć i spróbuj ponownie jutro!";
const NETWORK_MSG = "Brak połączenia z internetem lub serwer jest nieosiągalny.";
const INVALID_MSG = "Serwer AI zwrócił nieprawidłową odpowiedź. Spróbuj ponownie.";
const INCOMPLETE_MSG = "Serwer AI zwrócił niepełne dane. Spróbuj zrobić wyraźniejsze zdjęcie.";

// Treść napisu w trakcie oczekiwania na kolejną próbę (zależnie od rodzaju błędu).
const RETRY_LABELS = {
    overload: 'Serwery AI są przeciążone.',
    network: 'Brak połączenia.',
    invalid: 'Nieprawidłowa odpowiedź serwera.'
};

const VARIANT = import.meta.url.includes('/classic-app/') ? 'klasyczny' : 'glass';

const isQuotaText = (text) => /exceeded your current quota|quota exceeded/i.test(text);
const isOverloadText = (text) => /high demand|overloaded|UNAVAILABLE/i.test(text);

// Błąd z danymi do diagnostyki (kod HTTP, model, surowa odpowiedź). `retryable` decyduje o ponowieniu.
const dietError = (message, info = {}) => Object.assign(new Error(message), info);

// Gemini bywa „gadatliwy”: wstęp przed JSON-em, znaczniki ```json, komentarz po nim.
// Zwraca obiekt albo null (nigdy nie rzuca SyntaxError).
const parseJsonLoose = (text) => {
    const tryParse = (s) => {
        try {
            const v = JSON.parse(s);
            return v && typeof v === 'object' && !Array.isArray(v) ? v : null;
        } catch (e) {
            return null;
        }
    };
    const trimmed = (text || '').replace(/```(?:json)?/gi, '').trim();
    if (!trimmed) return null;
    const direct = tryParse(trimmed);
    if (direct) return direct;
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    return start !== -1 && end > start ? tryParse(trimmed.slice(start, end + 1)) : null;
};

// Fragment odpowiedzi do logu: bez zdjęć (base64), bez opisu posiłku i bez znaczników HTML
// (panel Serwis → Logi błędów wstawia wpisy przez innerHTML).
const safeSnippet = (text, contextText) => {
    let s = String(text || '');
    if (contextText) s = s.split(contextText).join('[opis]');
    return s
        .replace(/data:[^\s"']+/g, '[base64]')
        .replace(/[A-Za-z0-9+/=]{100,}/g, '[base64]')
        .replace(/</g, '‹')
        .replace(/>/g, '›')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 160);
};

// Mapowanie odpowiedzi błędu (zarówno starego workera: 500 + tekst, jak i nowego: prawdziwy kod + pola).
const classifyFailure = (status, raw, body) => {
    const errText = body && typeof body.error === 'string' ? body.error : raw;
    const info = { status, raw, model: body && body.model };

    if (status === 429 || isQuotaText(errText)) {
        if (body && body.quota === 'minute') {
            const wait = body.retryAfterSec || 60;
            return dietError(`Za dużo zapytań do AI w tej minucie. Spróbuj ponownie za ${wait} s.`, info);
        }
        return dietError(QUOTA_MSG, info);
    }
    // Nowy worker: model odpowiedział, ale bez poprawnego JSON-a (kolejna próba zwykle się udaje).
    if (body && body.reason === 'invalid_output') {
        return dietError(INVALID_MSG, { ...info, retryable: true, kind: 'invalid' });
    }
    if ([502, 503, 504, 528].includes(status) || isOverloadText(errText)) {
        return dietError(OVERLOAD_MSG, { ...info, retryable: true, kind: 'overload' });
    }
    if (body && typeof body.error === 'string' && body.error) {
        return dietError(body.error, info);
    }
    return dietError(`Wystąpił błąd serwera AI (HTTP ${status}). Spróbuj ponownie.`, info);
};

export const DietAIEngine = {
    // Przerwy przed kolejnymi próbami (wykładniczo) + losowy rozrzut, żeby klienci nie wracali naraz.
    retryDelaysMs: [2000, 4000, 8000],
    retryJitterMs: 1000,

    analyzeImage: async (imagesBase64, contextText) => {
        // Z LocalStorage pobieramy URL do naszego Workera Cloudflare (lub używamy domyślnego dla wszystkich klientów)
        if (window.PremiumUI && !window.PremiumUI.checkPremium()) {
            window.PremiumUI.showPremiumPaywall();
            return { error: "Wymagany dostęp premium." };
        }

        const workerUrl = localStorage.getItem('dietWorkerUrl') || 'https://uki-dieta.lukasz-dudzinski.workers.dev';

        if (!workerUrl) {
            throw new Error("Brak skonfigurowanego adresu serwera (Workera Cloudflare) w Ustawieniach!");
        }

        // Upewniamy się, że URL jest poprawny
        let cleanUrl = workerUrl.trim();
        if (!cleanUrl.startsWith('http')) {
            cleanUrl = 'https://' + cleanUrl;
        }

        let imageList = [];
        if (Array.isArray(imagesBase64)) {
            imageList = imagesBase64.filter(Boolean);
        } else if (imagesBase64) {
            imageList = [imagesBase64];
        }

        const maxAttempts = DietAIEngine.retryDelaysMs.length + 1;
        const startedAt = Date.now();

        for (let attempt = 1; ; attempt++) {
            let failure;
            try {
                return await DietAIEngine.requestOnce(cleanUrl, imageList, contextText);
            } catch (error) {
                failure = error;
            }

            if (!failure.retryable || attempt >= maxAttempts) {
                failure.diag = DietAIEngine.describeFailure(failure, {
                    attempt, maxAttempts, startedAt, images: imageList.length, contextText
                });
                throw failure;
            }

            const delay = DietAIEngine.retryDelaysMs[attempt - 1] + Math.random() * DietAIEngine.retryJitterMs;
            const loadingText = document.getElementById('diet-loading-text');
            if (loadingText) {
                const label = RETRY_LABELS[failure.kind] || 'Błąd serwera.';
                loadingText.innerText = `${label} Ponawiam za ${Math.max(1, Math.round(delay / 1000))} s (próba ${attempt + 1}/${maxAttempts})...`;
            }
            await new Promise(r => setTimeout(r, delay));
        }
    },

    // Jedno zapytanie do workera. Rzuca błąd z polami: status, raw, model, retryable, kind.
    requestOnce: async (url, imageList, contextText) => {
        let response;
        try {
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    images: imageList,
                    imageBase64: imageList.length > 0 ? imageList[0] : null,
                    contextText: contextText
                })
            });
        } catch (error) {
            // Chrome: „Failed to fetch”, Safari: „Load failed” — każdy błąd samego fetch to problem z siecią.
            throw dietError(NETWORK_MSG, { retryable: true, kind: 'network', raw: String(error) });
        }

        let raw = '';
        try {
            raw = await response.text();
        } catch (e) {
            throw dietError(NETWORK_MSG, { status: response.status, retryable: true, kind: 'network', raw: String(e) });
        }
        const body = parseJsonLoose(raw);

        if (!response.ok) {
            throw classifyFailure(response.status, raw, body);
        }

        if (!body) {
            throw dietError(INVALID_MSG, { status: response.status, raw, retryable: true, kind: 'invalid' });
        }
        if (body.error) {
            throw classifyFailure(response.status, raw, body);
        }
        if (!body.food_name || typeof body.calories === 'undefined') {
            throw dietError(INCOMPLETE_MSG, { status: response.status, raw });
        }
        return body;
    },

    // Jednolinijkowy opis do Serwis → Logi błędów: bez zdjęć i bez treści opisu posiłku.
    describeFailure: (error, { attempt, maxAttempts, startedAt, images, contextText }) => {
        const parts = [`HTTP ${error.status || '—'}`];
        if (error.model) parts.push(`model ${error.model}`);
        parts.push(`próby ${attempt}/${maxAttempts}`);
        parts.push(`${((Date.now() - startedAt) / 1000).toFixed(1)} s`);
        parts.push(`zdjęć ${images}`);
        parts.push(`wariant ${VARIANT}`);
        if (error.raw) parts.push(`odp: "${safeSnippet(error.raw, contextText)}"`);
        return parts.join(' | ');
    }
};
