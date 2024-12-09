import React, { useState } from 'react';
import { useStroomprijs } from '../context/StroomprijsContext';

const Besparing: React.FC = () => {
  const { stroomprijs } = useStroomprijs();
  const [huidigGasverbruik, setHuidigGasverbruik] = useState<number>(1500);
  const [gasPrijs, setGasPrijs] = useState<number>(1.50);
  const [oppervlakte, setOppervlakte] = useState<number>(100);

  const berekenBesparing = () => {
    // Huidige gaskosten per jaar
    const huidigeKosten = huidigGasverbruik * gasPrijs;
    
    // Geschat verbruik infrarood (50W per m² gemiddeld, 8 uur per dag)
    const irVerbruikPerDag = (oppervlakte * 50 * 8) / 1000; // in kWh
    const irKostenPerJaar = irVerbruikPerDag * 365 * stroomprijs;
    
    // Besparing
    const besparing = huidigeKosten - irKostenPerJaar;
    const besparingPercentage = (besparing / huidigeKosten) * 100;
    
    return {
      huidigeKosten,
      nieuweKosten: irKostenPerJaar,
      besparing,
      besparingPercentage
    };
  };

  const resultaat = berekenBesparing();

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8">
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
        Bereken uw mogelijke besparing
      </h2>

      <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Huidig gasverbruik (m³/jaar)
            </label>
            <input
              type="number"
              value={huidigGasverbruik}
              onChange={(e) => setHuidigGasverbruik(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gasprijs (€/m³)
            </label>
            <input
              type="number"
              step="0.01"
              value={gasPrijs}
              onChange={(e) => setGasPrijs(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Oppervlakte (m²)
            </label>
            <input
              type="number"
              value={oppervlakte}
              onChange={(e) => setOppervlakte(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm text-gray-500">Huidige kosten per jaar</p>
            <p className="text-2xl font-semibold text-gray-800">
              €{resultaat.huidigeKosten.toFixed(2)}
            </p>
          </div>

          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm text-gray-500">IR verwarming kosten per jaar</p>
            <p className="text-2xl font-semibold text-gray-800">
              €{resultaat.nieuweKosten.toFixed(2)}
            </p>
          </div>

          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm text-gray-500">Mogelijke besparing per jaar</p>
            <p className="text-2xl font-semibold text-green-600">
              €{resultaat.besparing.toFixed(2)}
            </p>
          </div>

          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm text-gray-500">Besparingspercentage</p>
            <p className="text-2xl font-semibold text-green-600">
              {resultaat.besparingPercentage.toFixed(1)}%
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          * Berekening gebaseerd op huidige energieprijzen en gemiddeld gebruik. De werkelijke besparing kan variëren afhankelijk van uw specifieke situatie.
        </p>
      </div>
    </div>
  );
};

export default Besparing;
