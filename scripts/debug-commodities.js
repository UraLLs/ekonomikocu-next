
const YahooFinance = require('yahoo-finance2').default; // Use the class constructor

const yahooFinance = new YahooFinance({
    suppressNotices: ['yahooSurvey']
});

async function testCommodities() {
    // Test the symbols used in the service
    const symbols = ['GC=F', 'BZ=F', 'XU100.IS'];

    console.log('--- Testing Commodities Data ---');
    for (const s of symbols) {
        try {
            const quote = await yahooFinance.quote(s);
            console.log(`${s}: Price=${quote.regularMarketPrice}, Name=${quote.shortName || quote.longName}`);
        } catch (e) {
            console.log(`${s}: ERROR - ${e.message}`);
        }
    }
}

testCommodities();
