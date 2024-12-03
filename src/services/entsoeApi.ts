interface EntsoePrice {
    time: string;
    price: number;  // Price in EUR/MWh
}

interface EntsoePriceResponse {
    success: boolean;
    prices: EntsoePrice[];
    error?: string;
}

// Netherlands EIC code (Energy Identification Code)
const NETHERLANDS_EIC = '10YNL----------L';

export async function getCurrentElectricityPrice(apiKey: string): Promise<EntsoePriceResponse> {
    try {
        const now = new Date();
        const periodStart = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago
        const periodEnd = new Date(now.getTime() + (24 * 60 * 60 * 1000));   // 24 hours ahead

        const url = `https://transparency.entsoe.eu/api?` +
            `documentType=A44&` +
            `in_Domain=${NETHERLANDS_EIC}&` +
            `out_Domain=${NETHERLANDS_EIC}&` +
            `periodStart=${formatDate(periodStart)}&` +
            `periodEnd=${formatDate(periodEnd)}&` +
            `securityToken=${apiKey}`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`ENTSO-E API error: ${response.statusText}`);
        }

        const xmlText = await response.text();
        const prices = parseEntsoeXml(xmlText);

        // Find the current price
        const currentHour = now.getHours();
        const currentPrice = prices.find(p => {
            const priceDate = new Date(p.time);
            return priceDate.getHours() === currentHour;
        });

        if (!currentPrice) {
            throw new Error('No price data available for current hour');
        }

        // Convert from EUR/MWh to EUR/kWh and add taxes and transport costs
        // Average Dutch taxes and transport costs are around 0.15 EUR/kWh
        const priceInKwh = (currentPrice.price / 1000) + 0.15;

        return {
            success: true,
            prices: [{
                time: new Date().toISOString(),
                price: priceInKwh
            }]
        };

    } catch (error) {
        console.error('Error fetching electricity price:', error);
        return {
            success: false,
            prices: [],
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

function formatDate(date: Date): string {
    // Format date as YYYYMMDDHHMM
    return date.getFullYear().toString() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0') +
        String(date.getHours()).padStart(2, '0') +
        String(date.getMinutes()).padStart(2, '0');
}

function parseEntsoeXml(xmlText: string): EntsoePrice[] {
    // Simple XML parsing using string operations (in production, use proper XML parser)
    const prices: EntsoePrice[] = [];
    const pricePoints = xmlText.match(/<Point>.*?<\/Point>/g) || [];

    pricePoints.forEach(point => {
        const position = point.match(/<position>(.*?)<\/position>/)?.[1];
        const priceAmount = point.match(/<price.amount>(.*?)<\/price.amount>/)?.[1];

        if (position && priceAmount) {
            const time = new Date();
            time.setHours(parseInt(position) - 1);
            time.setMinutes(0);
            time.setSeconds(0);
            time.setMilliseconds(0);

            prices.push({
                time: time.toISOString(),
                price: parseFloat(priceAmount)
            });
        }
    });

    return prices;
}
