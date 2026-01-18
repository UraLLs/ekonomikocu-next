export interface Course {
    id: string;
    slug: string;
    title: string;
    thumbnail: string;
    category: 'Teknik Analiz' | 'Temel Analiz' | 'Kripto' | 'Psikoloji' | 'Genel';
    level: 'Başlangıç' | 'Orta' | 'İleri';
    duration: string;
    videoUrl: string; // Youtube Embed URL or ID
    description: string;
    instructor: string;
    rating: number;
    students: number;
}

export const CATEGORIES = ['Tümü', 'Teknik Analiz', 'Temel Analiz', 'Kripto', 'Psikoloji', 'Genel'];

export const COURSES: Course[] = [
    {
        id: '1',
        slug: 'teknik-analiz-101',
        title: 'Sıfırdan Zirveye Teknik Analiz Eğitimi',
        thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&fit=crop',
        category: 'Teknik Analiz',
        level: 'Başlangıç',
        duration: '4 Saat 20 Dk',
        videoUrl: 'https://www.youtube.com/embed/93H8A_b_qG4', // Example ID
        description: 'Borsa ve kripto para piyasalarında grafik okumayı, destek-direnç çizmeyi ve trendleri yorumlamayı öğrenin. Bu eğitim seti ile kendi analizlerinizi yapabilecek seviyeye geleceksiniz.',
        instructor: 'Mert Yılmaz',
        rating: 4.8,
        students: 12500
    },
    {
        id: '2',
        slug: 'temel-analiz-bilanco',
        title: 'Bilanço Okuma ve Temel Analiz',
        thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&fit=crop',
        category: 'Temel Analiz',
        level: 'Orta',
        duration: '2 Saat 15 Dk',
        videoUrl: 'https://www.youtube.com/embed/Q4X9tO7G_Z8',
        description: 'Şirket değerlemesi nasıl yapılır? F/K ve PD/DD oranları ne ifade eder? Doğru hisse seçimi için finansal okuryazarlık eğitimi.',
        instructor: 'Dr. Finans',
        rating: 4.9,
        students: 8300
    },
    {
        id: '3',
        slug: 'bitcoin-blockchain-temelleri',
        title: 'Bitcoin ve Blockchain Teknolojisi',
        thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&fit=crop',
        category: 'Kripto',
        level: 'Başlangıç',
        duration: '1 Saat 50 Dk',
        videoUrl: 'https://www.youtube.com/embed/Gc2en3nHxA4',
        description: 'Blokzincir nedir? Bitcoin nasıl çalışır? Soğuk cüzdan güvenliği ve altcoin sepeti yapma stratejileri.',
        instructor: 'Satoshi Nakamoto (Temsili)',
        rating: 4.7,
        students: 21000
    },
    {
        id: '4',
        slug: 'yatirimci-psikolojisi',
        title: 'Borsada Yatırımcı Psikolojisi ve Disiplin',
        thumbnail: 'https://images.unsplash.com/photo-1621508654686-809f23efdabc?w=800&fit=crop',
        category: 'Psikoloji',
        level: 'İleri',
        duration: '3 Saat',
        videoUrl: 'https://www.youtube.com/embed/rV5pL8g7G_M',
        description: 'FOMO ile başa çıkmak, panik satışlarını önlemek ve duygusuz işlem yapma sanatı. Başarılı traderların zihin yapısı.',
        instructor: 'Davranışsal Finans Uzmanı',
        rating: 4.95,
        students: 5400
    },
    {
        id: '5',
        slug: 'price-action-trader',
        title: 'Price Action: Fiyat Hareketleri ile Trade',
        thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&fit=crop',
        category: 'Teknik Analiz',
        level: 'İleri',
        duration: '5 Saat 30 Dk',
        videoUrl: 'https://www.youtube.com/embed/X9J8f-J9z_0',
        description: 'İndikatörsüz trade mümkün mü? Mum formasyonları, likidite bölgeleri ve order block yapıları ile profesyonel trade stratejileri.',
        instructor: 'Pro Trader',
        rating: 4.6,
        students: 9200
    }
];
