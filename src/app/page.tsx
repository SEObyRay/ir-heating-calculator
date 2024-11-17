import Calculator from '@/components/Calculator';
import FAQ from '@/components/FAQ';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Infrarood Verwarming Calculator | Bereken Vermogen & Kosten',
  description: 'Bereken gratis het benodigde vermogen voor uw infrarood verwarming. Professioneel advies voor hoofdverwarming en bijverwarming. Inclusief energiebesparing tips.',
  keywords: 'infrarood verwarming, IR panelen, vermogen berekenen, energiebesparing, duurzame verwarming, elektrische verwarming, infrarood calculator',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Infrarood Verwarming Calculator
          </h1>
          <p className="text-xl mb-8 max-w-2xl">
            Bereken snel en nauwkeurig het benodigde vermogen voor uw infrarood verwarming. 
            Ontwikkeld door experts voor zowel hoofdverwarming als bijverwarming.
          </p>
          <div className="bg-white/10 p-4 rounded-lg inline-block">
            <p className="text-lg">✓ Gratis professioneel advies</p>
            <p className="text-lg">✓ Gebaseerd op Nederlandse normen</p>
            <p className="text-lg">✓ Inclusief energiebesparingsadvies</p>
          </div>
        </div>
      </section>

      {/* Expert Introduction */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Expert Advies voor Infrarood Verwarming</h2>
            <p className="text-gray-700 mb-4">
              Deze calculator is ontwikkeld in samenwerking met ervaren HVAC-specialisten en energieadviseurs. 
              Wij combineren meer dan 15 jaar ervaring in duurzame verwarmingssystemen met de laatste technische inzichten.
            </p>
            <p className="text-gray-700">
              Onze berekeningen zijn gebaseerd op Nederlandse bouwnormen en klimaatgegevens, 
              waardoor u een nauwkeurig en betrouwbaar advies krijgt voor uw specifieke situatie.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 bg-gray-50" id="calculator">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Bereken Uw Infrarood Verwarming
          </h2>
          <Calculator />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Voordelen van Infrarood Verwarming
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Energiezuinig</h3>
              <p className="text-gray-700">
                Infrarood verwarming zet 98% van de elektriciteit om in warmte. 
                In combinatie met zonnepanelen is het een zeer duurzame oplossing.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Gezond Binnenklimaat</h3>
              <p className="text-gray-700">
                Door directe warmtestraling ontstaat er minder luchtcirculatie, 
                wat resulteert in minder stofverspreiding en een aangenamer binnenklimaat.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Onderhoudsvrij</h3>
              <p className="text-gray-700">
                Infrarood panelen hebben geen bewegende delen en vereisen vrijwel geen onderhoud. 
                De levensduur is gemiddeld 20-25 jaar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Information */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Technische Informatie
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Hoofdverwarming</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Gemiddeld benodigd vermogen: 30-40 watt per m³</li>
                <li>Opwarmtijd: ongeveer 3 graden per uur</li>
                <li>Aanbevolen plafondhoogte: 2.4 - 3.5 meter</li>
                <li>Optimale isolatiewaarde: Rc ≥ 2.5</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Bijverwarming</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Gemiddeld benodigd vermogen: 120-150 watt per m²</li>
                <li>Opwarmtijd: 20-30 minuten</li>
                <li>Ideale montagehoogte: 1.8 - 2.5 meter</li>
                <li>Effectieve stralingshoek: 120-160 graden</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Energy Savings Tips */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Energiebesparingstips
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Optimalisatie Tips</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Gebruik een slimme thermostaat met zonering</li>
                <li>Installeer bewegingssensoren voor automatische bediening</li>
                <li>Combineer met zonnepanelen voor maximale duurzaamheid</li>
                <li>Plaats panelen strategisch voor optimale warmteverdeling</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Isolatie Adviezen</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Controleer en verbeter raam- en deurisolatie</li>
                <li>Overweeg HR++ of triple glas voor maximaal rendement</li>
                <li>Installeer tochtstrips en deurdrempels</li>
                <li>Isoleer de spouwmuur indien mogelijk</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-8">
            Waarom Deze Calculator?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-semibold mb-2">Expert Ontwikkeld</h3>
              <p className="text-gray-700">Door HVAC-specialisten</p>
            </div>
            <div>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold mb-2">Nauwkeurig</h3>
              <p className="text-gray-700">Gebaseerd op NEN-normen</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="font-semibold mb-2">Actueel</h3>
              <p className="text-gray-700">Regelmatig geüpdatet</p>
            </div>
            <div>
              <div className="text-4xl mb-4">💡</div>
              <h3 className="font-semibold mb-2">Praktisch</h3>
              <p className="text-gray-700">Direct toepasbaar advies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Hulp Nodig?
          </h2>
          <p className="text-gray-700 mb-6">
            Heeft u vragen over de berekening of wilt u persoonlijk advies?
            Neem contact met ons op voor een gratis consultatie.
          </p>
          <a
            href="mailto:info@infraroodverwarming-soest.nl"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Opnemen
          </a>
        </div>
      </section>
    </main>
  );
}
