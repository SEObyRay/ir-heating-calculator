import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CO2Vergelijking: React.FC = () => {
  const [jaarlijksVerbruik, setJaarlijksVerbruik] = useState<number>(1500);
  const [stroomMix, setStroomMix] = useState<'grijs' | 'groen'>('grijs');

  // CO2 uitstoot factoren (kg CO2 per eenheid)
  const CO2_FACTOREN = {
    gas: 1.884, // kg CO2 per m3 gas
    stroomGrijs: 0.475, // kg CO2 per kWh grijze stroom
    stroomGroen: 0.075, // kg CO2 per kWh groene stroom
    warmtepomp: 0.158, // kg CO2 per kWh (COP 3)
  };

  const berekenCO2Uitstoot = () => {
    // Gas (m3 naar CO2)
    const gasUitstoot = jaarlijksVerbruik * CO2_FACTOREN.gas;

    // IR Verwarming (kWh naar CO2)
    // Aanname: 1m3 gas ≈ 9 kWh
    const kwhVerbruik = jaarlijksVerbruik * 9;
    const irUitstoot = kwhVerbruik * (stroomMix === 'grijs' ? CO2_FACTOREN.stroomGrijs : CO2_FACTOREN.stroomGroen);

    // Warmtepomp (kWh naar CO2)
    const warmtepompVerbruik = kwhVerbruik / 3; // COP van 3
    const warmtepompUitstoot = warmtepompVerbruik * (stroomMix === 'grijs' ? CO2_FACTOREN.stroomGrijs : CO2_FACTOREN.stroomGroen);

    return {
      gasUitstoot,
      irUitstoot,
      warmtepompUitstoot,
      besparing: gasUitstoot - irUitstoot
    };
  };

  const resultaat = berekenCO2Uitstoot();

  const chartData = [
    {
      name: 'CV-ketel (gas)',
      CO2: Math.round(resultaat.gasUitstoot),
      kleur: '#ef4444'
    },
    {
      name: 'IR Verwarming',
      CO2: Math.round(resultaat.irUitstoot),
      kleur: '#3b82f6'
    },
    {
      name: 'Warmtepomp',
      CO2: Math.round(resultaat.warmtepompUitstoot),
      kleur: '#22c55e'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8">
      <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
        CO₂-uitstoot Vergelijking
      </h2>

      <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jaarlijks gasverbruik (m³)
            </label>
            <input
              type="number"
              value={jaarlijksVerbruik}
              onChange={(e) => setJaarlijksVerbruik(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type stroom
            </label>
            <select
              value={stroomMix}
              onChange={(e) => setStroomMix(e.target.value as 'grijs' | 'groen')}
              className="w-full px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="grijs">Grijze stroom</option>
              <option value="groen">Groene stroom</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm text-gray-500">CO₂-uitstoot gas</p>
            <p className="text-2xl font-semibold text-red-600">
              {Math.round(resultaat.gasUitstoot)} kg/jaar
            </p>
          </div>

          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm text-gray-500">CO₂-uitstoot IR</p>
            <p className="text-2xl font-semibold text-blue-600">
              {Math.round(resultaat.irUitstoot)} kg/jaar
            </p>
          </div>

          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm text-gray-500">CO₂-uitstoot warmtepomp</p>
            <p className="text-2xl font-semibold text-green-600">
              {Math.round(resultaat.warmtepompUitstoot)} kg/jaar
            </p>
          </div>

          <div className="p-4 bg-white/80 rounded-xl">
            <p className="text-sm text-gray-500">Mogelijke CO₂ besparing</p>
            <p className="text-2xl font-semibold text-green-600">
              {Math.round(resultaat.besparing)} kg/jaar
            </p>
          </div>
        </div>

        <div className="h-[400px] mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'kg CO₂ per jaar', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="CO2" name="CO₂-uitstoot" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 p-4 bg-blue-50/80 rounded-xl">
          <h4 className="font-semibold text-blue-900 mb-3">Wist u dat?</h4>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>Een gemiddeld huishouden stoot jaarlijks ongeveer 3.000 kg CO₂ uit door gasverbruik</li>
            <li>Door over te stappen op groene stroom kan de CO₂-uitstoot van IR verwarming tot wel 85% lager zijn</li>
            <li>Het planten van één boom compenseert ongeveer 25 kg CO₂ per jaar</li>
            <li>De gemiddelde Nederlander heeft een totale CO₂-voetafdruk van 8.600 kg per jaar</li>
          </ul>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          * Berekeningen gebaseerd op gemiddelde emissiefactoren. Werkelijke uitstoot kan variëren afhankelijk van 
          specifieke omstandigheden en de bron van uw elektriciteit.
        </p>
      </div>
    </div>
  );
};

export default CO2Vergelijking;
