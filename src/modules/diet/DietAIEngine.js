export const DietAIEngine = {
    analyzeImage: async (imagesBase64, contextText) => {
        // Z LocalStorage pobieramy URL do naszego Workera Cloudflare (lub używamy domyślnego dla wszystkich klientów)
        const workerUrl = localStorage.getItem('dietWorkerUrl') || 'https://uki-dieta.lukasz-dudzinski.workers.dev';
        
        if (!workerUrl) {
            throw new Error("Brak skonfigurowanego adresu serwera (Workera Cloudflare) w Ustawieniach!");
        }

        // Upewniamy się, że URL jest poprawny
        let cleanUrl = workerUrl.trim();
        if (!cleanUrl.startsWith('http')) {
            cleanUrl = 'https://' + cleanUrl;
        }

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
                if (errorDataRaw.includes("exceeded your current quota") || errorDataRaw.includes("Quota exceeded") || response.status === 429) {
                    throw new Error("Darmowy limit zapytań AI został wyczerpany na dziś. Wróć i spróbuj ponownie jutro!");
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
                throw new Error(errStr || "Wystąpił błąd podczas analizy obrazu przez serwer.");
            }

            const data = await response.json();
            
            if (data.error) {
                if (data.error.includes("exceeded your current quota") || data.error.includes("Quota exceeded")) {
                    throw new Error("Darmowy limit zapytań AI został wyczerpany na dziś. Wróć i spróbuj ponownie jutro!");
                }
                throw new Error(data.error);
            }
            
            // Weryfikacja czy serwer zwrócił poprawne dane JSON
            if (!data.food_name || typeof data.calories === 'undefined') {
                throw new Error("Serwer AI zwrócił niepełne dane. Spróbuj zrobić wyraźniejsze zdjęcie.");
            }

            return data;
        } catch (error) {
            console.error("DietAIEngine Error:", error);
            throw error;
        }
    }
};
