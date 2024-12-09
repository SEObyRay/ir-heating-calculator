'use client';

import React, { useState } from 'react';
import { useStroomprijs } from '../context/StroomprijsContext';
import SchemaOrg from './SchemaOrg';

const CalculatorFAQ: React.FC = () => {
  const { stroomprijs } = useStroomprijs();
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    return formatted;
  };

  const faqItems = [
    {
      question: 'Hoeveel watt per m2 infrarood verwarming?',
      answer: `Met onze calculator kunt u eenvoudig het benodigde vermogen voor infrarood verwarming berekenen. Het wattage per m² hangt af van verschillende factoren:
              - Goede isolatie (na 2000): 60-75 watt/m²
              - Gemiddelde isolatie: 75-100 watt/m²
              - Matige isolatie (voor 1990): 100-125 watt/m²
              Gebruik onze vermogenscalculator om het exacte vermogen voor uw situatie te bepalen.`
    },
    {
      question: 'Wat kost infrarood verwarming per uur?',
      answer: `De kosten voor infrarood verwarming berekenen we op basis van het vermogen en het stroomtarief:
              - 1000 watt paneel: ±${formatCurrency(stroomprijs)} per uur (bij ${formatCurrency(stroomprijs)}/kWh)
              - 2000 watt paneel: ±${formatCurrency(stroomprijs * 2)} per uur
              Met een thermostaat ligt het werkelijke verbruik vaak 40-60% lager.`
    },
    {
      question: 'Hoeveel vermogen heeft u nodig voor verschillende ruimtes?',
      answer: `Het benodigde vermogen voor infrarood panelen verschilt per toepassing:
              - Werkplek: 350-500 watt (gericht verwarmen)
              - Boven bank/zithoek: 500-750 watt (comfortabele warmte)
              - Woonkamer als hoofdverwarming: bereken het exacte vermogen met onze calculator
              - Badkamer: 500-750 watt (aangename warmte)
              Het juiste infrarood vermogen hangt af van isolatie en ruimtegrootte.`
    },
    {
      question: 'Is infrarood verwarming zuiniger dan gas of traditionele elektrische verwarming?',
      answer: `Bij de huidige energieprijzen van ${formatCurrency(stroomprijs)}/kWh kan infrarood verwarming een efficiënte keuze zijn:
              - Directe warmteafgifte zonder warmteverlies
              - Geen opwarmtijd nodig
              - Mogelijkheid tot zonegericht verwarmen
              - Ideaal als bijverwarming
              Bereken met onze calculator of infrarood verwarming voor u voordeliger is dan gas of traditionele verwarming.`
    },
    {
      question: 'Wat kost infrarood verwarming per dag en per maand?',
      answer: `De kosten voor infrarood verwarming berekenen we als volgt:
              - Per dag (8 uur gebruik): ${formatCurrency(stroomprijs * 8)} voor een 1000W paneel
              - Per maand (8 uur/dag): ongeveer ${formatCurrency(stroomprijs * 8 * 30)}
              Het werkelijke verbruik hangt af van de thermostaat en gebruiksduur. Met onze calculator kunt u het exacte verbruik voor uw situatie berekenen.`
    },
    {
      question: 'Hoeveel vermogen heeft u nodig voor een woonkamer?',
      answer: `Voor het verwarmen van een woonkamer met infrarood panelen als hoofdverwarming moet u rekening houden met:
              - Volume van de ruimte (m³)
              - Isolatiewaarde van de woning
              - Gewenste temperatuur
              Gebruik onze vermogenscalculator om het benodigde wattage voor uw woonkamer te berekenen. Voor een gemiddelde woonkamer van 40m³ met goede isolatie is ongeveer 2000-2400 watt aan vermogen nodig.`
    }
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndexes(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  interface FAQItemProps {
    item: {
      question: string;
      answer: string;
    };
    index: number;
    isOpen: boolean;
    onToggle: () => void;
  }

  const FAQItem: React.FC<FAQItemProps> = ({ item, index, isOpen, onToggle }) => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-2">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
      >
        <h4 className="text-lg font-semibold text-gray-900">{item.question}</h4>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <p className="px-6 pb-4 text-gray-600 whitespace-pre-line">
          {item.answer}
        </p>
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      <SchemaOrg faqItems={faqItems} />
      <h2 className="text-2xl font-bold mb-6">
        Veelgestelde vragen over infrarood verwarming berekenen
      </h2>
      <div className="space-y-4">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Vermogen en wattage berekenen voor infrarood panelen
          </h3>
          {faqItems.slice(0, 2).map((item, index) => (
            <FAQItem key={index} item={item} index={index} isOpen={openIndexes.includes(index)} onToggle={() => toggleQuestion(index)} />
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Infrarood panelen als hoofdverwarming of bijverwarming
          </h3>
          {faqItems.slice(2, 4).map((item, index) => (
            <FAQItem key={index + 2} item={item} index={index + 2} isOpen={openIndexes.includes(index + 2)} onToggle={() => toggleQuestion(index + 2)} />
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Kosten en verbruik van infrarood verwarming
          </h3>
          {faqItems.slice(4).map((item, index) => (
            <FAQItem key={index + 4} item={item} index={index + 4} isOpen={openIndexes.includes(index + 4)} onToggle={() => toggleQuestion(index + 4)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalculatorFAQ;
