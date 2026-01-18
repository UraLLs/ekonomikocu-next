export interface IPO {
    id: string;
    companyName: string;
    code: string;
    logoColor: string; // Placeholder for logo background color
    price: string;
    date: string;
    status: 'active' | 'upcoming' | 'completed';
    shares: string;
}

export const IPOS: IPO[] = [
    {
        id: '1',
        companyName: 'BinBin',
        code: 'BINBN',
        logoColor: 'bg-blue-600',
        price: '91.85 ₺',
        date: '3-4 Ekim',
        status: 'active',
        shares: '17 Milyon Lot'
    },
    {
        id: '2',
        companyName: 'Akfen Yenilenebilir',
        code: 'AKFEN',
        logoColor: 'bg-green-600',
        price: '9.80 ₺',
        date: 'Yakında',
        status: 'upcoming',
        shares: '340 Milyon Lot'
    },
    {
        id: '3',
        companyName: 'Gıpta Ofis',
        code: 'GIPTA',
        logoColor: 'bg-red-600',
        price: '20.90 ₺',
        date: 'Talep Toplanıyor',
        status: 'active',
        shares: '40 Milyon Lot'
    },
    {
        id: '4',
        companyName: 'Reeder Teknoloji',
        code: 'REEDR',
        logoColor: 'bg-indigo-600',
        price: '9.30 ₺',
        date: 'Tamamlandı',
        status: 'completed',
        shares: '215 Milyon Lot'
    },
    {
        id: '5',
        companyName: 'Tarkim Bitki',
        code: 'TARKM',
        logoColor: 'bg-orange-600',
        price: '107.50 ₺',
        date: 'Onay Bekliyor',
        status: 'upcoming',
        shares: '5 Milyon Lot'
    }
];
