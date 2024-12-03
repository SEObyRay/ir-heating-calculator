'use client';

import React, { useState } from 'react';

interface AdminPanelProps {
    huidigeStroomprijsPerKwh: number;
    onPrijsUpdate: (nieuwePrijs: number) => void;
}

export default function AdminPanel({ huidigeStroomprijsPerKwh, onPrijsUpdate }: AdminPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [nieuwePrijs, setNieuwePrijs] = useState(huidigeStroomprijsPerKwh.toString());
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const prijs = parseFloat(nieuwePrijs);
        
        if (isNaN(prijs) || prijs <= 0) {
            setError('Voer een geldige prijs in (groter dan 0)');
            return;
        }

        if (prijs > 1) {
            setError('Voer de prijs in euro\'s per kWh in (bijvoorbeeld 0.34)');
            return;
        }

        setError('');
        onPrijsUpdate(prijs);
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
            >
                Beheer Stroomprijs
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4">Stroomprijs Aanpassen</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Huidige prijs: €{huidigeStroomprijsPerKwh.toFixed(2)}/kWh
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">€</span>
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                value={nieuwePrijs}
                                onChange={(e) => setNieuwePrijs(e.target.value)}
                                className="mt-1 block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="0.34"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">/kWh</span>
                            </div>
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-red-600">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Annuleren
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Opslaan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
