'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStroomprijs } from '../../context/StroomprijsContext';

export default function AdminPage() {
    const { stroomprijs, setStroomprijs, laatstBijgewerkt, setLaatstBijgewerkt } = useStroomprijs();
    const [nieuwePrijs, setNieuwePrijs] = useState(stroomprijs.toString());
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
        setStroomprijs(prijs);
        setLaatstBijgewerkt(new Date());
        setSuccessMessage('Stroomprijs succesvol bijgewerkt');

        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <Link 
                            href="/"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Terug naar Calculator
                        </Link>
                    </div>

                    <div className="border-b border-gray-200 mb-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Stroomprijs Beheer</h2>
                        <div className="mb-4 p-4 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-600">
                                Huidige stroomprijs: <span className="font-medium">€{stroomprijs.toFixed(2)}/kWh</span>
                                <br />
                                Laatst bijgewerkt: <span className="font-medium">{laatstBijgewerkt.toLocaleString('nl-NL')}</span>
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nieuwe stroomprijs (€/kWh)
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">€</span>
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={nieuwePrijs}
                                    onChange={(e) => setNieuwePrijs(e.target.value)}
                                    className="block w-full pl-7 pr-12 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                            {successMessage && (
                                <p className="mt-2 text-sm text-green-600">
                                    {successMessage}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Prijs Bijwerken
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
