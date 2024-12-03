'use client';

import React, { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useStroomprijs } from '../context/StroomprijsContext';
import { haalStroomprijsOp, haalStroomprijsOpSync } from '../services/energyPrices';

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Hoeveel watt infrarood verwarming heb ik nodig per m²?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Het benodigde vermogen hangt af van de isolatie van uw woning: Goede isolatie (na 2010): 60-75 watt per m², Gemiddelde isolatie (1990-2010): 75-100 watt per m², Matige isolatie (voor 1990): 100-125 watt per m²."
      }
    },
    {
      "@type": "Question",
      "name": "Wat kost infrarood verwarming per uur?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "De kosten per uur hangen af van het vermogen en uw stroomtarief. Een 1000 watt paneel kost ongeveer €0,35 per uur (bij €0,35/kWh), een 2000 watt paneel ongeveer €0,70 per uur. Met zonnepanelen of nachttarief kunnen de kosten lager uitvallen."
      }
    },
    {
      "@type": "Question",
      "name": "Hoeveel watt infrarood paneel voor specifieke ruimtes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Richtlijnen: Boven werkplek: 350-500 watt, Boven zithoek/bank: 500-750 watt, Woonkamer (als hoofdverwarming): 60-100 watt per m², Badkamer: 500-750 watt."
      }
    },
    {
      "@type": "Question",
      "name": "Is infrarood verwarming zuiniger dan andere verwarmingssystemen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Infrarood verwarming kan zuiniger zijn dan traditionele elektrische verwarming vanwege: directe warmteafgifte zonder warmteverlies, geen opwarmtijd, gericht verwarmen mogelijk, en efficiënte combinatie met zonnepanelen. Vergeleken met gas hangt het af van de energieprijzen en specifieke situatie."
      }
    },
    {
      "@type": "Question",
      "name": "Wat is het stroomverbruik van een infraroodpaneel?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Het stroomverbruik is gelijk aan het vermogen: 350W paneel = 0,35 kWh per uur, 500W paneel = 0,50 kWh per uur, 750W paneel = 0,75 kWh per uur, 1000W paneel = 1,00 kWh per uur. Door gebruik van een thermostaat is het werkelijke verbruik vaak 40-60% van het maximale verbruik."
      }
    }
  ]
};

const STANDAARD_PANELEN = [
  { wattage: 350, volume: 9, beschrijving: 'Geschikt voor ca. 9 m³, ideaal als elektrische bureau verwarming of voor een klein toilet.' },
  { wattage: 450, volume: 12, beschrijving: 'Geschikt voor ca. 12 m³, perfect voor een kleine slaapkamer of bijkeuken.' },
  { wattage: 580, volume: 15, beschrijving: 'Geschikt voor ca. 15 m³, ideaal voor een woonkamer of keuken.' },
  { wattage: 700, volume: 18, beschrijving: 'Geschikt voor ca. 18 m³, ideaal als infrarood verwarming woonkamer.' }
];

// Standaard waarden voor een gemiddeld Nederlands huishouden
const DEFAULTS = {
  OPPERVLAKTE: 45, // m² (gemiddelde woonkamer)
  HOOGTE: 2.6,     // m (standaard plafondhoogte)
  ISOLATIE: 'matig' as 'goed' | 'matig' | 'slecht', // Meeste huizen hebben gemiddelde isolatie
  VERWARMINGSTYPE: 'volledig' as 'volledig' | 'plaatselijk',
  AFSTAND_TOT_PANEEL: 1.5, // m (optimale afstand voor plaatselijke verwarming)
  UREN_PER_DAG: 8,  // Gemiddeld gebruik per dag
};

const PrijsDisplay = dynamic(() => import('./PrijsDisplay'), {
  ssr: false,
});

