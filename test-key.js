
const fs = require('fs');
const path = require('path');

// 1. .env.local dosyasından anahtarı oku
let apiKey = "";
try {
    const envPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        for (const line of lines) {
            if (line.trim().startsWith('GOOGLE_API_KEY=')) {
                apiKey = line.split('=')[1].trim();
                break;
            }
        }
    }
} catch (e) {
    console.error("❌ .env.local dosyası okunamadı:", e.message);
}

if (!apiKey) {
    console.error("❌ HATA: .env.local dosyasında GOOGLE_API_KEY bulunamadı!");
    process.exit(1);
}

// 2. Doğrudan HTTP isteği ile modelleri listele (SDK'sız)
async function checkModelsRaw() {
    console.log(`🔑 Anahtar Kontrol Ediliyor (Raw HTTP): ${apiKey.substring(0, 5)}...`);

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status !== 200) {
            console.error("❌ API Hatası:", data);
            return;
        }

        if (!data.models || data.models.length === 0) {
            console.log("⚠️ API Başarılı ama HİÇ MODEL DÖNMEDİ. Bu çok garip.");
            return;
        }

        console.log("\n✅ API ERİŞİMİ BAŞARILI! İşte kullanılabilir modeller:");
        data.models.forEach(m => {
            // Sadece generateContent destekleyenleri göster
            if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`   - ${m.name.replace('models/', '')}`);
            }
        });

        console.log("\n💡 Sitede bu listedeki isimlerden birini kullanmalıyız.");

    } catch (error) {
        console.error("❌ Ağ Hatası:", error.message);
    }
}

checkModelsRaw();
