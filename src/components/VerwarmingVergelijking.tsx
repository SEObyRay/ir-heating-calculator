import React from 'react';

const VerwarmingVergelijking: React.FC = () => {
  const verwarmingsTypes = [
    {
      naam: 'Infrarood verwarming',
      voordelen: [
        'Direct warmtegevoel',
        'Geen onderhoud nodig',
        'Zonegericht verwarmen',
        'Geen leidingwerk nodig'
      ],
      nadelen: [
        'Hogere aanschafkosten',
        'Afhankelijk van stroomprijs'
      ],
      gemiddeldVerbruik: '50-60W per m³',
      installatieKosten: '€500 - €1000 per paneel',
      rendement: '98%',
      levensduur: '20-30 jaar',
      icon: '🌡️'
    },
    {
      naam: 'Warmtepomp',
      voordelen: [
        'Zeer energiezuinig',
        'Kan ook koelen',
        'Duurzame oplossing',
        'Lage verbruikskosten'
      ],
      nadelen: [
        'Hoge aanschafkosten',
        'Buitenunit nodig',
        'Complexe installatie'
      ],
      gemiddeldVerbruik: 'COP 3-5',
      installatieKosten: '€8000 - €15000',
      rendement: '300-500%',
      levensduur: '15-20 jaar',
      icon: '♨️'
    },
    {
      naam: 'CV-ketel (gas)',
      voordelen: [
        'Bekend systeem',
        'Snelle opwarming',
        'Betrouwbaar',
        'Lagere aanschafkosten'
      ],
      nadelen: [
        'Fossiele brandstof',
        'CO2-uitstoot',
        'Gasprijs stijgt',
        'Onderhoud nodig'
      ],
      gemiddeldVerbruik: '1500-2000m³ gas/jaar',
      installatieKosten: '€2000 - €3000',
      rendement: '90-95%',
      levensduur: '15 jaar',
      icon: '🔥'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8">
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
        Vergelijk verwarmingssystemen
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {verwarmingsTypes.map((type, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-200"
          >
            <div className="text-4xl mb-4 text-center">{type.icon}</div>
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">{type.naam}</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-600 mb-2">Voordelen</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {type.voordelen.map((voordeel, i) => (
                    <li key={i}>{voordeel}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-red-600 mb-2">Nadelen</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {type.nadelen.map((nadeel, i) => (
                    <li key={i}>{nadeel}</li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Verbruik</p>
                    <p className="font-medium text-gray-800">{type.gemiddeldVerbruik}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Rendement</p>
                    <p className="font-medium text-gray-800">{type.rendement}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Installatie</p>
                    <p className="font-medium text-gray-800">{type.installatieKosten}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Levensduur</p>
                    <p className="font-medium text-gray-800">{type.levensduur}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerwarmingVergelijking;
