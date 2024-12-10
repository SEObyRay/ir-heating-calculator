'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Tooltip } from 'react-tooltip';
import { useStroomprijs } from '../context/StroomprijsContext';
import CalculatorFAQ from './CalculatorFAQ';
import ErrorBoundary from './ErrorBoundary';

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

const PrijsDisplay = dynamic(() => import('./PrijsDisplay'), {
  ssr: false,
  loading: () => <div className="text-sm text-gray-600">Laden...</div>
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

const Calculator = () => {
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
    <React.Fragment>
      <div className="space-y-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            Vermogen infrarood verwarming berekenen
          </h1>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Bereken snel en eenvoudig het benodigde vermogen voor uw infrarood verwarming en krijg direct inzicht in de kosten.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="oppervlakte" className="block text-sm font-medium text-gray-700 mb-2">
                  Oppervlakte (m²)
                </label>
                <input
                  type="number"
                  id="oppervlakte"
                  value={oppervlakte}
                  onChange={(e) => setOppervlakte(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Bijv. 20"
                />
              </div>

              <div>
                <label htmlFor="hoogte" className="block text-sm font-medium text-gray-700 mb-2">
                  Plafondhoogte (m)
                </label>
                <input
                  type="number"
                  id="hoogte"
                  value={hoogte}
                  onChange={(e) => setHoogte(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Bijv. 2.6"
                />
              </div>

              <div>
                <label htmlFor="isolatie" className="block text-sm font-medium text-gray-700 mb-2">
                  Isolatiewaarde
                </label>
                <select
                  id="isolatie"
                  value={isolatie}
                  onChange={(e) => setIsolatie(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="goed">Goed (nieuwbouw/recent gerenoveerd)</option>
                  <option value="matig">Matig (tussen 1975 en 2000)</option>
                  <option value="slecht">Slecht (voor 1975)</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="verwarmingsType" className="block text-sm font-medium text-gray-700 mb-2">
                  Type verwarming
                </label>
                <select
                  id="verwarmingsType"
                  value={verwarmingsType}
                  onChange={(e) => setVerwarmingsType(e.target.value as 'volledig' | 'plaatselijk')}
                  className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="volledig">Volledige ruimte verwarmen</option>
                  <option value="plaatselijk">Plaatselijke verwarming</option>
                </select>
              </div>

              <div>
                <label htmlFor="urenPerDag" className="block text-sm font-medium text-gray-700 mb-2">
                  Gebruiksuren per dag
                </label>
                <input
                  type="number"
                  id="urenPerDag"
                  value={urenPerDag}
                  onChange={(e) => setUrenPerDag(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Bijv. 8"
                />
              </div>

              {verwarmingsType === 'plaatselijk' && (
                <div>
                  <label htmlFor="afstandTotPaneel" className="block text-sm font-medium text-gray-700 mb-2">
                    Afstand tot paneel (m)
                  </label>
                  <input
                    type="number"
                    id="afstandTotPaneel"
                    value={afstandTotPaneel}
                    onChange={(e) => setAfstandTotPaneel(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Bijv. 1.5"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={berekenVerwarming}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Bereken Vermogen en Kosten
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
            <h2 className="text-2xl font-semibold mb-6">Resultaten</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Benodigd vermogen</h3>
                <div className="bg-blue-50/50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-blue-600">{result.totaalWattage.toFixed(0)} Watt</p>
                  <p className="text-sm text-blue-600 mt-1">Totaal benodigd vermogen</p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    • Vermogen per m²: {Math.round(result.totaalWattage / oppervlakte)} W/m²
                  </p>
                  <p className="text-sm text-gray-600">
                    • Aantal panelen: {Math.ceil(result.totaalWattage / 600)} (uitgaande van 600W per paneel)
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Verbruikskosten</h3>
                <div className="bg-green-50/50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-green-600">€{result.kostenPerDag.toFixed(2)}</p>
                  <p className="text-sm text-green-600 mt-1">Kosten per dag</p>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    • Per maand: €{(result.kostenPerDag * 30.5).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    • Per jaar: €{(result.kostenPerDag * 365).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <PrijsDisplay />
      <ErrorBoundary>
        <CalculatorFAQ />
      </ErrorBoundary>
    </React.Fragment>
  );
};

export default Calculator;
