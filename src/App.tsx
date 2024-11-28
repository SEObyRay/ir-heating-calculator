import { useState, useRef, useEffect } from 'react'
import { Room, CalculationResult, RoomType, InsulationType, Window } from './types/calculator'
import { calculateHeating } from './utils/calculations'
import { TOOLTIPS } from './constants/tooltips'
import { getMockStroomprijsData, haalStroomprijsOp } from './services/energyPrices';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface StroomprijsData {
  prijs: number;
  laatstBijgewerkt: Date;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border rounded-lg mb-2">
      <button
        className="w-full px-4 py-3 text-left font-medium flex justify-between items-center hover:bg-orange-50 transition-colors rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className="transform transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : '' }}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

const roomTypeLabels: Record<RoomType, string> = {
  living: 'Woonkamer',
  bedroom: 'Slaapkamer',
  bathroom: 'Badkamer',
  kitchen: 'Keuken',
  office: 'Kantoor',
  other: 'Anders'
}

const insulationLabels: Record<InsulationType, string> = {
  poor: 'Slecht',
  average: 'Gemiddeld',
  good: 'Goed',
  excellent: 'Uitstekend'
}

const defaultRoom: Room = {
  length: 0,
  width: 0,
  height: 0,
  type: 'living',
  insulation: 'average',
  heatingType: 'full',
  windows: [],
  wallType: 'brick',
  ceilingType: 'concrete',
  floorType: 'concrete',
  ventilationType: 'natural',
  adjacentSpaces: {
    north: 'heated',
    east: 'heated',
    south: 'heated',
    west: 'heated',
    above: 'heated',
    below: 'heated'
  },
  occupancy: {
    numberOfPeople: 2.2,
    hoursPerDay: 14
  },
  spotPercentage: 100
}

function InfoIcon({ tooltip }: { tooltip: string }) {
  return (
    <span className="inline-block ml-1 text-gray-400 hover:text-gray-600" title={tooltip}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </span>
  )
}

