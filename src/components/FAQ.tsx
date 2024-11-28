import React from 'react';
import { getCurrentElectricityPrice } from '../services/energyPrices';

const FAQ: React.FC = () => {
  const stroomprijs = getCurrentElectricityPrice();
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const faqItems = [
    {
      question: 'Hoeveel kost infraroodverwarming per maand?',
      answer: `De maandelijkse kosten hangen af van het vermogen van uw panelen en het aantal gebruiksuren. 
              Een 1000W paneel verbruikt 1 kWh per uur, wat bij de huidige stroomprijs van ${formatCurrency(stroomprijs)}/kWh 
              en 8 uur gebruik per dag neerkomt op ongeveer ${formatCurrency(stroomprijs * 8 * 30)} per maand.`
    },
    {
      question: 'Wat is het verschil tussen infraroodverwarming en traditionele verwarming?',
      answer: 'Infraroodverwarming verwarmt objecten en personen direct via stralingswarmte, terwijl traditionele verwarming eerst de lucht moet opwarmen. Dit maakt infraroodverwarming vaak efficiënter en comfortabeler.'
    },
    {
      question: 'Hoeveel vermogen heb ik nodig voor mijn ruimte?',
      answer: 'Als vuistregel wordt vaak 50-60 Watt per kubieke meter aangehouden voor goed geïsoleerde ruimtes. Voor een gemiddelde woonkamer van 40m³ zou dit neerkomen op ongeveer 2000-2400 Watt aan vermogen.'
    },
    {
      question: 'Is infraroodverwarming zuiniger dan gas?',
      answer: `Bij de huidige energieprijzen en met slim gebruik kan infraroodverwarming inderdaad zuiniger zijn dan gas. 
              Een 1000W paneel kost bij ${formatCurrency(stroomprijs)}/kWh ongeveer ${formatCurrency(stroomprijs)} per uur aan stroom, 
              terwijl een gasgestookte CV-ketel voor dezelfde ruimte vaak meer energie verbruikt door het opwarmen van water en lucht.`
    },
    {
      question: 'Waar kan ik het beste mijn infraroodpaneel plaatsen?',
      answer: 'Infraroodpanelen werken het beste wanneer ze aan het plafond of hoog aan de wand worden gemonteerd. Plaats ze bij voorkeur tegenover zitplaatsen en werkplekken voor optimaal comfort.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Veelgestelde Vragen</h2>
      <div className="space-y-6">
        {faqItems.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
            <p className="text-gray-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
