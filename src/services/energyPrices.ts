// Huidige stroomprijs volgens ANWB (28 cent per kWh)
const CURRENT_ELECTRICITY_PRICE = 0.28;

export const getCurrentElectricityPrice = (): number => {
  return CURRENT_ELECTRICITY_PRICE;
};

// Fallback prijs in geval van fouten
const FALLBACK_ELECTRICITY_PRICE = 0.30;

export const getFallbackElectricityPrice = (): number => {
  return FALLBACK_ELECTRICITY_PRICE;
};

interface StroomprijsData {
    prijs: number;
    laatstBijgewerkt: Date;
}

// Functie om de huidige Nederlandse stroomprijs te krijgen (ANWB prijspeil)
export function haalStroomprijsOp(): StroomprijsData {
    // Huidige ANWB prijspeil voor stroom
    // Bron: https://www.anwb.nl/energie/wat-kost-1-kwh
    const anwbPrijs = getCurrentElectricityPrice(); // Gebruik de getCurrentElectricityPrice functie
    
    return {
        prijs: anwbPrijs,
        laatstBijgewerkt: new Date()
    };
}

// Mock data voor development
export function getMockStroomprijsData(): StroomprijsData {
    return haalStroomprijsOp(); // Gebruik dezelfde prijs als de hoofdfunctie
}
