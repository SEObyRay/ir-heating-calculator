import { getCurrentElectricityPrice } from './entsoeApi';

// Fallback prijs in geval van fouten
const FALLBACK_ELECTRICITY_PRICE = 0.34; // Updated fallback price

interface StroomprijsData {
    prijs: number;
    laatstBijgewerkt: Date;
}

// Cache voor de stroomprijs
let cachedPrice: StroomprijsData | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Functie om de huidige Nederlandse stroomprijs te krijgen via ENTSO-E
export async function haalStroomprijsOp(): Promise<StroomprijsData> {
    try {
        // Check cache first
        if (cachedPrice && (new Date().getTime() - cachedPrice.laatstBijgewerkt.getTime()) < CACHE_DURATION) {
            return cachedPrice;
        }

        // Get API key from environment variable
        const apiKey = process.env.NEXT_PUBLIC_ENTSOE_API_KEY;
        
        if (!apiKey) {
            throw new Error('ENTSO-E API key not found');
        }

        const result = await getCurrentElectricityPrice(apiKey);

        if (!result.success || result.prices.length === 0) {
            throw new Error(result.error || 'No price data available');
        }

        const currentPrice = result.prices[0];
        
        cachedPrice = {
            prijs: currentPrice.price,
            laatstBijgewerkt: new Date(currentPrice.time)
        };

        return cachedPrice;

    } catch (error) {
        console.error('Error fetching electricity price:', error);
        
        // Return fallback price in case of error
        return {
            prijs: FALLBACK_ELECTRICITY_PRICE,
            laatstBijgewerkt: new Date()
        };
    }
}

// Synchrone versie voor componenten die geen async kunnen gebruiken
export function haalStroomprijsOpSync(): StroomprijsData {
    if (cachedPrice && (new Date().getTime() - cachedPrice.laatstBijgewerkt.getTime()) < CACHE_DURATION) {
        return cachedPrice;
    }

    return {
        prijs: FALLBACK_ELECTRICITY_PRICE,
        laatstBijgewerkt: new Date()
    };
}

// Mock data voor development
export function getMockStroomprijsData(): StroomprijsData {
    return haalStroomprijsOpSync(); // Gebruik dezelfde prijs als de hoofdfunctie
}
