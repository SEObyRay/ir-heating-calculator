'use client';

import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
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
      id: 'calc-berekening',
      question: 'Hoe wordt de berekening gemaakt?',
      answer: `De calculator gebruikt de volgende formule:
              1. Ruimtevolume = Oppervlakte × Hoogte
              2. Basisvermogen = Volume × Watt per m³
              3. Correctie voor isolatie:
                 - Goed: -25% vermogen
                 - Matig: Basisvermogen
                 - Slecht: +25% vermogen
              4. Energiekosten = Vermogen × ${formatCurrency(stroomprijs)}/kWh × Gebruiksuren`
    },
    {
      id: 'calc-isolatie',
      question: 'Waarom is isolatie belangrijk?',
      answer: 'Isolatie bepaalt hoeveel warmte er verloren gaat. Bij slechte isolatie is meer vermogen nodig om dezelfde temperatuur te bereiken. Goede isolatie kan het energieverbruik met wel 25% verlagen.'
    },
    {
      id: 'calc-gebruiksuren',
      question: 'Hoeveel gebruiksuren moet ik rekenen?',
      answer: 'Dit hangt af van uw situatie. Gemiddeld wordt uitgegaan van 8 uur per dag voor een woonkamer. Voor een badkamer is 2-3 uur vaak voldoende.'
    },
    {
      id: 'calc-stroomprijs',
      question: 'Wordt de actuele stroomprijs gebruikt?',
      answer: `Ja, de calculator gebruikt de huidige stroomprijs van ${formatCurrency(stroomprijs)} per kWh. Deze prijs wordt regelmatig bijgewerkt.`
    },
    {
      id: 'calc-plaatsing',
      question: 'Waar moet ik op letten bij de plaatsing?',
      answer: 'Infraroodpanelen werken het beste als ze direct zicht hebben op het te verwarmen oppervlak. Plaats ze bij voorkeur aan het plafond of hoog aan de muur voor optimale warmteverdeling.'
    },
    {
      id: 'calc-watt-per-m2',
      question: 'Hoeveel watt per m2 infrarood verwarming?',
      answer: `Met onze calculator kunt u eenvoudig het benodigde vermogen voor infrarood verwarming berekenen. Het wattage per m² hangt af van verschillende factoren:
              - Goede isolatie (na 2000): 60-75 watt/m²
              - Gemiddelde isolatie: 75-100 watt/m²
              - Matige isolatie (voor 1990): 100-125 watt/m²
              Gebruik onze vermogenscalculator om het exacte vermogen voor uw situatie te bepalen.`
    },
    {
      id: 'calc-kosten-per-uur',
      question: 'Wat kost infrarood verwarming per uur?',
      answer: `De kosten voor infrarood verwarming berekenen we op basis van het vermogen en het stroomtarief:
              - 1000 watt paneel: ±${formatCurrency(stroomprijs)} per uur (bij ${formatCurrency(stroomprijs)}/kWh)
              - 2000 watt paneel: ±${formatCurrency(stroomprijs * 2)} per uur
              Met een thermostaat ligt het werkelijke verbruik vaak 40-60% lager.`
    },
    {
      id: 'calc-vermogen-per-ruimte',
      question: 'Hoeveel vermogen heeft u nodig voor verschillende ruimtes?',
      answer: `Het benodigde vermogen voor infrarood panelen verschilt per toepassing:
              - Werkplek: 350-500 watt (gericht verwarmen)
              - Boven bank/zithoek: 500-750 watt (comfortabele warmte)
              - Woonkamer als hoofdverwarming: bereken het exacte vermogen met onze calculator
              - Badkamer: 500-750 watt (aangename warmte)
              Het juiste infrarood vermogen hangt af van isolatie en ruimtegrootte.`
    },
    {
      id: 'calc-zuiniger-dan-gas',
      question: 'Is infrarood verwarming zuiniger dan gas of traditionele elektrische verwarming?',
      answer: `Bij de huidige energieprijzen van ${formatCurrency(stroomprijs)}/kWh kan infrarood verwarming een efficiënte keuze zijn:
              - Directe warmteafgifte zonder warmteverlies
              - Geen opwarmtijd nodig
              - Mogelijkheid tot zonegericht verwarmen
              - Ideaal als bijverwarming
              Bereken met onze calculator of infrarood verwarming voor u voordeliger is dan gas of traditionele verwarming.`
    },
    {
      id: 'calc-kosten-per-dag-en-maand',
      question: 'Wat kost infrarood verwarming per dag en per maand?',
      answer: `De kosten voor infrarood verwarming berekenen we als volgt:
              - Per dag (8 uur gebruik): ${formatCurrency(stroomprijs * 8)} voor een 1000W paneel
              - Per maand (8 uur/dag): ongeveer ${formatCurrency(stroomprijs * 8 * 30)}
              Het werkelijke verbruik hangt af van de thermostaat en gebruiksduur. Met onze calculator kunt u het exacte verbruik voor uw situatie berekenen.`
    },
    {
      id: 'calc-vermogen-per-woonkamer',
      question: 'Hoeveel vermogen heeft u nodig voor een woonkamer?',
      answer: `Voor het verwarmen van een woonkamer met infrarood panelen als hoofdverwarming moet u rekening houden met:
              - Volume van de ruimte (m³)
              - Isolatiewaarde van de woning
              - Gewenste temperatuur
              Gebruik onze vermogenscalculator om het benodigde wattage voor uw woonkamer te berekenen. Voor een gemiddelde woonkamer van 40m³ met goede isolatie is ongeveer 2000-2400 watt aan vermogen nodig.`
    }
  ];

  const toggleFaq = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <div className="mt-8">
      <SchemaOrg faqItems={faqItems} />
      <h2 className="text-2xl font-bold mb-6">
        Veelgestelde vragen over infrarood verwarming berekenen
      </h2>
      <div className="space-y-4" role="list">
        {faqItems.map((faq, index) => (
          <div 
            key={faq.id} 
            id={faq.id}
            className="bg-white/60 rounded-xl overflow-hidden"
            role="listitem"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/80 transition-colors duration-200"
              aria-expanded={openIndexes.includes(index)}
              aria-controls={`${faq.id}-answer`}
              id={`${faq.id}-question`}
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  openIndexes.includes(index) ? 'transform rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
            {openIndexes.includes(index) && (
              <div 
                id={`${faq.id}-answer`}
                className="px-6 py-4 text-gray-600 bg-white/40 whitespace-pre-line"
                role="region"
                aria-labelledby={`${faq.id}-question`}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorFAQ;
