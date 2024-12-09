'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Tooltip } from 'react-tooltip';
import { useStroomprijs } from '../context/StroomprijsContext';
import CalculatorFAQ from './CalculatorFAQ';
import ErrorBoundary from './ErrorBoundary';

const PrijsDisplay = dynamic(() => import('./PrijsDisplay'), {
  ssr: false,
});

// Standaard waarden voor een gemiddeld Nederlands huishouden
const DEFAULTS = {
  OPPERVLAKTE: 45, // m² (gemiddelde woonkamer)
  HOOGTE: 2.6,     // m (standaard plafondhoogte)
  ISOLATIE: 'matig' as 'goed' | 'matig' | 'slecht', // Meeste huizen hebben gemiddelde isolatie
  VERWARMINGSTYPE: 'volledig' as 'volledig' | 'plaatselijk',
  AFSTAND_TOT_PANEEL: 1.5, // m (optimale afstand voor plaatselijke verwarming)
  UREN_PER_DAG: 8,  // Gemiddeld gebruik per dag
};

export default function Calculator() {
  const { stroomprijs, laatstBijgewerkt } = useStroomprijs();
  const [verwarmingsType, setVerwarmingsType] = useState<'volledig' | 'plaatselijk'>(DEFAULTS.VERWARMINGSTYPE);
  const [oppervlakte, setOppervlakte] = useState<number>(DEFAULTS.OPPERVLAKTE);
  const [hoogte, setHoogte] = useState<number>(DEFAULTS.HOOGTE);
  const [isolatie, setIsolatie] = useState<'goed' | 'matig' | 'slecht'>(DEFAULTS.ISOLATIE);
  const [urenPerDag, setUrenPerDag] = useState<number>(DEFAULTS.UREN_PER_DAG);
  const [afstandTotPaneel, setAfstandTotPaneel] = useState<number>(DEFAULTS.AFSTAND_TOT_PANEEL);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const berekenVerwarming = () => {
    // Basis berekeningen
    const volume = oppervlakte * hoogte;
    
    // Bepaal wattage per m² gebaseerd op isolatie
    let wattagePerM2;
    switch (isolatie) {
      case 'slecht':
        wattagePerM2 = 125; // Meer wattage nodig voor slechte isolatie (voor 1990)
        break;
      case 'matig':
        wattagePerM2 = 100; // Gemiddeld wattage voor normale isolatie (1990-2010)
        break;
      case 'goed':
        wattagePerM2 = 75;  // Minder wattage nodig voor goede isolatie (na 2010)
        break;
      default:
        wattagePerM2 = 100;
    }

    // Bereken totaal benodigd wattage
    let totaalWattage;
    if (verwarmingsType === 'volledig') {
      totaalWattage = oppervlakte * wattagePerM2;
    } else {
      // Voor plaatselijke verwarming, gebruik een kleiner gebied
      const effectiefOppervlak = Math.min(oppervlakte, 10); // Maximaal 10m² voor plaatselijke verwarming
      totaalWattage = effectiefOppervlak * wattagePerM2;
    }

    // Bereken kosten
    const kostenPerUur = (totaalWattage / 1000) * stroomprijs; // kW * prijs/kWh
    const kostenPerDag = kostenPerUur * urenPerDag;
    const kostenPerMaand = kostenPerDag * 30; // Geschatte maandelijkse kosten

    // Bereken aantal panelen (uitgaande van gemiddeld 600W per paneel)
    const aantalPanelen = Math.ceil(totaalWattage / 600);

    // Genereer isolatie-specifieke aanbevelingen
    let isolatieAdvies;
    switch (isolatie) {
      case 'slecht':
        isolatieAdvies = 'Overweeg eerst de isolatie te verbeteren voor een efficiënter systeem. Dit kan de benodigde capaciteit met wel 40% verminderen.';
        break;
      case 'matig':
        isolatieAdvies = 'De isolatie is voldoende voor infraroodverwarming, maar verbeteringen kunnen het systeem nog efficiënter maken.';
        break;
      case 'goed':
        isolatieAdvies = 'De goede isolatie zorgt voor een optimale efficiëntie van het infrarood verwarmingssysteem.';
        break;
      default:
        isolatieAdvies = '';
    }

    // Genereer aanbevelingen
    const aanbevolenPanelen = [
      `Aanbevolen configuratie: ${aantalPanelen}x 600W panelen`,
      verwarmingsType === 'volledig' 
        ? 'Verdeel de panelen gelijkmatig over de ruimte voor optimale warmteverdeling'
        : 'Plaats het paneel direct boven het te verwarmen gebied',
      isolatieAdvies
    ].filter(Boolean); // Verwijder lege strings

    setResult({
      volume,
      totaalWattage,
      aantalPanelen,
      kostenPerUur,
      kostenPerDag,
      kostenPerMaand,
      aanbevolenPanelen,
      wattagePerM2
    });
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
        Vermogen infrarood verwarming berekenen
      </h1>
      <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        Bereken snel en eenvoudig het benodigde vermogen voor uw infrarood verwarming en krijg direct inzicht in de kosten.
      </p>
      <div className="calculator-form max-w-4xl mx-auto p-8 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="verwarmingsType" className="block text-sm font-medium text-gray-700 mb-2">
              Type verwarming
            </label>
            <select
              id="verwarmingsType"
              value={verwarmingsType}
              onChange={(e) => setVerwarmingsType(e.target.value as 'volledig' | 'plaatselijk')}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              data-tooltip-id="calc-tooltip"
              data-tooltip-content="Kies 'volledig' voor het verwarmen van de hele ruimte, of 'plaatselijk' voor het verwarmen van een specifiek gebied"
            >
              <option value="volledig">Volledige ruimte verwarmen</option>
              <option value="plaatselijk">Plaatselijke verwarming</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="oppervlakte" className="block text-sm font-medium text-gray-700 mb-2">
              Oppervlakte (m²)
            </label>
            <input
              id="oppervlakte"
              type="number"
              value={oppervlakte}
              onChange={(e) => setOppervlakte(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              data-tooltip-id="calc-tooltip"
              data-tooltip-content="Voer de oppervlakte van de te verwarmen ruimte in vierkante meters in"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hoogte" className="block text-sm font-medium text-gray-700 mb-2">
              Hoogte (m)
            </label>
            <input
              id="hoogte"
              type="number"
              value={hoogte}
              onChange={(e) => setHoogte(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              data-tooltip-id="calc-tooltip"
              data-tooltip-content="Voer de hoogte van het plafond in meters in. Dit beïnvloedt de efficiëntie van de infrarood verwarming"
            />
          </div>

          <div className="form-group">
            <label htmlFor="isolatie" className="block text-sm font-medium text-gray-700 mb-2">
              Isolatie
            </label>
            <select
              id="isolatie"
              value={isolatie}
              onChange={(e) => setIsolatie(e.target.value as 'goed' | 'matig' | 'slecht')}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              data-tooltip-id="calc-tooltip"
              data-tooltip-content="Selecteer de isolatiewaarde van uw ruimte. Goede isolatie (na 2010), matige isolatie (1990-2010), of slechte isolatie (voor 1990)"
            >
              <option value="goed">Goed (na 2010)</option>
              <option value="matig">Matig (1990-2010)</option>
              <option value="slecht">Slecht (voor 1990)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="urenPerDag" className="block text-sm font-medium text-gray-700 mb-2">
              Gebruiksuren per dag
            </label>
            <input
              id="urenPerDag"
              type="number"
              value={urenPerDag}
              onChange={(e) => setUrenPerDag(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              data-tooltip-id="calc-tooltip"
              data-tooltip-content="Voer het aantal uren in dat de verwarming per dag gebruikt zal worden. Dit is belangrijk voor de kostenberekening"
            />
          </div>

          {verwarmingsType === 'plaatselijk' && (
            <div className="form-group">
              <label htmlFor="afstandTotPaneel" className="block text-sm font-medium text-gray-700 mb-2">
                Afstand tot paneel (m)
              </label>
              <input
                id="afstandTotPaneel"
                type="number"
                value={afstandTotPaneel}
                onChange={(e) => setAfstandTotPaneel(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                data-tooltip-id="calc-tooltip"
                data-tooltip-content="De afstand tussen het infrarood paneel en het te verwarmen oppervlak. Optimale afstand is meestal tussen 1.5 en 2.5 meter"
              />
            </div>
          )}
        </div>

        <button
          onClick={berekenVerwarming}
          className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          data-tooltip-id="calc-tooltip"
          data-tooltip-content="Bereken het benodigde vermogen en de verwachte kosten voor uw infrarood verwarming"
        >
          Bereken
        </button>

        <Tooltip id="calc-tooltip" place="top" className="z-50 !bg-gray-900/90 !px-4 !py-2 !rounded-lg !text-sm" />

        {result && (
          <div className="mt-8 p-6 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Berekend vermogen infrarood verwarming</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-white/80 rounded-xl">
                  <p className="text-sm text-gray-500">Volume van de ruimte</p>
                  <p className="text-2xl font-semibold text-gray-800">{result.volume.toFixed(1)} m³</p>
                </div>
                <div className="p-4 bg-white/80 rounded-xl">
                  <p className="text-sm text-gray-500">Benodigd vermogen</p>
                  <p className="text-2xl font-semibold text-gray-800">{result.totaalWattage.toFixed(0)}W</p>
                </div>
                <div className="p-4 bg-white/80 rounded-xl">
                  <p className="text-sm text-gray-500">Geschat aantal panelen</p>
                  <p className="text-2xl font-semibold text-gray-800">{result.aantalPanelen}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/80 rounded-xl">
                  <p className="text-sm text-gray-500">Stroomkosten per uur</p>
                  <p className="text-2xl font-semibold text-gray-800">€{result.kostenPerUur.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-white/80 rounded-xl">
                  <p className="text-sm text-gray-500">Stroomkosten per dag</p>
                  <p className="text-2xl font-semibold text-gray-800">€{result.kostenPerDag.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-white/80 rounded-xl">
                  <p className="text-sm text-gray-500">Geschatte stroomkosten per maand</p>
                  <p className="text-2xl font-semibold text-gray-800">€{result.kostenPerMaand.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50/80 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-3">Advies</h4>
              <div className="space-y-2">
                {result.aanbevolenPanelen.map((advies, index) => (
                  <p key={index} className={`text-blue-800 ${index === 0 ? "font-medium" : ""}`}>{advies}</p>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              * Berekend met huidige stroomprijs van €{stroomprijs.toFixed(2)}/kWh
              <br />
              Laatst bijgewerkt: {laatstBijgewerkt.toLocaleString('nl-NL')}
            </p>
          </div>
        )}
      </div>
      <Suspense fallback={<div className="text-sm text-gray-600">Laden...</div>}>
        <PrijsDisplay />
      </Suspense>
      <ErrorBoundary>
        <CalculatorFAQ />
      </ErrorBoundary>
    </div>
  );
}

interface CalculationResult {
  volume: number;
  totaalWattage: number;
  aantalPanelen: number;
  kostenPerUur: number;
  kostenPerDag: number;
  kostenPerMaand: number;
  aanbevolenPanelen: string[];
  wattagePerM2: number;
}
