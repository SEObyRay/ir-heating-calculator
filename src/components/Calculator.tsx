'use client';

import React, { useState } from 'react';
import { haalStroomprijsOp } from '../services/energyPrices';

interface CalculationResult {
  aantalPanelen: number;
  totaalWattage: number;
  kostenPerUur: number;
  kostenPerDag: number;
  kostenPerMaand: number;
}

export default function Calculator() {
  const [oppervlakte, setOppervlakte] = useState<number>(0);
  const [isolatie, setIsolatie] = useState<'goed' | 'matig' | 'slecht'>('goed');
  const [urenPerDag, setUrenPerDag] = useState<number>(6);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const stroomprijs = haalStroomprijsOp().prijs;

  const berekenVerwarming = () => {
    // Wattage per m² bepalen op basis van isolatie
    const wattagePerM2 = {
      goed: 60,
      matig: 80,
      slecht: 100
    }[isolatie];

    // Totaal benodigd wattage berekenen
    const totaalWattage = oppervlakte * wattagePerM2;
    
    // Aantal panelen berekenen (uitgaande van 600W per paneel)
    const aantalPanelen = Math.ceil(totaalWattage / 600);
    
    // Stroomverbruik en kosten berekenen
    const verbruikPerUur = totaalWattage / 1000; // kWh per uur
    const kostenPerUur = verbruikPerUur * stroomprijs;
    const kostenPerDag = kostenPerUur * urenPerDag;
    const kostenPerMaand = kostenPerDag * 30;

    setResult({
      aantalPanelen,
      totaalWattage,
      kostenPerUur,
      kostenPerDag,
      kostenPerMaand
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Bereken uw infrarood verwarming</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Oppervlakte (m²)
          </label>
          <input
            type="number"
            min="0"
            value={oppervlakte || ''}
            onChange={(e) => setOppervlakte(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Isolatie
          </label>
          <select
            value={isolatie}
            onChange={(e) => setIsolatie(e.target.value as 'goed' | 'matig' | 'slecht')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="goed">Goed geïsoleerd</option>
            <option value="matig">Matig geïsoleerd</option>
            <option value="slecht">Slecht geïsoleerd</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gebruiksuren per dag
          </label>
          <input
            type="number"
            min="0"
            max="24"
            value={urenPerDag}
            onChange={(e) => setUrenPerDag(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <button
          onClick={berekenVerwarming}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Bereken
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-orange-50 rounded-md">
          <h3 className="text-lg font-semibold mb-3">Resultaat</h3>
          <div className="space-y-2 text-sm">
            <p>Benodigd aantal panelen (600W): <span className="font-semibold">{result.aantalPanelen}</span></p>
            <p>Totaal wattage: <span className="font-semibold">{result.totaalWattage}W</span></p>
            <p>Stroomkosten per uur: <span className="font-semibold">€{result.kostenPerUur.toFixed(2)}</span></p>
            <p>Stroomkosten per dag: <span className="font-semibold">€{result.kostenPerDag.toFixed(2)}</span></p>
            <p>Geschatte stroomkosten per maand: <span className="font-semibold">€{result.kostenPerMaand.toFixed(2)}</span></p>
            <p className="text-xs text-gray-500 mt-2">
              * Berekend met huidige stroomprijs van €{stroomprijs.toFixed(2)}/kWh
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