function App() {
  const [room, setRoom] = useState<Room>({
    length: 5.0,    // Gemiddelde woonkamer lengte
    width: 4.0,     // Gemiddelde woonkamer breedte
    height: 2.6,    // Standaard plafondhoogte
    insulation: 'medium', // Gemiddelde isolatie (1990-2010 bouw)
    panelType: 'fixed',  // Meest voorkomende type
    mountingType: 'wall' // Meest praktische montage
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');
  const resultRef = useRef<HTMLDivElement>(null)

  const [stroomprijs, setStroomprijs] = useState<StroomprijsData>(getMockStroomprijsData());
  const [isLoadingPrijs, setIsLoadingPrijs] = useState<boolean>(true);

  useEffect(() => {
    const updateStroomprijs = async () => {
      setIsLoadingPrijs(true);
      try {
        const nieuweStroomprijs = await haalStroomprijsOp();
        setStroomprijs(nieuweStroomprijs);
      } catch (error) {
        console.error('Fout bij updaten stroomprijs:', error);
      } finally {
        setIsLoadingPrijs(false);
      }
    };

    // Update direct bij laden
    updateStroomprijs();

    // Update elke 6 uur
    const interval = setInterval(updateStroomprijs, 6 * 60 * 60 * 1000);

    // Cleanup interval bij unmount
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (room.length <= 0 || room.width <= 0 || room.height <= 0) {
      setError('Vul alle afmetingen in (groter dan 0)');
      return;
    }

    try {
      const calculationResult = calculateHeating(room);
      setResult(calculationResult);
      setError('');
    } catch (err) {
      setError('Er is een fout opgetreden bij de berekening');
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setRoom(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
    setError('')
  }

  const handleReset = () => {
    setRoom(defaultRoom)
    setResult(null)
    setError('')
  }

  return (
    <div className="min-h-screen modern-bg">
      {/* Stroomprijs indicator */}
      <div className="bg-orange-100 text-orange-800 px-4 py-2 text-center text-sm">
        <p>
          {isLoadingPrijs ? (
            <span>Stroomprijs laden...</span>
          ) : (
            <>
              Huidige stroomprijs volgens ANWB: <span className="font-semibold">{formatCurrency(stroomprijs.prijs)}/kWh</span>
              <span className="text-orange-600 ml-2 text-xs">
                (inclusief BTW en belastingen)
              </span>
            </>
          )}
        </p>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-pattern" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="header-gradient">Infrarood Verwarming</span>
              <br />
              <span className="text-orange-500">Vermogen Calculator</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Bereken eenvoudig en nauwkeurig het benodigde vermogen voor uw infraroodpanelen.
              Geschikt voor zowel vaste als mobiele panelen.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="feature-card">
              <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Nauwkeurige Berekening</h3>
              <p className="text-gray-600">Gebaseerd op ruimtevolume en isolatieniveau</p>
            </div>
            <div className="feature-card">
              <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Vast of Mobiel</h3>
              <p className="text-gray-600">Advies voor beide types infraroodpanelen</p>
            </div>
            <div className="feature-card">
              <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Professioneel Advies</h3>
              <p className="text-gray-600">Inclusief montage- en gebruikstips</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bereken Uw Vermogen</h2>

          <Accordion title="Type Infraroodpaneel" defaultOpen={true}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="panelType"
                  value="fixed"
                  checked={room.panelType === 'fixed'}
                  onChange={(e) => {
                    handleInputChange(e);
                    // Herstel montage type naar 'wall' als we terug naar vast paneel gaan
                    if (e.target.value === 'fixed') {
                      setRoom(prev => ({ ...prev, mountingType: 'wall' }));
                    }
                  }}
                  className="peer sr-only"
                />
                <div className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-orange-50 transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50">
                  <div className="font-medium text-gray-900">Vast Paneel</div>
                  <div className="text-sm text-gray-500 mt-1">Permanent gemonteerd</div>
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="panelType"
                  value="mobile"
                  checked={room.panelType === 'mobile'}
                  onChange={(e) => {
                    handleInputChange(e);
                    // Reset montage type bij mobiel paneel
                    if (e.target.value === 'mobile') {
                      setRoom(prev => ({ ...prev, mountingType: 'mobile' }));
                    }
                  }}
                  className="peer sr-only"
                />
                <div className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-orange-50 transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50">
                  <div className="font-medium text-gray-900">Mobiel Paneel</div>
                  <div className="text-sm text-gray-500 mt-1">Verplaatsbaar</div>
                </div>
              </label>
            </div>
          </Accordion>

          {room.panelType === 'fixed' && (
            <Accordion title="Montage" defaultOpen={true}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="mountingType"
                    value="wall"
                    checked={room.mountingType === 'wall'}
                    onChange={handleInputChange}
                    className="peer sr-only"
                  />
                  <div className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-orange-50 transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50">
                    <div className="font-medium text-gray-900">Wandmontage</div>
                    <div className="text-sm text-gray-500 mt-1">Meest gebruikt</div>
                  </div>
                </label>

                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="mountingType"
                    value="ceiling"
                    checked={room.mountingType === 'ceiling'}
                    onChange={handleInputChange}
                    className="peer sr-only"
                  />
                  <div className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-orange-50 transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50">
                    <div className="font-medium text-gray-900">Plafondmontage</div>
                    <div className="text-sm text-gray-500 mt-1">Grote ruimtes</div>
                  </div>
                </label>
              </div>
            </Accordion>
          )}
          <Accordion title="Isolatie" defaultOpen={true}>
            <div className="grid grid-cols-1 gap-2">
              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="insulation"
                  value="poor"
                  checked={room.insulation === 'poor'}
                  onChange={handleInputChange}
                  className="peer sr-only"
                />
                <div className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-orange-50 transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50">
                  <div className="font-medium text-gray-900">Slecht geïsoleerd</div>
                  <div className="text-sm text-gray-500 mt-1">Enkel glas, geen/weinig isolatie (voor 1975)</div>
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="insulation"
                  value="medium"
                  checked={room.insulation === 'medium'}
                  onChange={handleInputChange}
                  className="peer sr-only"
                />
                <div className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-orange-50 transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50">
                  <div className="font-medium text-gray-900">Gemiddeld geïsoleerd</div>
                  <div className="text-sm text-gray-500 mt-1">Dubbel glas, basis isolatie (1975-2000)</div>
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input
                  type="radio"
                  name="insulation"
                  value="good"
                  checked={room.insulation === 'good'}
                  onChange={handleInputChange}
                  className="peer sr-only"
                />
                <div className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-orange-50 transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50">
                  <div className="font-medium text-gray-900">Goed geïsoleerd</div>
                  <div className="text-sm text-gray-500 mt-1">HR++ glas, moderne isolatie (na 2000)</div>
                </div>
              </label>
            </div>
          </Accordion>

          <Accordion title="Afmetingen Ruimte" defaultOpen={true}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">Lengte (m)</label>
                  <input
                    type="number"
                    id="length"
                    name="length"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    value={room.length}
                    onChange={(e) => handleInputChange(e)}
                    min="0"
                    step="0.1"
                    placeholder="5.0"
                  />
                </div>

                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">Breedte (m)</label>
                  <input
                    type="number"
                    id="width"
                    name="width"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    value={room.width}
                    onChange={(e) => handleInputChange(e)}
                    min="0"
                    step="0.1"
                    placeholder="4.0"
                  />
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Hoogte (m)</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    value={room.height}
                    onChange={(e) => handleInputChange(e)}
                    min="0"
                    step="0.1"
                    placeholder="2.6"
                  />
                </div>
              </div>
            </div>
          </Accordion>

          <button 
            onClick={handleSubmit}
            className="w-full py-3 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors mt-6"
          >
            Bereken Vermogen
          </button>

          {result && (
            <div className="mt-6 p-4 bg-orange-50 rounded-md">
              <h3 className="text-lg font-semibold mb-3">Resultaat</h3>
              <div className="space-y-2 text-sm">
                <p>Ruimte volume: <span className="font-semibold">{result.volume}m³</span></p>
                <p>Benodigd vermogen: <span className="font-semibold">{result.recommendedPower}W</span></p>
                
                <div className="mt-4">
                  <p className="font-semibold mb-2">Geschatte stroomkosten:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    <li>Verbruik: {result.verbruikPerUur.toFixed(1)} kWh per uur</li>
                    <li>Per uur: {formatCurrency(result.kostenPerUur)}</li>
                    <li>Per dag (bij {8} uur gebruik): {formatCurrency(result.kostenPerDag)}</li>
                    <li>Per maand: {formatCurrency(result.kostenPerMaand)}</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    * Berekend met huidige stroomprijs van {formatCurrency(result.stroomprijs)}/kWh
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-semibold mb-2">Aanbevelingen:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section with Schema.org markup */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Veelgestelde Vragen</h2>
        
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Hoeveel watt per m² infrarood verwarming?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Voor hoofdverwarming is gemiddeld 60-70W/m² nodig bij goede isolatie (na 2000). Bij matige isolatie (1975-2000) is 70-90W/m² nodig, en bij slechte isolatie (voor 1975) 90-120W/m². Voor bijverwarming of specifieke zones zoals werkplekken volstaat vaak 30-50W/m²."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Wat kost 1 uur infrarood verwarming?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Bij een gemiddeld stroomtarief van €0,28 per kWh kost een 1000W paneel €0,28 per uur bij continu gebruik. In de praktijk staat het paneel door de thermostaat ongeveer 50-70% van de tijd aan, wat neerkomt op €0,14-0,20 per uur. Een 600W paneel kost dan €0,08-0,12 per uur."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Hoeveel stroom verbruikt een infraroodpaneel van 1000 watt?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Een 1000W paneel verbruikt exact 1 kWh per uur bij continu gebruik. Door de thermostaat en efficiënte warmteafgifte draait het paneel gemiddeld 5-7 uur per dag, wat resulteert in 5-7 kWh per dag."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Hoeveel watt infrarood paneel boven de bank?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Voor een comfortabele zithoek wordt 350-600W aanbevolen, afhankelijk van de grootte van de bank en ruimte. Een 2-zits bank heeft typisch een 400W paneel nodig, een 3-zits bank 500-600W. Monteer het paneel idealiter op 2-2.5m hoogte voor optimale warmtespreiding."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Wat kost een infrarood kachel van 2000 watt per uur?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Bij een stroomtarief van €0,28/kWh kost een 2000W paneel €0,56 per uur bij continu gebruik. In praktijk, met thermostaat, komt dit neer op €0,28-0,39 per uur. Per dag, met 6 uur gebruik, zijn de kosten €1,68-2,34."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Wat is infraroodverwarming?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Infraroodverwarming is een vorm van elektrische verwarming die warmte afgeeft via infraroodstraling. Deze straling wordt direct geabsorbeerd door objecten en personen in de ruimte, vergelijkbaar met de warmte van de zon. Dit maakt het een zeer efficiënte en comfortabele manier van verwarmen."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Wat zijn de voordelen van infraroodverwarming?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Direct warmtegevoel, geen opwarmtijd nodig, energiezuinig door directe warmteoverdracht, geen onderhoud nodig, geen leidingen of ketels nodig, geschikt voor lokale verwarming, geen luchtcirculatie, ideaal voor allergieën."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Waar kan ik infraroodpanelen plaatsen?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Infraroodpanelen kunnen vrijwel overal worden geplaatst. Vaste panelen worden meestal aan de wand of het plafond gemonteerd. Voor optimaal effect is het belangrijk dat het paneel vrij zicht heeft op het te verwarmen gebied. Mobiele panelen zijn flexibel te plaatsen waar warmte nodig is."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Hoeveel kost infraroodverwarming?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "De kosten van infraroodverwarming bestaan uit: Aanschaf panelen: €200-€600 per paneel, Installatiekosten: €50-€100 per paneel, Energiekosten: Afhankelijk van gebruik en isolatie."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is infraroodverwarming geschikt als hoofdverwarming?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Infraroodverwarming kan als hoofdverwarming dienen in goed geïsoleerde ruimtes (energielabel B of hoger). Voor oudere, minder goed geïsoleerde woningen is het vaak beter om infraroodverwarming te combineren met andere verwarmingsbronnen of eerst de isolatie te verbeteren."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is infrarood goedkoper dan gas?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Bij huidige energieprijzen (gas €1,45/m³, stroom €0,28/kWh) en een moderne CV-ketel (HR) is infrarood ongeveer gelijkwaardig aan gas voor volledige ruimteverwarming. Voor bijverwarming of specifieke zones kan infrarood voordeliger zijn omdat je alleen verwarmt waar nodig. Ook zijn de aanschaf- en installatiekosten vaak lager dan een gasinstallatie."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is infrarood zuiniger dan elektrisch?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Infrarood is 30-50% zuiniger dan traditionele elektrische convectie verwarming omdat het direct objecten en personen verwarmt in plaats van de lucht. Ook bereik je sneller een comfortabel gevoel, waardoor de thermostaat lager kan. Bij spot-verwarming kan het verschil oplopen tot 60%."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Wat kost een infrarood kachel per dag?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Een gemiddeld 600W paneel dat 6 uur per dag draait, verbruikt ongeveer 3.6 kWh per dag. Bij €0,28/kWh kost dit €1,01 per dag. Een 1000W paneel kost onder dezelfde condities ongeveer €1,68 per dag. Het werkelijke verbruik is vaak lager door de thermostaat."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Hoeveel watt warmte per m²?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "De warmtebehoefte varieert sterk met isolatie en gebruik. Voor woonruimtes geldt: 60-120W/m² voor hoofdverwarming, afhankelijk van isolatie. Badkamers hebben vaak meer nodig: 100-150W/m². Voor bijverwarming of werkplekken volstaat 30-50W/m²."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Wat verbruikt een infraroodpaneel aan stroom?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Het stroomverbruik is gelijk aan het vermogen: een 600W paneel verbruikt 0.6 kWh per uur, een 1000W paneel 1 kWh per uur. Door de thermostaat draait een paneel gemiddeld 50-70% van de tijd, dus een 600W paneel verbruikt effectief 7-10 kWh per dag bij 24-uurs verwarming."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Wat verbruikt een infraroodpaneel per uur?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Een 600W paneel verbruikt 0.6 kWh per uur (€0,17 bij €0,28/kWh). Een 1000W paneel verbruikt 1 kWh per uur (€0,28). Een 2000W paneel verbruikt 2 kWh per uur (€0,56). In praktijk is het verbruik 30-50% lager door de thermostaat."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Hoeveel watt infrarood paneel boven werkplek?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Voor een comfortabele werkplek is meestal 350-500W voldoende. Monteer het paneel 1-1.5m boven het bureau voor optimale warmteverdeling. Bij een grotere werkplek of slechte isolatie kan een 600W paneel nodig zijn."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Hoeveel watt infrarood heb je nodig voor een woonkamer?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Voor een gemiddelde woonkamer van 30m² is bij goede isolatie ongeveer 1800-2100W nodig (60-70W/m²). Bij matige isolatie 2100-2700W (70-90W/m²) en bij slechte isolatie 2700-3600W (90-120W/m²). Verdeel dit over meerdere panelen voor optimale warmtespreiding."
                  }
                }
              ]
            }
          `}
        </script>
        
        <div className="space-y-2">
          <Accordion title="Hoeveel watt per m² infrarood verwarming?">
            <p className="text-gray-600">
              Voor hoofdverwarming is gemiddeld 60-70W/m² nodig bij goede isolatie (na 2000). Bij matige isolatie (1975-2000) 
              is 70-90W/m² nodig, en bij slechte isolatie (voor 1975) 90-120W/m². Voor bijverwarming of specifieke zones zoals 
              werkplekken volstaat vaak 30-50W/m².
            </p>
          </Accordion>

          <Accordion title="Wat kost 1 uur infrarood verwarming?">
            <p className="text-gray-600">
              Bij een gemiddeld stroomtarief van €0,28 per kWh kost een 1000W paneel €0,28 per uur bij continu gebruik. 
              In de praktijk staat het paneel door de thermostaat ongeveer 50-70% van de tijd aan, wat neerkomt op €0,14-0,20 
              per uur. Een 600W paneel kost dan €0,08-0,12 per uur.
            </p>
          </Accordion>

          <Accordion title="Hoeveel stroom verbruikt een infraroodpaneel van 1000 watt?">
            <p className="text-gray-600">
              Een 1000W paneel verbruikt exact 1 kWh per uur bij continu gebruik. Door de thermostaat en efficiënte 
              warmteafgifte draait het paneel gemiddeld 5-7 uur per dag, wat resulteert in 5-7 kWh per dag.
            </p>
          </Accordion>

          <Accordion title="Hoeveel watt infrarood paneel boven de bank?">
            <p className="text-gray-600">
              Voor een comfortabele zithoek wordt 350-600W aanbevolen, afhankelijk van de grootte van de bank en ruimte. 
              Een 2-zits bank heeft typisch een 400W paneel nodig, een 3-zits bank 500-600W. Monteer het paneel idealiter 
              op 2-2.5m hoogte voor optimale warmtespreiding.
            </p>
          </Accordion>

          <Accordion title="Wat kost een infrarood kachel van 2000 watt per uur?">
            <p className="text-gray-600">
              Bij een stroomtarief van €0,28/kWh kost een 2000W paneel €0,56 per uur bij continu gebruik. In praktijk, 
              met thermostaat, komt dit neer op €0,28-0,39 per uur. Per dag, met 6 uur gebruik, zijn de kosten €1,68-2,34.
            </p>
          </Accordion>

          <Accordion title="Wat is infraroodverwarming?">
            <p className="text-gray-700">
              Infraroodverwarming is een vorm van elektrische verwarming die warmte afgeeft via infraroodstraling. 
              Deze straling wordt direct geabsorbeerd door objecten en personen in de ruimte, vergelijkbaar met de warmte van de zon. 
              Dit maakt het een zeer efficiënte en comfortabele manier van verwarmen.
            </p>
          </Accordion>

          <Accordion title="Wat zijn de voordelen van infraroodverwarming?">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Direct warmtegevoel, geen opwarmtijd nodig</li>
              <li>Energiezuinig door directe warmteoverdracht</li>
              <li>Geen onderhoud nodig</li>
              <li>Geen leidingen of ketels nodig</li>
              <li>Geschikt voor lokale verwarming</li>
              <li>Geen luchtcirculatie, ideaal voor allergieën</li>
            </ul>
          </Accordion>

          <Accordion title="Waar kan ik infraroodpanelen plaatsen?">
            <p className="text-gray-700">
              Infraroodpanelen kunnen vrijwel overal worden geplaatst. Vaste panelen worden meestal aan de wand of het plafond 
              gemonteerd. Voor optimaal effect is het belangrijk dat het paneel vrij zicht heeft op het te verwarmen gebied. 
              Mobiele panelen zijn flexibel te plaatsen waar warmte nodig is.
            </p>
          </Accordion>

          <Accordion title="Hoeveel kost infraroodverwarming?">
            <div className="space-y-2 text-gray-700">
              <p>De kosten van infraroodverwarming bestaan uit:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Aanschaf panelen: €200-€600 per paneel</li>
                <li>Installatiekosten: €50-€100 per paneel</li>
                <li>Energiekosten: Afhankelijk van gebruik en isolatie</li>
              </ul>
              <p className="mt-2">
                De exacte kosten hangen af van uw specifieke situatie en kunnen het beste door een specialist worden berekend.
              </p>
            </div>
          </Accordion>

          <Accordion title="Is infraroodverwarming geschikt als hoofdverwarming?">
            <p className="text-gray-700">
              Infraroodverwarming kan als hoofdverwarming dienen in goed geïsoleerde ruimtes (energielabel B of hoger). 
              Voor oudere, minder goed geïsoleerde woningen is het vaak beter om infraroodverwarming te combineren met andere 
              verwarmingsbronnen of eerst de isolatie te verbeteren.
            </p>
          </Accordion>

          <Accordion title="Is infrarood goedkoper dan gas?">
            <p className="text-gray-600">
              Bij huidige energieprijzen (gas €1,45/m³, stroom €0,28/kWh) en een moderne CV-ketel (HR) is infrarood ongeveer 
              gelijkwaardig aan gas voor volledige ruimteverwarming. Echter, voor bijverwarming of specifieke zones kan 
              infrarood voordeliger zijn omdat je alleen verwarmt waar nodig. Ook zijn de aanschaf- en installatiekosten 
              vaak lager dan een gasinstallatie.
            </p>
          </Accordion>

          <Accordion title="Is infrarood zuiniger dan elektrisch?">
            <p className="text-gray-600">
              Infrarood is 30-50% zuiniger dan traditionele elektrische convectie verwarming omdat het direct objecten en 
              personen verwarmt in plaats van de lucht. Ook bereik je sneller een comfortabel gevoel, waardoor de thermostaat 
              lager kan. Bij spot-verwarming kan het verschil oplopen tot 60%.
            </p>
          </Accordion>

          <Accordion title="Wat kost een infrarood kachel per dag?">
            <p className="text-gray-600">
              Een gemiddeld 600W paneel dat 6 uur per dag draait, verbruikt ongeveer 3.6 kWh per dag. Bij €0,28/kWh 
              kost dit €1,01 per dag. Een 1000W paneel kost onder dezelfde condities ongeveer €1,68 per dag. Het werkelijke 
              verbruik is vaak lager door de thermostaat.
            </p>
          </Accordion>

          <Accordion title="Hoeveel watt warmte per m²?">
            <p className="text-gray-600">
              De warmtebehoefte varieert sterk met isolatie en gebruik. Voor woonruimtes geldt: 60-120W/m² voor 
              hoofdverwarming, afhankelijk van isolatie. Badkamers hebben vaak meer nodig: 100-150W/m². Voor bijverwarming 
              of werkplekken volstaat 30-50W/m².
            </p>
          </Accordion>

          <Accordion title="Wat verbruikt een infraroodpaneel aan stroom?">
            <p className="text-gray-600">
              Het stroomverbruik is gelijk aan het vermogen: een 600W paneel verbruikt 0.6 kWh per uur, een 1000W paneel 
              1 kWh per uur. Door de thermostaat draait een paneel gemiddeld 50-70% van de tijd, dus een 600W paneel 
              verbruikt effectief 7-10 kWh per dag bij 24-uurs verwarming.
            </p>
          </Accordion>

          <Accordion title="Wat verbruikt een infraroodpaneel per uur?">
            <p className="text-gray-600">
              Een 600W paneel verbruikt 0.6 kWh per uur (€0,17 bij €0,28/kWh).
              Een 1000W paneel verbruikt 1 kWh per uur (€0,28).
              Een 2000W paneel verbruikt 2 kWh per uur (€0,56).
              In praktijk is het verbruik 30-50% lager door de thermostaat.
            </p>
          </Accordion>

          <Accordion title="Hoeveel watt infrarood paneel boven werkplek?">
            <p className="text-gray-600">
              Voor een comfortabele werkplek is meestal 350-500W voldoende. Monteer het paneel 1-1.5m boven het bureau 
              voor optimale warmteverdeling. Bij een grotere werkplek of slechte isolatie kan een 600W paneel nodig zijn.
            </p>
          </Accordion>

          <Accordion title="Hoeveel watt infrarood heb je nodig voor een woonkamer?">
            <p className="text-gray-600">
              Voor een gemiddelde woonkamer van 30m² is bij goede isolatie ongeveer 1800-2100W nodig (60-70W/m²). Bij matige 
              isolatie 2100-2700W (70-90W/m²) en bij slechte isolatie 2700-3600W (90-120W/m²). Verdeel dit over meerdere 
              panelen voor optimale warmtespreiding.
            </p>
          </Accordion>
        </div>
      </div>

      {/* Footer met extra informatie */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Over Infrarood Verwarming</h3>
              <p className="text-gray-600">
                Infrarood verwarming is een moderne en duurzame manier van verwarmen die steeds 
                populairder wordt in Nederlandse woningen. Door gebruik te maken van stralingswarmte 
                wordt energie efficiënt omgezet in aangename warmte, vergelijkbaar met de zon.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Duurzaamheid</h3>
              <p className="text-gray-600">
                In combinatie met groene stroom en goede isolatie is infrarood verwarming een 
                milieuvriendelijke verwarmingsoptie. Het past perfect in het streven naar 
                gasloze woningen en kan bijdragen aan het verlagen van uw energierekening.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App
