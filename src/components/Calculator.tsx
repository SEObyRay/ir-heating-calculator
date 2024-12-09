'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useStroomprijs } from '../context/StroomprijsContext';
import CalculatorFAQ from './CalculatorFAQ';

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">IR Verwarming Calculator</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type verwarming
            </label>
            <select
              value={verwarmingsType}
              onChange={(e) => setVerwarmingsType(e.target.value as 'volledig' | 'plaatselijk')}
              className="block w-full rounded-md border border-gray-300 p-2"
            >
              <option value="volledig">Volledige ruimteverwarming</option>
              <option value="plaatselijk">Plaatselijke verwarming</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Oppervlakte (m²)
            </label>
            <input
              type="number"
              min="0"
              value={oppervlakte}
              onChange={(e) => setOppervlakte(Number(e.target.value))}
              className="block w-full rounded-md border border-gray-300 p-2"
              placeholder="Bijv. 45"
            />
            <p className="mt-1 text-xs text-gray-500">
              Standaard: 45m² (gemiddelde woonkamer)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hoogte ruimte (m)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={hoogte}
              onChange={(e) => setHoogte(Number(e.target.value))}
              className="block w-full rounded-md border border-gray-300 p-2"
              placeholder="Bijv. 2.6"
            />
            <p className="mt-1 text-xs text-gray-500">
              Standaard: 2.6m (normale plafondhoogte)
            </p>
          </div>

          {verwarmingsType === 'plaatselijk' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Afstand tot paneel (m)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={afstandTotPaneel}
                onChange={(e) => setAfstandTotPaneel(Number(e.target.value))}
                className="block w-full rounded-md border border-gray-300 p-2"
                placeholder="Bijv. 1.5"
              />
              <p className="mt-1 text-sm text-gray-500">
                Voor optimale werking: maximaal 1,5 meter
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Isolatie
            </label>
            <select
              value={isolatie}
              onChange={(e) => setIsolatie(e.target.value as 'goed' | 'matig' | 'slecht')}
              className="block w-full rounded-md border border-gray-300 p-2"
            >
              <option value="goed">Goed geïsoleerd (nieuwbouw/recent gerenoveerd)</option>
              <option value="matig">Matig geïsoleerd (1990-2010)</option>
              <option value="slecht">Slecht geïsoleerd (voor 1990)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gebruiksuren per dag
            </label>
            <input
              type="number"
              min="0"
              max="24"
              value={urenPerDag}
              onChange={(e) => setUrenPerDag(Number(e.target.value))}
              className="block w-full rounded-md border border-gray-300 p-2"
              placeholder="Bijv. 8"
            />
            <p className="mt-1 text-xs text-gray-500">
              Standaard: 8 uur (gemiddeld dagelijks gebruik)
            </p>
          </div>

          <button
            onClick={berekenVerwarming}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Bereken
          </button>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Resultaat</h2>
              <div className="space-y-2 text-sm">
                <p>Volume van de ruimte: <span className="font-medium">{result.volume.toFixed(1)} m³</span></p>
                <p>Benodigd vermogen: <span className="font-medium">{result.totaalWattage.toFixed(0)}W</span></p>
                <p>Geschat aantal panelen: <span className="font-medium">{result.aantalPanelen}</span></p>
                <p>Stroomkosten per uur: <span className="font-medium">€{result.kostenPerUur.toFixed(2)}</span></p>
                <p>Stroomkosten per dag: <span className="font-medium">€{result.kostenPerDag.toFixed(2)}</span></p>
                <p>Geschatte stroomkosten per maand: <span className="font-medium">€{result.kostenPerMaand.toFixed(2)}</span></p>
                
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold">Advies</h4>
                  {result.aanbevolenPanelen.map((advies, index) => (
                    <p key={index} className={index === 0 ? "font-medium" : ""}>{advies}</p>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  * Berekend met huidige stroomprijs van €{stroomprijs.toFixed(2)}/kWh
                  <br />
                  Laatst bijgewerkt: {laatstBijgewerkt.toLocaleString('nl-NL')}
                </p>
              </div>
            </div>
          )}
        </div>
        <Suspense fallback={<div className="text-sm text-gray-600">Laden...</div>}>
          <PrijsDisplay />
        </Suspense>
        <CalculatorFAQ />
      </div>
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
