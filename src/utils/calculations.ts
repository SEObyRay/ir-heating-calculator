import { Room, CalculationResult, PanelType, MountingType } from '../types/calculator';
import { haalStroomprijsOp } from '../services/energyPrices';

// Constants for heating calculations
const FIXED_WATTS_PER_CUBIC_METER = 60;  // Voor vaste panelen
const MOBILE_WATTS_PER_CUBIC_METER = 40; // Voor mobiele panelen
const MAX_MOBILE_VOLUME = 18;            // Maximum volume voor mobiele panelen in m³
const GEBRUIKSUREN_PER_DAG = 8;         // Gemiddeld aantal gebruiksuren per dag
const DAGEN_PER_MAAND = 30;

// Insulation factors (multipliers)
const INSULATION_FACTORS = {
  poor: 1.2,    // Slecht geïsoleerd (voor 1990)
  medium: 1.0,  // Gemiddeld geïsoleerd (1990-2010)
  good: 0.8     // Goed geïsoleerd (na 2010 of gerenoveerd)
};

// Mounting multipliers
const MOUNTING_MULTIPLIERS = {
  ceiling: 1.0,
  wall: 1.1,
  freeStanding: 1.2
};

export function calculateHeating(room: Room): CalculationResult {
  const volume = room.length * room.width * room.height;
  
  // Basis vermogen berekening (40-60W per m³)
  let basePower = volume * 50;

  // Aanpassingen op basis van isolatie
  const insulationMultiplier = INSULATION_FACTORS[room.insulation];

  // Aanpassingen op basis van montage
  const mountingMultiplier = MOUNTING_MULTIPLIERS[room.mountingType];

  const calculatedPower = basePower * insulationMultiplier * mountingMultiplier;

  // Rond het vermogen af naar boven op honderdtallen voor praktische paneel-selectie
  const recommendedPower = Math.ceil(calculatedPower / 100) * 100;

  // Verbruik en kosten berekeningen
  const stroomprijs = haalStroomprijsOp().prijs;
  const verbruikPerUur = recommendedPower / 1000; // conversie van W naar kW
  const kostenPerUur = verbruikPerUur * stroomprijs;
  const kostenPerDag = kostenPerUur * GEBRUIKSUREN_PER_DAG;
  const kostenPerMaand = kostenPerDag * DAGEN_PER_MAAND;

  // Genereer aanbevelingen
  const recommendations = generateRecommendations(
    recommendedPower,
    room.insulation,
    room.mountingType,
    kostenPerMaand
  );

  return {
    volume: Math.round(volume * 10) / 10,
    calculatedPower: Math.round(calculatedPower),
    recommendedPower,
    verbruikPerUur,
    kostenPerUur,
    kostenPerDag,
    kostenPerMaand,
    stroomprijs,
    recommendations
  };
}

const generateRecommendations = (
  power: number,
  insulation: string,
  mountingType: string,
  kostenPerMaand: number
): string[] => {
  const recommendations: string[] = [];

  // Paneel aanbevelingen
  if (power <= 1000) {
    recommendations.push(`Een ${power}W infrarood paneel zou voldoende moeten zijn.`);
  } else {
    const numberOfPanels = Math.ceil(power / 1000);
    recommendations.push(
      `We raden aan om ${numberOfPanels} panelen van 1000W te gebruiken voor optimale warmteverdeling.`
    );
  }

  // Isolatie aanbevelingen
  if (insulation === 'poor') {
    recommendations.push(
      'Overweeg om de isolatie te verbeteren. Dit kan uw energiekosten met tot wel 30% verlagen.'
    );
  }

  // Montage aanbevelingen
  if (mountingType === 'freeStanding') {
    recommendations.push(
      'Een plafond- of wandmontage is efficiënter dan vrijstaande panelen.'
    );
  }

  // Kosten advies
  recommendations.push(
    `De geschatte maandelijkse kosten zijn ${new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(kostenPerMaand)} bij ${GEBRUIKSUREN_PER_DAG} uur gebruik per dag.`
  );

  return recommendations;
};
