'use server';

import { createClient } from "@/utils/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key");

export async function publishNewsWithAI(newsId: string) {
    const supabase = await createClient();

    // 1. Fetch Draft News
    const { data: newsItem, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', newsId)
        .single();

    if (error || !newsItem) throw new Error("Haber bulunamadı");

    try {
        let newTitle = newsItem.title;
        let newSummary = newsItem.summary;
        let newContent = newsItem.content; // Usually empty/short for RSS

        // 2. Process with AI (If Key Exists)
        if (process.env.GEMINI_API_KEY) {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `
                Sen uzman bir finans editörüsün. Aşağıdaki haberi Türkiye'deki borsa yatırımcıları için profesyonel, merak uyandırıcı ve net bir dille yeniden yaz.
                
                Orijinal Başlık: ${newsItem.title}
                Orijinal İçerik/Özet: ${newsItem.content || newsItem.summary || newsItem.title}
                Kaynak: ${newsItem.source}

                Lütfen JSON formatında şunları döndür:
                {
                    "title": "Çarpıcı ve SEO uyumlu yeni başlık",
                    "summary": "1-2 cümlelik vurucu özet",
                    "content": "Haberin detaylandırılmış, okunaklı hali (HTML formatında, paragraf etiketleri kullan)"
                }
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Basic cleaning of JSON markdown if present
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const aiData = JSON.parse(cleanJson);

            newTitle = aiData.title;
            newSummary = aiData.summary;
            newContent = aiData.content;
        } else {
            // MOCK AI (If no key) - Clean version
            // Removing prefixes as per user request to look natural
            newTitle = newsItem.title; // Keep original title or add subtle improvement
            newSummary = newsItem.summary || '';
            newContent = newsItem.content || `<p>${newsItem.summary}</p>`;

            // Add a mock image if missing (random finance image)
            if (!newsItem.image_url) {
                // In real AI flow, we would generate one. Here we pick a random unsplash one.
                const randomId = Math.floor(Math.random() * 5) + 1;
                // Update database with image too
                await supabase.from('news').update({
                    image_url: `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop`
                }).eq('id', newsId);
            }
        }

        // 3. Update Database (Publish)
        const { error: updateError } = await supabase
            .from('news')
            .update({
                title: newTitle,
                summary: newSummary,
                content: newContent,
                status: 'published',
                published_at: new Date().toISOString()
            })
            .eq('id', newsId);

        if (updateError) throw updateError;

    } catch (e) {
        console.error("AI Publish Error:", e);
        throw new Error("Yapay zeka işlemi başarısız oldu.");
    }

    revalidatePath('/admin/news');
    revalidatePath('/haberler');
    return { success: true };
}