export default function Calculator() {
  const { stroomprijs, laatstBijgewerkt } = useStroomprijs();
  const [verwarmingsType, setVerwarmingsType] = useState<'volledig' | 'plaatselijk'>(DEFAULTS.VERWARMINGSTYPE);
  const [oppervlakte, setOppervlakte] = useState<number>(DEFAULTS.OPPERVLAKTE);
  const [hoogte, setHoogte] = useState<number>(DEFAULTS.HOOGTE);
  const [isolatie, setIsolatie] = useState<'goed' | 'matig' | 'slecht'>(DEFAULTS.ISOLATIE);
  const [urenPerDag, setUrenPerDag] = useState<number>(DEFAULTS.UREN_PER_DAG);
  const [afstandTotPaneel, setAfstandTotPaneel] = useState<number>(DEFAULTS.AFSTAND_TOT_PANEEL);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handlePrijsUpdate = (nieuwePrijs: number) => {
    // Herbereken resultaten als ze bestaan
    if (result) {
      berekenVerwarming();
    }
  };

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Infrarood verwarming vermogen berekenen
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                Bereken eenvoudig hoeveel watt en vermogen je nodig hebt voor infrarood verwarming. 
                Onze calculator helpt je het juiste aantal infrarood panelen te bepalen voor zowel hoofdverwarming als bijverwarming.
              </p>
              <Suspense fallback={<div className="text-sm text-gray-600">Laden...</div>}>
                <PrijsDisplay />
              </Suspense>
            </div>

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
          </div>

          <div className="mt-12 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Hoeveel vermogen heb ik nodig voor infrarood verwarming?
              </h2>
              <p className="text-gray-600 mb-4">
                Het berekenen van het benodigde vermogen voor infrarood panelen hangt af van verschillende factoren. 
                Onze calculator helpt je het wattage te bepalen, rekening houdend met:
              </p>
              <ul className="list-disc pl-5 mb-4 text-gray-600">
                <li>Oppervlakte en hoogte van de ruimte (watt per m²)</li>
                <li>Isolatieniveau (dakisolatie en muurisolatie)</li>
                <li>Type verwarming (hoofdverwarming of bijverwarming)</li>
                <li>Gewenste temperatuur en comfort</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Infrarood panelen als hoofdverwarming of bijverwarming
              </h2>
              <p className="text-gray-600 mb-4">
                Het vermogen dat u nodig heeft voor infrarood verwarming verschilt per toepassing:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Infrarood als hoofdverwarming</h3>
                  <p className="text-gray-600">
                    Voor het verwarmen met infrarood verwarmingspanelen als hoofdverwarming is meer vermogen nodig. 
                    Het benodigde wattage wordt bepaald door de isolatie en het volume van de ruimte.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Infrarood panelen als bijverwarming</h3>
                  <p className="text-gray-600">
                    Bij gebruik van infrarood panelen als bijverwarming kunt u vaak met minder vermogen toe. 
                    Ideaal voor het verhogen van het comfort in specifieke ruimtes.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Bereken het juiste vermogen voor infrarood verwarming
              </h2>
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">
                  Vermogen infrarood verwarming berekenen
                </h3>
                <p className="text-gray-600">
                  Met onze infrarood calculator kunt u eenvoudig het benodigde vermogen berekenen. 
                  Het vereiste vermogen bij het verwarmen met infrarood panelen wordt uitgedrukt in watt en hangt af van:
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  <li>Wattage per m² (75-125W afhankelijk van isolatie)</li>
                  <li>Vermogen per ruimte</li>
                  <li>Benodigde wattage voor comfort</li>
                  <li>Aantal infrarood panelen</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Tips voor het verwarmen met infrarood panelen
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Optimaal gebruik</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Combineer met een slimme thermostaat</li>
                    <li>Zorg voor goede isolatie</li>
                    <li>Plaats meerdere infrarood panelen strategisch</li>
                    <li>Houd rekening met het vermogen per ruimte</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Energiebesparing</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>Kies het juiste wattage infrarood</li>
                    <li>Verbeter de dakisolatie</li>
                    <li>Gebruik infraroodverwarming efficiënt</li>
                    <li>Monitor het verbruik in watt</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Veelgestelde vragen over infrarood verwarming
              </h2>
              
              <div className="space-y-4">
                <details className="bg-white rounded-lg shadow-sm">
                  <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50">
                    Hoeveel watt infrarood verwarming heb ik nodig per m²?
                  </summary>
                  <div className="p-4 pt-0 text-gray-600">
                    Het benodigde vermogen hangt af van de isolatie van uw woning:
                    <ul className="list-disc pl-5 mt-2">
                      <li>Goede isolatie (na 2010): 60-75 watt per m²</li>
                      <li>Gemiddelde isolatie (1990-2010): 75-100 watt per m²</li>
                      <li>Matige isolatie (voor 1990): 100-125 watt per m²</li>
                    </ul>
                    Gebruik onze calculator voor een nauwkeurige berekening van uw situatie.
                  </div>
                </details>

                <details className="bg-white rounded-lg shadow-sm">
                  <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50">
                    Wat kost infrarood verwarming per uur?
                  </summary>
                  <div className="p-4 pt-0 text-gray-600">
                    De kosten per uur hangen af van het vermogen en uw stroomtarief:
                    <ul className="list-disc pl-5 mt-2">
                      <li>1000 watt paneel: ±€0,35 per uur (bij €0,35/kWh)</li>
                      <li>2000 watt paneel: ±€0,70 per uur (bij €0,35/kWh)</li>
                    </ul>
                    Met zonnepanelen of een nachttarief kunnen de kosten lager uitvallen.
                  </div>
                </details>

                <details className="bg-white rounded-lg shadow-sm">
                  <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50">
                    Hoeveel watt infrarood paneel voor specifieke ruimtes?
                  </summary>
                  <div className="p-4 pt-0 text-gray-600">
                    Richtlijnen voor verschillende ruimtes:
                    <ul className="list-disc pl-5 mt-2">
                      <li>Boven werkplek: 350-500 watt</li>
                      <li>Boven zithoek/bank: 500-750 watt</li>
                      <li>Woonkamer (als hoofdverwarming): 60-100 watt per m²</li>
                      <li>Badkamer: 500-750 watt</li>
                    </ul>
                  </div>
                </details>

                <details className="bg-white rounded-lg shadow-sm">
                  <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50">
                    Is infrarood verwarming zuiniger dan andere verwarmingssystemen?
                  </summary>
                  <div className="p-4 pt-0 text-gray-600">
                    <p>Infrarood verwarming kan zuiniger zijn dan traditionele elektrische verwarming omdat:</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Directe warmteafgifte zonder warmteverlies</li>
                      <li>Geen opwarmtijd nodig</li>
                      <li>Gericht verwarmen mogelijk</li>
                      <li>Combinatie met zonnepanelen zeer efficiënt</li>
                    </ul>
                    <p className="mt-2">Vergeleken met gas hangt het af van de energieprijzen en uw specifieke situatie. Bij lokaal gebruik als bijverwarming is infrarood meestal voordeliger dan de hele ruimte verwarmen met gas.</p>
                  </div>
                </details>

                <details className="bg-white rounded-lg shadow-sm">
                  <summary className="cursor-pointer p-4 font-medium text-gray-900 hover:bg-gray-50">
                    Wat is het stroomverbruik van een infraroodpaneel?
                  </summary>
                  <div className="p-4 pt-0 text-gray-600">
                    Het stroomverbruik is gelijk aan het vermogen van het paneel:
                    <ul className="list-disc pl-5 mt-2">
                      <li>350W paneel = 0,35 kWh per uur</li>
                      <li>500W paneel = 0,50 kWh per uur</li>
                      <li>750W paneel = 0,75 kWh per uur</li>
                      <li>1000W paneel = 1,00 kWh per uur</li>
                    </ul>
                    <p className="mt-2">Door gebruik van een thermostaat is het werkelijke verbruik vaak 40-60% van het maximale verbruik.</p>
                  </div>
                </details>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
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
