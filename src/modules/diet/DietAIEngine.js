export const DietAIEngine = {
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

        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            attempts++;
            try {
                const response = await fetch(cleanUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        images: imagesBase64, 
                        imageBase64: imagesBase64 && imagesBase64.length > 0 ? imagesBase64[0] : null,
                        contextText: contextText 
                    })
                });

                if (!response.ok) {
                    const errorDataRaw = await response.text();
                    
                    if (errorDataRaw.includes("exceeded your current quota") || errorDataRaw.includes("Quota exceeded")) {
                        throw new Error("Darmowy limit zapytań AI został wyczerpany na dziś. Wróć i spróbuj ponownie jutro!");
                    }
                    if (errorDataRaw.includes("high demand") || response.status === 503 || response.status === 528) {
                        throw new Error("high_demand"); // Special error to trigger retry
                    }
                    
                    let errorData;
                    try {
                        errorData = JSON.parse(errorDataRaw);
                    } catch(e) {
                        throw new Error(errorDataRaw || "Wystąpił nieznany błąd podczas analizy obrazu przez serwer.");
                    }
                    const errStr = errorData.error || "";
                    if (errStr.includes("exceeded your current quota") || errStr.includes("Quota exceeded")) {
                        throw new Error("Darmowy limit zapytań AI został wyczerpany na dziś. Wróć i spróbuj ponownie jutro!");
                    }
                    if (errStr.includes("high demand")) {
                        throw new Error("high_demand");
                    }
                    
                    throw new Error(errStr || "Wystąpił błąd podczas analizy obrazu przez serwer.");
                }

                const data = await response.json();
                
                if (data.error) {
                    if (data.error.includes("exceeded your current quota") || data.error.includes("Quota exceeded")) {
                        throw new Error("Darmowy limit zapytań AI został wyczerpany na dziś. Wróć i spróbuj ponownie jutro!");
                    }
                    if (data.error.includes("high demand")) {
                        throw new Error("high_demand");
                    }
                    throw new Error(data.error);
                }
                
                // Weryfikacja czy serwer zwrócił poprawne dane JSON
                if (!data.food_name || typeof data.calories === 'undefined') {
                    throw new Error("Serwer AI zwrócił niepełne dane. Spróbuj zrobić wyraźniejsze zdjęcie.");
                }

                return data;
            } catch (error) {
                const isNetworkError = error.name === 'TypeError' && error.message.includes('fetch');
                const isHighDemand = error.message === 'high_demand' || error.message.includes('high demand');
                
                if ((isNetworkError || isHighDemand) && attempts < maxAttempts) {
                    // Update UI if possible to show retry
                    const loadingText = document.getElementById('diet-loading-text');
                    if (loadingText) loadingText.innerText = `Przeciążenie API. Ponawiam próbę (${attempts}/${maxAttempts})...`;
                    
                    await new Promise(r => setTimeout(r, 2500)); // wait 2.5s before retry
                    continue; // Retry
                }
                
                if (error.message === 'high_demand') {
                    throw new Error("Google API jest obecnie przeciążone. Spróbuj ponownie za chwilę.");
                }
                
                if (isNetworkError) {
                    throw new Error("Brak połączenia z internetem lub serwer jest nieosiągalny.");
                }
                
                throw error;
            }
        }
        
        throw new Error("Nie udało się przeanalizować zdjęcia. Spróbuj ponownie.");
    }
};
