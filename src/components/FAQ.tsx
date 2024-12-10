'use client';

import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useStroomprijs } from '../context/StroomprijsContext';
import SchemaOrg from './SchemaOrg';

const FAQ: React.FC = () => {
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
      id: 'kosten-per-uur',
      question: 'Wat kost infrarood verwarming per uur?',
      answer: `De kosten per uur hangen af van het vermogen en uw stroomtarief:
              1000 watt paneel: ±${formatCurrency(stroomprijs)} per uur (bij ${formatCurrency(stroomprijs)}/kWh)
              2000 watt paneel: ±${formatCurrency(stroomprijs * 2)} per uur (bij ${formatCurrency(stroomprijs)}/kWh)
              Met zonnepanelen of een nachttarief kunnen de kosten lager uitvallen.`
    },
    {
      id: 'kosten-per-maand',
      question: 'Hoeveel kost infraroodverwarming per maand?',
      answer: `De maandelijkse kosten hangen af van het vermogen van uw panelen en het aantal gebruiksuren. Een 1000W paneel verbruikt 1 kWh per uur, wat bij de huidige stroomprijs van ${formatCurrency(stroomprijs)}/kWh en 8 uur gebruik per dag neerkomt op ongeveer ${formatCurrency(stroomprijs * 8 * 30)} per maand.`
    },
    {
      id: 'verschil-traditioneel',
      question: 'Wat is het verschil tussen infraroodverwarming en traditionele verwarming?',
      answer: 'Infraroodverwarming verwarmt objecten en personen direct via stralingswarmte, terwijl traditionele verwarming eerst de lucht moet opwarmen. Dit maakt infraroodverwarming vaak efficiënter en comfortabeler.'
    },
    {
      id: 'benodigd-vermogen',
      question: 'Hoeveel vermogen heb ik nodig voor mijn ruimte?',
      answer: `Als vuistregel wordt vaak 50-60 Watt per kubieke meter aangehouden voor goed geïsoleerde ruimtes. Voor een gemiddelde woonkamer van 40m³ zou dit neerkomen op ongeveer 2000-2400 Watt aan vermogen. Bij de huidige stroomprijs van ${formatCurrency(stroomprijs)}/kWh betekent dit een maximaal verbruik van ${formatCurrency(stroomprijs * 2.4)} per uur bij volledig vermogen.`
    },
    {
      id: 'energiezuinigheid',
      question: 'Is infraroodverwarming zuiniger dan andere verwarmingssystemen?',
      answer: `Bij de huidige stroomprijs van ${formatCurrency(stroomprijs)}/kWh kan infraroodverwarming een efficiënte verwarmingsoptie zijn. Het directe verwarmingsprincipe en de mogelijkheid om per ruimte te verwarmen kunnen leiden tot energiebesparing.`
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
    <div className="mt-16">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
          Veelgestelde vragen over infrarood verwarming
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
      
      <SchemaOrg faqItems={faqItems} />
    </div>
  );
};

export default FAQ;
