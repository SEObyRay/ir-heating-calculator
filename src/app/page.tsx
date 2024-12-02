import Calculator from '../components/Calculator'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Infrared Heating Calculator
        </h1>
        <Calculator />
      </div>
    </main>
  )
}
