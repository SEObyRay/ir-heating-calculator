'use client';

import React from 'react';
import { useStroomprijs } from '../context/StroomprijsContext';

const CalculatorFAQ: React.FC = () => {
  const { stroomprijs } = useStroomprijs();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const faqItems = [
    {
      question: 'Wat kost infrarood verwarming per uur?',
      answer: `De kosten per uur hangen af van het vermogen en uw stroomtarief:
              1000 watt paneel: ±${formatCurrency(stroomprijs)} per uur (bij ${formatCurrency(stroomprijs)}/kWh)
              2000 watt paneel: ±${formatCurrency(stroomprijs * 2)} per uur (bij ${formatCurrency(stroomprijs)}/kWh)
              Met zonnepanelen of een nachttarief kunnen de kosten lager uitvallen.`
    },
    {
      question: 'Hoeveel watt infrarood verwarming heb ik nodig per m²?',
      answer: `Het benodigde vermogen hangt af van de isolatie van uw woning:
              - Goede isolatie (na 2010): 60-75 watt per m²
              - Gemiddelde isolatie (1990-2010): 75-100 watt per m²
              - Matige isolatie (voor 1990): 100-125 watt per m²`
    },
    {
      question: 'Hoeveel watt infrarood paneel voor specifieke ruimtes?',
      answer: `Richtlijnen:
              - Boven werkplek: 350-500 watt
              - Boven zithoek/bank: 500-750 watt
              - Woonkamer (als hoofdverwarming): 60-100 watt per m²
              - Badkamer: 500-750 watt`
    },
    {
      question: 'Is infrarood verwarming zuiniger dan andere verwarmingssystemen?',
      answer: `Bij de huidige energieprijzen van ${formatCurrency(stroomprijs)}/kWh kan infrarood verwarming zuiniger zijn dan traditionele elektrische verwarming vanwege:
              - Directe warmteafgifte zonder warmteverlies
              - Geen opwarmtijd
              - Gericht verwarmen mogelijk
              - Efficiënte combinatie met zonnepanelen
              Vergeleken met gas hangt het af van de energieprijzen en specifieke situatie.`
    },
    {
      question: 'Wat is het stroomverbruik van een infraroodpaneel?',
      answer: `Het stroomverbruik is gelijk aan het vermogen:
              - 350W paneel = 0,35 kWh per uur (kosten: ${formatCurrency(0.35 * stroomprijs)} per uur)
              - 500W paneel = 0,50 kWh per uur (kosten: ${formatCurrency(0.50 * stroomprijs)} per uur)
              - 750W paneel = 0,75 kWh per uur (kosten: ${formatCurrency(0.75 * stroomprijs)} per uur)
              - 1000W paneel = 1,00 kWh per uur (kosten: ${formatCurrency(stroomprijs)} per uur)
              Door gebruik van een thermostaat is het werkelijke verbruik vaak 40-60% van het maximale verbruik.`
    }
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Veelgestelde vragen over infraroodverwarming</h2>
      <div className="space-y-6">
        {faqItems.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
            <p className="text-gray-600 whitespace-pre-line">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorFAQ;
