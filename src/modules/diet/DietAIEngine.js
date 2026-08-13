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
                const errorData = await response.json();
                throw new Error(errorData.error || "Wystąpił błąd podczas analizy obrazu przez serwer.");
            }

            const data = await response.json();
            
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
