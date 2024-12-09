export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pagina niet gevonden</h2>
        <p className="text-gray-600 mb-6">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Terug naar home
        </a>
      </div>
    </div>
  );
}
