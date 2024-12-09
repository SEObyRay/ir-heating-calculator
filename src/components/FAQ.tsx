'use client';

import React, { useEffect, useMemo } from 'react';
import { useStroomprijs } from '../context/StroomprijsContext';
import SchemaOrg from './SchemaOrg';

const FAQ: React.FC = () => {
  const { stroomprijs } = useStroomprijs();
  
  useEffect(() => {
    console.log('FAQ component rendered with stroomprijs:', stroomprijs);
  }, [stroomprijs]);

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    console.log('Formatting amount:', amount, 'to:', formatted);
    return formatted;
  };

  const faqItems = useMemo(() => {
    console.log('Generating FAQ items with stroomprijs:', stroomprijs);
    return [
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
        answer: `Bij de huidige stroomprijs van ${formatCurrency(stroomprijs)}/kWh kan infraroodverwarming een efficiënte verwarmingsoptie zijn. Het directe verwarmingsprincipe en de mogelijkheid tot zonegericht verwarmen maken het vaak zuiniger dan traditionele elektrische verwarming. Een 1000W paneel kost ongeveer ${formatCurrency(stroomprijs)} per uur aan stroom.`
      }
    ];
  }, [stroomprijs]);

  const Content = useMemo(() => (
    <div className="mt-8">
      <SchemaOrg faqItems={faqItems} />
      <h2 className="text-2xl font-bold mb-6">Veelgestelde vragen</h2>
      <div className="space-y-6">
        {faqItems.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
            <p className="text-gray-600 whitespace-pre-line">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  ), [faqItems]);

  return Content;
};

export default FAQ;
