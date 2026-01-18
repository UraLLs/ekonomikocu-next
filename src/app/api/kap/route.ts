import { NextResponse } from 'next/server';
import { getKapNews } from '@/services/marketService';

export async function GET() {
    try {
        const news = await getKapNews();
        return NextResponse.json({ success: true, data: news }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch news' }, { status: 500 });
    }
}
