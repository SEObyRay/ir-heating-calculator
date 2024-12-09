'use client';

import React, { useEffect } from 'react';
import { useStroomprijs } from '../context/StroomprijsContext';

export default function PrijsDisplay() {
  const { stroomprijs, laatstBijgewerkt, setStroomprijs } = useStroomprijs();

  useEffect(() => {
    console.log('PrijsDisplay rendered with stroomprijs:', stroomprijs);
  }, [stroomprijs]);

  const handlePrijsUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrijs = parseFloat(e.target.value);
    if (!isNaN(newPrijs)) {
      console.log('Updating stroomprijs to:', newPrijs);
      setStroomprijs(newPrijs);
    }
  };

  return (
    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <label htmlFor="stroomprijs">Stroomprijs:</label>
        <input
          id="stroomprijs"
          type="number"
          step="0.01"
          min="0"
          value={stroomprijs}
          onChange={handlePrijsUpdate}
          className="w-20 px-2 py-1 border rounded"
        />
        <span>€/kWh</span>
      </div>
      <div className="text-xs text-gray-500">
        Laatst bijgewerkt: {laatstBijgewerkt.toLocaleString('nl-NL')}
      </div>
    </div>
  );
}
