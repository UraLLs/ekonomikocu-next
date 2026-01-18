
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;

// Debugging API Key loading (Safe logging)
if (!apiKey) {
    console.error("❌ CRITICAL: GOOGLE_API_KEY is undefined in process.env!");
} else {
    console.log(`✅ API Key detected. Length: ${apiKey.length}`);
    if (!apiKey.startsWith("AIza")) {
        console.warn("⚠️ WARNING: API Key does not start with 'AIza'. It might be invalid.");
    } else {
        console.log("✅ API Key format looks correct (starts with AIza).");
    }
}

// Initialize Gemini only if API key is present
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface AIAnalysisResult {
    summary: string;
    content: string; // Rewritten content in more engaging style
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export async function analyzeNewsWithGemini(title: string, originalContent: string): Promise<AIAnalysisResult> {
    if (!genAI) {
        console.warn("GOOGLE_API_KEY missing. Returning mock analysis.");
        return {
            summary: "AI analizi için API anahtarı bekleniyor.",
            content: originalContent,
            sentiment: 'NEUTRAL'
        };
    }

    // Models verified as available for this key
    const MODELS_TO_TRY = ["gemini-2.0-flash", "gemini-2.0-flash-001", "gemini-flash-latest", "gemini-pro-latest"];

    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`Attempting Gemini analysis with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `
            Sen uzman bir finans analisti ve ekonomi editörüsün. Aşağıdaki haberi analiz et ve JSON formatında yanıtla.
            
            Haber Başlığı: ${title}
            Haber İçeriği: ${originalContent}

            Görevler:
            1. Haberi "analist gözüyle" yeniden yaz. Okuyucuya doğrudan hitap et, sıkıcı finans dilinden uzaklaş ama profesyonelliği koru. (Markdown formatında olabilir)
            2. Haberin en önemli 3 noktasını madde madde özetle.
            3. Piyasaya etkisi açısından duygu durumunu belirle (POSITIVE, NEGATIVE, NEUTRAL).

            Yanıt Formatı (Sadece saf JSON döndür):
            {
              "summary": "Maddeli özet buraya",
              "content": "Yeniden yazılmış detaylı makale buraya",
              "sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL"
            }
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Clean up markdown code blocks if present to get pure JSON
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

            const data = JSON.parse(cleanJson);

            return {
                summary: data.summary || "Özet oluşturulamadı.",
                content: data.content || originalContent,
                sentiment: data.sentiment as 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' || 'NEUTRAL'
            };

        } catch (error: any) {
            console.warn(`Model ${modelName} failed:`, error.message);
            // Continue to next model
            if (modelName === MODELS_TO_TRY[MODELS_TO_TRY.length - 1]) {
                // All failed
                console.error("All Gemini models failed.");
                return {
                    summary: `⚠️ Analiz Başarısız: API Erişim Hatası.\n\nSebep: Kullandığınız API Anahtarı '${MODELS_TO_TRY.join(', ')}' modellerine erişemiyor.\n\nÇözüm: Lütfen https://aistudio.google.com/app/apikey adresinden "Get API Key" diyerek YENİ bir anahtar oluşturun ve .env.local dosyasına yapıştırın. (Eski anahtarınız Google Cloud Console'dan alınmış ve gerekli izinlere sahip olmayabilir).`,
                    content: originalContent,
                    sentiment: 'NEUTRAL'
                };
            }
        }
    }

    return {
        summary: "Beklenmeyen hata.",
        content: originalContent,
        sentiment: 'NEUTRAL'
    };
}
