'use client';

import React, { useState } from 'react';
import { useStroomprijs } from '../context/StroomprijsContext';
import SchemaOrg from './SchemaOrg';

const FAQ: React.FC = () => {
  const { stroomprijs } = useStroomprijs();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
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
      question: 'Wat kost infrarood verwarming per uur?',
      answer: `De kosten per uur hangen af van het vermogen en uw stroomtarief:
              1000 watt paneel: ±${formatCurrency(stroomprijs)} per uur (bij ${formatCurrency(stroomprijs)}/kWh)
              2000 watt paneel: ±${formatCurrency(stroomprijs * 2)} per uur (bij ${formatCurrency(stroomprijs)}/kWh)
              Met zonnepanelen of een nachttarief kunnen de kosten lager uitvallen.`
    },
    {
      question: 'Hoeveel kost infraroodverwarming per maand?',
      answer: `De maandelijkse kosten hangen af van het vermogen van uw panelen en het aantal gebruiksuren. Een 1000W paneel verbruikt 1 kWh per uur, wat bij de huidige stroomprijs van ${formatCurrency(stroomprijs)}/kWh en 8 uur gebruik per dag neerkomt op ongeveer ${formatCurrency(stroomprijs * 8 * 30)} per maand.`
    },
    {
      question: 'Wat is het verschil tussen infraroodverwarming en traditionele verwarming?',
      answer: 'Infraroodverwarming verwarmt objecten en personen direct via stralingswarmte, terwijl traditionele verwarming eerst de lucht moet opwarmen. Dit maakt infraroodverwarming vaak efficiënter en comfortabeler.'
    },
    {
      question: 'Hoeveel vermogen heb ik nodig voor mijn ruimte?',
      answer: `Als vuistregel wordt vaak 50-60 Watt per kubieke meter aangehouden voor goed geïsoleerde ruimtes. Voor een gemiddelde woonkamer van 40m³ zou dit neerkomen op ongeveer 2000-2400 Watt aan vermogen. Bij de huidige stroomprijs van ${formatCurrency(stroomprijs)}/kWh betekent dit een maximaal verbruik van ${formatCurrency(stroomprijs * 2.4)} per uur bij volledig vermogen.`
    },
    {
      question: 'Is infraroodverwarming zuiniger dan andere verwarmingssystemen?',
      answer: `Bij de huidige stroomprijs van ${formatCurrency(stroomprijs)}/kWh kan infraroodverwarming een efficiënte verwarmingsoptie zijn. Het directe verwarmingsprincipe en de mogelijkheid om per ruimte te verwarmen kunnen leiden tot energiebesparing.`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8">
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
        Veelgestelde vragen over infrarood verwarming
      </h2>
      
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-lg rounded-xl shadow-md border border-white/20 overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/10 transition-colors duration-200"
            >
              <span className="font-medium text-gray-800">{item.question}</span>
              <span className={`transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </span>
            </button>
            
            <div
              className={`px-6 transition-all duration-200 ease-in-out ${
                openIndex === index ? 'max-h-96 py-4' : 'max-h-0 overflow-hidden'
              }`}
            >
              <p className="text-gray-600 whitespace-pre-line">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
      
      <SchemaOrg faqItems={faqItems} />
    </div>
  );
};

export default FAQ;
