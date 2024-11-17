'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'Wat is het verschil tussen infrarood hoofdverwarming en bijverwarming?',
    answer: 'Hoofdverwarming is bedoeld om een hele ruimte te verwarmen en wordt berekend op basis van het volume (30-40W per m³). Bijverwarming of spot verwarming is gericht op specifieke zones en wordt berekend per oppervlakte (120-150W per m²). Hoofdverwarming heeft een langere opwarmtijd maar geeft een gelijkmatigere warmte, terwijl bijverwarming sneller warmte geeft in een specifiek gebied.'
  },
  {
    question: 'Hoe nauwkeurig is de vermogensberekening?',
    answer: 'Onze calculator gebruikt professionele HVAC-standaarden en is gebaseerd op Nederlandse bouwnormen. De berekening houdt rekening met factoren zoals isolatie, raamoppervlak, glastype en ruimtegebruik. De nauwkeurigheid ligt gemiddeld op 90-95%, afhankelijk van specifieke omstandigheden. Voor maximale precisie raden we aan om de geavanceerde modus te gebruiken met alle details over ramen en isolatie.'
  },
  {
    question: 'Wat is de terugverdientijd van infrarood verwarming?',
    answer: 'De terugverdientijd varieert en is afhankelijk van verschillende factoren: huidige energiekosten, isolatiewaarde, gebruikspatroon en eventuele combinatie met zonnepanelen. Gemiddeld ligt de terugverdientijd tussen 3-7 jaar. Met de huidige energieprijzen en in combinatie met zonnepanelen kan dit zelfs korter zijn. De levensduur van 20-25 jaar zorgt voor een gunstige investering op lange termijn.'
  },
  {
    question: 'Kan ik infrarood verwarming combineren met andere verwarmingssystemen?',
    answer: 'Ja, infrarood verwarming is uitstekend te combineren met andere systemen. Het werkt goed als aanvulling op vloerverwarming, warmtepompen of traditionele CV-systemen. Voor optimaal gebruik kunt u infrarood panelen inzetten in ruimtes die snel warm moeten zijn of waar andere systemen minder efficiënt zijn, zoals badkamers of werkplekken.'
  },
  {
    question: 'Wat zijn de gezondheidseffecten van infrarood verwarming?',
    answer: 'Infrarood verwarming staat bekend om zijn positieve gezondheidseffecten. Het vermindert luchtcirculatie en daarmee de verspreiding van stof en allergenen. De stralingswarmte is vergelijkbaar met zonlicht en kan helpen bij spier- en gewrichtsklachten. Daarnaast voorkomt het schimmelvorming door het drogen van muren en vermindert het de luchtvochtigheid. Let wel op voldoende ventilatie voor een gezond binnenklimaat.'
  },
  {
    question: 'Voor welke ruimtes is infrarood verwarming het meest geschikt?',
    answer: 'Infrarood verwarming is geschikt voor de meeste ruimtes, maar de effectiviteit verschilt. Ideaal voor: thuiskantoren, badkamers, slaapkamers, en leefruimtes. Minder geschikt voor: zeer hoge ruimtes (>4m), ruimtes met veel tocht, of ongeïsoleerde buitenruimtes. De calculator helpt bepalen of infrarood verwarming geschikt is voor uw specifieke situatie.'
  },
  {
    question: 'Wat is het verschil tussen verschillende types infrarood panelen?',
    answer: 'Er zijn verschillende types: glas, keramiek, en metaal panelen. Glaspanelen zijn stijlvol en geschikt voor zichtbare plaatsing. Keramische panelen hebben een hoog rendement en zijn duurzaam. Metalen panelen zijn kosteneffectief en snel opwarmend. De keuze hangt af van uw budget, esthetische voorkeuren en specifieke verwarmingsbehoefte.'
  },
  {
    question: 'Hoe kan ik het energieverbruik van infrarood verwarming optimaliseren?',
    answer: 'Optimalisatie tips: 1) Gebruik een slimme thermostaat met tijdschemas, 2) Installeer bewegingssensoren voor automatische aan/uitschakeling, 3) Verbeter isolatie waar mogelijk, 4) Plaats panelen strategisch voor maximale effectiviteit, 5) Combineer met zonnepanelen voor duurzame energie, 6) Gebruik zonering voor verschillende ruimtes, 7) Houd deuren gesloten van verwarmde ruimtes.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Veelgestelde Vragen
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <span className="ml-6">
                  {openIndex === index ? (
                    <span className="text-blue-600">−</span>
                  ) : (
                    <span className="text-blue-600">+</span>
                  )}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
