
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

    // Current available models from API (Jan 2026)
    const MODELS_TO_TRY = ["gemini-2.5-flash", "gemini-2.5-pro"];

    for (const modelName of MODELS_TO_TRY) {
        // Exponential backoff retry logic for 429 (Rate Limit)
        let attempts = 0;
        const maxAttempts = 3;
        const baseDelay = 5000; // Start with 5 seconds

        while (attempts < maxAttempts) {
            try {
                console.log(`Attempting Gemini analysis with model: ${modelName} (Attempt ${attempts + 1})`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `Sen deneyimli bir finans gazetecisi ve piyasa analistisin. Verilen haberi analiz et ve JSON formatında yanıtla.

HABER BAŞLIĞI: ${title}
HABER İÇERİĞİ: ${originalContent}

## KRİTİK KURAL - BİLGİ UYDURMAMA:
- SADECE yukarıda verilen içerikteki bilgileri kullan
- Tarih, saat, rakam, isim veya detay UYDURMAA
- İçerikte olmayan bilgiyi EKLEMEe
- Emin olmadığın bilgiyi yazmaa

## GÖREVLER:

### 1. ÖZET (summary)
Haberin en kritik 3 noktasını özetle. Her madde "- " ile başlamalı.
Örnek format:
- Birinci önemli nokta
- İkinci önemli nokta  
- Üçüncü önemli nokta

### 2. DETAYLI İÇERİK (content)
İçeriği profesyonel bir finans makalesi olarak yeniden yaz. Markdown formatı kullan.

KURALLAR:
- "Sevgili okuyucular" gibi hitaplarla BAŞLAMA, direkt konuya gir
- Sadece verilen bilgileri kullan
- En az 2-3 paragraf yaz
- Rakamları ve tarihleri içerikten olduğu gibi al
- Piyasaya etkisini değerlendir
- **Önemli terimleri** kalın yap

### 3. DUYGU ANALİZİ (sentiment)
Haberin piyasaya etkisi: POSITIVE, NEGATIVE veya NEUTRAL

## YANIT FORMATI (Sadece JSON):
{
  "summary": "- İlk kritik nokta\\n- İkinci kritik nokta\\n- Üçüncü kritik nokta",
  "content": "Markdown formatında detaylı makale içeriği...",
  "sentiment": "POSITIVE"
}`;


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

            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                const errorStatus = (error as { status?: number }).status;

                if (errorMessage?.includes('429') || errorStatus === 429) {
                    const delay = baseDelay * Math.pow(2, attempts); // 5s, 10s, 20s
                    console.warn(`Rate limit on ${modelName}, waiting ${delay / 1000}s before retry...`);
                    await new Promise(res => setTimeout(res, delay));
                    attempts++;
                    continue;
                }

                console.warn(`Model ${modelName} failed:`, errorMessage);
                break; // Non-429 error, try next model
            }
        }
    }

    // All models failed - return a user-friendly fallback
    console.error("All Gemini models exhausted due to rate limits.");
    return {
        summary: `- ${title}\n- Bu haber yapay zeka tarafından analiz edilemedi (yoğunluk nedeniyle). Lütfen daha sonra tekrar deneyin.`,
        content: `## ${title}\n\n${originalContent}\n\n---\n\n*Bu haber şu anda yapay zeka ile işlenemedi. Orijinal içerik yukarıda gösterilmektedir.*`,
        sentiment: 'NEUTRAL'
    };
}

// BATCH TRANSLATION Logic
export async function translateBatch(texts: string[]): Promise<string[]> {
    if (!genAI || texts.length === 0) return texts;

    // Current available models
    const MODELS_TO_TRY = ["gemini-2.5-flash", "gemini-2.5-pro"];

    for (const modelName of MODELS_TO_TRY) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `
            Task: Translate the following English news headlines to Turkish.
            Style: Professional financial turkish news style. Short and punchy.
            Input:
            ${JSON.stringify(texts)}
            
            Output: Return ONLY a JSON array of strings. ["Translated 1", "Translated 2", ...]
            `;

            // Simple retry logic for 429
            let attempts = 0;
            while (attempts < 2) {
                try {
                    const result = await model.generateContent(prompt);
                    const responseText = result.response.text();
                    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                    const translated = JSON.parse(cleanJson);

                    if (Array.isArray(translated) && translated.length === texts.length) {
                        return translated;
                    }
                    break; // If parse successful but validation failed, break to next model
                } catch (reqError: any) {
                    if (reqError.message?.includes('429') || reqError.status === 429) {
                        console.warn(`Rate limit on ${modelName}, retrying in 2s...`);
                        await new Promise(res => setTimeout(res, 2000));
                        attempts++;
                    } else {
                        throw reqError; // Next model
                    }
                }
            }
        } catch (e) {
            console.warn(`Translation failed with ${modelName}:`, e);
        }
    }

    return texts; // Fallback to original
}

// SMART NEWS: Extract Tickers from Headlines
export async function extractTickers(headlines: { title: string, id: string }[]): Promise<Record<string, string>> {
    if (!genAI || headlines.length === 0) return {};

    // Current available models
    const MODELS_TO_TRY = ["gemini-2.5-flash", "gemini-2.5-pro"];

    for (const modelName of MODELS_TO_TRY) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `
            Analyze these financial news headlines and identify the primary stock ticker symbol (BIST/Crypto/Forex) associated with them.
            Focus on BIST (Istanbul Stock Exchange) companies.
            
            Headlines:
            ${JSON.stringify(headlines)}

            Rules:
            1. Return a JSON object where Key = Headline ID, Value = Ticker Symbol (e.g. "THYAO", "BTC", "USD", "GARAN").
            2. If no clear ticker, use null.
            3. Strict JSON output only.
            
            Example Output:
            { "id1": "THYAO", "id2": "BTC", "id3": null }
            `;

            const result = await model.generateContent(prompt);
            const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text);

        } catch (e) {
            console.warn(`Ticker extraction failed with ${modelName}:`, e);
            // Try next model
        }
    }
    return {};
}
