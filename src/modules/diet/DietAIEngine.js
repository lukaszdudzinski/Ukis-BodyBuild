export const DietAIEngine = {
    analyzeImage: async (base64Image) => {
        // Z LocalStorage pobieramy URL do naszego Workera Cloudflare
        const workerUrl = localStorage.getItem('dietWorkerUrl');
        
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
                body: JSON.stringify({ imageBase64: base64Image })
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
