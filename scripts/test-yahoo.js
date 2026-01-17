
// scripts/test-yahoo.js
const yahooFinance = require('yahoo-finance2').default; // Try this common pattern for CJS/ESM interop

async function test() {
    try {
        console.log('Testing Yahoo Finance...');
        console.log('Type of yahooFinance:', typeof yahooFinance);

        if (!yahooFinance) {
            console.error('YahooFinance is undefined!');
            // Try require without default
            const yf2 = require('yahoo-finance2');
            console.log('Type of require("yahoo-finance2"):', typeof yf2);
            if (yf2.quote) {
                console.log('Found quote in root export!');
                const quote = await yf2.quote('THYAO.IS');
                console.log('Quote result:', quote);
                return;
            }
        }

        const quote = await yahooFinance.quote('THYAO.IS');
        console.log('Quote result:', quote);
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
