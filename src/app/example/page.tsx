import React from 'react';

export default function ExamplePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Voorbeeld van Embedded Calculator</h1>
      
      <h2 className="text-2xl font-semibold mb-4">Volledige breedte:</h2>
      <iframe 
        src="/embed" 
        className="w-full min-h-[800px] border-0 overflow-hidden"
        title="Infrarood Verwarmings Calculator"
      />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Code voor embedding:</h2>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code>{`<iframe 
    src="https://infraroodverwarming-soest.nl/embed" 
    style="width: 100%; min-height: 800px; border: none; overflow: hidden;"
    title="Infrarood Verwarmings Calculator"
></iframe>`}</code>
      </pre>
    </div>
  );
}
