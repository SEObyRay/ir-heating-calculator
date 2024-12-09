'use client';

import Calculator from '../components/Calculator';
import FAQ from '../components/FAQ';
import VerwarmingVergelijking from '../components/VerwarmingVergelijking';
import Besparing from '../components/Besparing';
import ROICalculator from '../components/ROICalculator';
import CO2Vergelijking from '../components/CO2Vergelijking';
import SubsidieCheck from '../components/SubsidieCheck';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Calculator />
        <Besparing />
        <VerwarmingVergelijking />
        <FAQ />
      </div>
    </main>
  );
}
