import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStroomprijs } from '../context/StroomprijsContext';

const ROICalculator: React.FC = () => {
  const { stroomprijs } = useStroomprijs();
  const [aanschafKosten, setAanschafKosten] = useState<number>(3000);
  const [installatieKosten, setInstallatieKosten] = useState<number>(500);
  const [jaarlijkseBesparing, setJaarlijkseBesparing] = useState<number>(800);
  const [subsidie, setSubsidie] = useState<number>(500);

  const berekenROI = () => {
    const totaleInvestering = aanschafKosten + installatieKosten - subsidie;
    const terugverdientijd = totaleInvestering / jaarlijkseBesparing;
    
    // Genereer data voor grafiek (10 jaar)
    const data = Array.from({ length: 121 }, (_, i) => {
      const maand = i;
      const besparing = (jaarlijkseBesparing / 12) * maand;
      const nettoResultaat = besparing - totaleInvestering;
      
      return {
        maand: `Maand ${maand}`,
        besparing,
        nettoResultaat,
        investering: -totaleInvestering
      };
    });

    return {
      terugverdientijd,
      totaleInvestering,
      data
    };
  };

  const resultaat = berekenROI();
  const breakEvenMaand = Math.ceil(resultaat.terugverdientijd * 12);

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8">
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
        Return on Investment Calculator
      </h2>

      <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aanschafkosten IR panelen (€)
            </label>
            <input
              type="number"
              value={aanschafKosten}
              onChange={(e) => setAanschafKosten(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Installatiekosten (€)
            </label>
            <input
              type="number"
              value={installatieKosten}
              onChange={(e) => setInstallatieKosten(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verwachte jaarlijkse besparing (€)
            </label>
            <input
              type="number"
              value={jaarlijkseBesparing}
              onChange={(e) => setJaarlijkseBesparing(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subsidie (€)
            </label>
            <input
              type="number"
              value={subsidie}
              onChange={(e) => setSubsidie(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm text-gray-500">Totale investering</p>
            <p className="text-2xl font-semibold text-gray-800">
              €{resultaat.totaleInvestering.toFixed(2)}
            </p>
          </div>

          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm text-gray-500">Terugverdientijd</p>
            <p className="text-2xl font-semibold text-gray-800">
              {resultaat.terugverdientijd.toFixed(1)} jaar
            </p>
          </div>

          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm text-gray-500">Break-even punt</p>
            <p className="text-2xl font-semibold text-green-600">
              Maand {breakEvenMaand}
            </p>
          </div>
        </div>

        <div className="h-[400px] mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={resultaat.data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="maand" interval={12} />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="investering"
                stroke="#ef4444"
                fill="#fee2e2"
                name="Investering"
              />
              <Area
                type="monotone"
                dataKey="nettoResultaat"
                stroke="#22c55e"
                fill="#dcfce7"
                name="Netto resultaat"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          * Deze berekening is een indicatie en kan afwijken van de werkelijke situatie. 
          Factoren zoals energieprijzen en gebruikspatronen kunnen de terugverdientijd beïnvloeden.
        </p>
      </div>
    </div>
  );
};

export default ROICalculator;
