'use client';

import { useStroomprijs } from '../context/StroomprijsContext';

export default function PrijsDisplay() {
  const { stroomprijs, laatstBijgewerkt } = useStroomprijs();

  return (
    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
      Huidige stroomprijs: €{stroomprijs.toFixed(2)}/kWh
      <span className="text-xs text-gray-500 ml-2">
        Laatst bijgewerkt: {laatstBijgewerkt.toLocaleString('nl-NL')}
      </span>
    </div>
  );
}
