import React, { useState } from 'react';

interface SubsidieRegeling {
  naam: string;
  beschrijving: string;
  voorwaarden: string[];
  bedrag: string;
  link: string;
}

const SubsidieCheck: React.FC = () => {
  const [woningType, setWoningType] = useState<string>('');
  const [bouwjaar, setBouwjaar] = useState<string>('');
  const [eigendomType, setEigendomType] = useState<string>('');
  const [energielabel, setEnergielabel] = useState<string>('');

  const subsidies: SubsidieRegeling[] = [
    {
      naam: "ISDE - Investeringssubsidie duurzame energie",
      beschrijving: "Subsidie voor de aanschaf van infraroodpanelen als onderdeel van een isolatiepakket.",
      voorwaarden: [
        "Minimaal 2 isolatiemaatregelen",
        "Eigenaar én bewoner van de woning",
        "Installatie door een erkend bedrijf"
      ],
      bedrag: "Tot €3.000 per woning",
      link: "https://www.rvo.nl/subsidies-financiering/isde"
    },
    {
      naam: "Energiebespaarlening",
      beschrijving: "Lening met lage rente voor energiebesparende maatregelen.",
      voorwaarden: [
        "Eigenaar van de woning",
        "Woning als hoofdverblijf",
        "Goedgekeurd bestedingsdoel"
      ],
      bedrag: "€2.500 tot €65.000",
      link: "https://www.energiebespaarlening.nl/"
    },
    {
      naam: "Gemeentelijke subsidie",
      beschrijving: "Lokale subsidies voor verduurzaming van woningen.",
      voorwaarden: [
        "Afhankelijk van gemeente",
        "Meestal voor eigenaar-bewoners",
        "Vaak in combinatie met andere maatregelen"
      ],
      bedrag: "Verschilt per gemeente",
      link: "https://www.verbeterjehuis.nl/energiesubsidiewijzer/"
    }
  ];

  const checkSubsidies = () => {
    let beschikbareSubsidies = [...subsidies];

    // Filter based on conditions
    if (eigendomType !== 'eigenaar-bewoner') {
      beschikbareSubsidies = beschikbareSubsidies.filter(s => 
        !s.voorwaarden.some(v => v.includes('Eigenaar')));
    }

    // Add specific conditions based on user input
    if (bouwjaar && parseInt(bouwjaar) > 2020) {
      beschikbareSubsidies = beschikbareSubsidies.filter(s => s.naam !== "ISDE");
    }

    return beschikbareSubsidies;
  };

  const beschikbareSubsidies = checkSubsidies();

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8">
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
        Subsidie Check
      </h2>

      <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type woning
            </label>
            <select
              value={woningType}
              onChange={(e) => setWoningType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">Selecteer type woning</option>
              <option value="tussenwoning">Tussenwoning</option>
              <option value="hoekwoning">Hoekwoning</option>
              <option value="vrijstaand">Vrijstaande woning</option>
              <option value="appartement">Appartement</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bouwjaar
            </label>
            <input
              type="number"
              value={bouwjaar}
              onChange={(e) => setBouwjaar(e.target.value)}
              placeholder="Bijv. 1980"
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eigendom
            </label>
            <select
              value={eigendomType}
              onChange={(e) => setEigendomType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">Selecteer eigendom</option>
              <option value="eigenaar-bewoner">Eigenaar-bewoner</option>
              <option value="huurder">Huurder</option>
              <option value="vve">VvE</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Energielabel
            </label>
            <select
              value={energielabel}
              onChange={(e) => setEnergielabel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">Selecteer energielabel</option>
              <option value="A">Label A</option>
              <option value="B">Label B</option>
              <option value="C">Label C</option>
              <option value="D">Label D</option>
              <option value="E">Label E</option>
              <option value="F">Label F</option>
              <option value="G">Label G</option>
            </select>
          </div>
        </div>

        <div className="space-y-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-800">Beschikbare Subsidies</h3>
          
          {beschikbareSubsidies.map((subsidie, index) => (
            <div key={index} className="bg-white/80 rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-blue-600 mb-2">
                {subsidie.naam}
              </h4>
              <p className="text-gray-600 mb-4">{subsidie.beschrijving}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Voorwaarden:</h5>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {subsidie.voorwaarden.map((voorwaarde, vIndex) => (
                      <li key={vIndex}>{voorwaarde}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Subsidiebedrag:</h5>
                  <p className="text-green-600 font-semibold">{subsidie.bedrag}</p>
                  <a
                    href={subsidie.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Meer informatie →
                  </a>
                </div>
              </div>
            </div>
          ))}

          {beschikbareSubsidies.length === 0 && (
            <div className="bg-yellow-50/80 rounded-xl p-6">
              <p className="text-yellow-800">
                Op basis van de ingevulde gegevens zijn er geen directe subsidies gevonden. 
                Neem contact op met uw gemeente voor lokale regelingen of raadpleeg een energieadviseur 
                voor persoonlijk advies.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50/80 rounded-xl">
          <h4 className="font-semibold text-blue-900 mb-3">Tips voor subsidieaanvraag</h4>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>Vraag de subsidie aan vóórdat u begint met de werkzaamheden</li>
            <li>Bewaar alle offertes en facturen zorgvuldig</li>
            <li>Controleer of uw installateur voldoet aan de gestelde eisen</li>
            <li>Combineer verschillende maatregelen voor maximaal voordeel</li>
          </ul>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          * Deze subsidiecheck is een indicatie. Subsidieregelingen kunnen wijzigen en zijn vaak 
          afhankelijk van specifieke voorwaarden. Raadpleeg altijd de officiële websites voor de 
          meest actuele informatie.
        </p>
      </div>
    </div>
  );
};

export default SubsidieCheck;
