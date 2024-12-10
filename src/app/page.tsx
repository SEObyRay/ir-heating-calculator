'use client';

import React from 'react';
import Calculator from '../components/Calculator';
import FAQ from '../components/FAQ';
import VerwarmingVergelijking from '../components/VerwarmingVergelijking';
import Besparing from '../components/Besparing';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
          Infrarood Verwarming Calculator
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Bereken het benodigde vermogen en kosten voor uw infrarood panelen. 
          Ontdek hoeveel watt u nodig heeft voor efficiënte verwarming.
        </p>
        <Calculator />
        <Besparing />
        <VerwarmingVergelijking />
        <FAQ />
      </div>
    </main>
  );
}
