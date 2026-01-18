
import { getMarketIndices, getDailyMovers } from '@/services/marketService';
import MarketDashboard from './MarketDashboard';

export default async function DashboardLoader() {
    // Parallel fetch for dashboard data
    const [indices, movers] = await Promise.all([
        getMarketIndices(),
        getDailyMovers()
    ]);

    // Merge movers into the summary object
    const summary = {
        ...indices,
        movers
    };

    return <MarketDashboard summary={summary} />;
}
