'use client';

import React, { useState, useRef } from 'react';
import { Room, CalculationResult, RoomType, InsulationType, Window, GlassType, HeatingType, CalculationMode, Orientation, AdjacentSpaceType } from '../types/calculator';
import { calculateHeating } from '../utils/calculator';
import { downloadReport } from '../utils/reportGenerator';
import { TOOLTIPS } from '../constants/tooltips';

const roomTypes: RoomType[] = ['living', 'bedroom', 'bathroom', 'kitchen', 'office', 'other'];
const roomTypeLabels: Record<RoomType, string> = {
  living: 'Woonkamer',
  bedroom: 'Slaapkamer',
  bathroom: 'Badkamer',
  kitchen: 'Keuken',
  office: 'Kantoor',
  other: 'Overig'
};

const insulationTypes: InsulationType[] = ['poor', 'average', 'good', 'excellent'];
const insulationLabels: Record<InsulationType, string> = {
  poor: 'Slecht',
  average: 'Gemiddeld',
  good: 'Goed',
  excellent: 'Uitstekend'
};

const glassTypes: GlassType[] = ['single', 'double', 'hr', 'hr+', 'hr++', 'triple'];
const glassTypeLabels: Record<GlassType, string> = {
  single: 'Enkel Glas',
  double: 'Dubbel Glas',
  hr: 'HR Glas',
  'hr+': 'HR+ Glas',
  'hr++': 'HR++ Glas',
  triple: 'Driedubbel Glas'
};

const heatingTypes: HeatingType[] = ['full', 'spot'];
const heatingTypeLabels: Record<HeatingType, string> = {
  full: 'Volledige Ruimte',
  spot: 'Spot Verwarming'
};
const orientations: Orientation[] = ['north', 'east', 'south', 'west'];
const orientationLabels: Record<Orientation, string> = {
  north: 'Noord',
  east: 'Oost',
  south: 'Zuid',
  west: 'West'
};

const defaultWindow: Window = {
  width: 1.2,
  height: 1.6,
  glassType: 'double',
  orientation: 'north',
  hasBlinds: false,
  quantity: 1
};

const emptyOccupancy = {
  numberOfPeople: 1,
  hoursPerDay: 8
};

const emptyAdjacentSpaces: Record<'north' | 'east' | 'south' | 'west' | 'above' | 'below', AdjacentSpaceType> = {
  north: 'outside',
  east: 'outside',
  south: 'outside',
  west: 'outside',
  above: 'outside',
  below: 'outside'
};

const defaultRoom: Room = {
  length: 6,
  width: 4,
  height: 2.6,
  type: 'living',
  insulation: 'average',
  heatingType: 'full',
  windows: [],
  wallType: 'brick',
  ceilingType: 'concrete',
  floorType: 'concrete',
  ventilationType: 'natural',
  adjacentSpaces: emptyAdjacentSpaces,
  occupancy: emptyOccupancy
};

const InfoIcon: React.FC<{ tooltip: string }> = ({ tooltip }) => (
  <div className="group relative inline-block ml-1">
    <svg className="w-4 h-4 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div className="hidden group-hover:block absolute z-50 w-64 p-2 mt-1 text-sm bg-gray-900 text-white rounded-lg shadow-lg -left-1/2 transform -translate-x-1/2">
      {tooltip}
    </div>
  </div>
);

const Calculator: React.FC = () => {
  const [room, setRoom] = useState<Room>(defaultRoom);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('simple');
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');

      if (room.length <= 0 || room.width <= 0 || room.height <= 0) {
        setError('Alle afmetingen moeten groter zijn dan 0');
        return;
      }

      const invalidWindows = room.windows.some(w => w.width <= 0 || w.height <= 0);
      if (invalidWindows) {
        setError('Alle raamafmetingen moeten groter zijn dan 0');
        return;
      }

      if (room.heatingType === 'spot' && (room.spotPercentage || 0) <= 0) {
        setError('Geef een geldig percentage op voor spot verwarming');
        return;
      }

      const calculationResult = calculateHeating(room, calculationMode);
      setResult(calculationResult);
      
      // Ensure the result section exists before trying to scroll
      // Use setTimeout to ensure the DOM has updated with the new result
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          // Set focus to the result section for accessibility
          resultRef.current.focus();
        }
      }, 100);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het berekenen');
      setResult(null);
    }
  };

  const handleModeSelect = (mode: CalculationMode) => {
    setCalculationMode(mode);
    setResult(null);
  };

  const renderModeSelector = () => (
    <div className="mode-selector">
      <div 
        className={`mode-card ${calculationMode === 'simple' ? 'selected' : ''}`}
        onClick={() => handleModeSelect('simple')}
      >
        <h3>Snelle Berekening</h3>
        <p>Basis berekening met alleen de meest essentiële gegevens voor een snelle schatting.</p>
      </div>
      <div 
        className={`mode-card ${calculationMode === 'advanced' ? 'selected' : ''}`}
        onClick={() => handleModeSelect('advanced')}
      >
        <h3>Uitgebreide Berekening</h3>
        <p>Gedetailleerde berekening met alle factoren voor de meest nauwkeurige schatting.</p>
      </div>
    </div>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError('');

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setRoom(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof Room],
          [child]: parent === 'occupancy' ? Number(value) : value
        }
      }));
    } else {
      setRoom(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddWindow = () => {
    setRoom({
      ...room,
      windows: [...room.windows, { ...defaultWindow }]
    });
  };

  const handleRemoveWindow = (index: number) => {
    setRoom(prev => ({
      ...prev,
      windows: prev.windows.filter((_, i) => i !== index)
    }));
  };

  const handleWindowChange = (index: number, field: keyof Window, value: number | GlassType | Orientation | boolean) => {
    setRoom(prev => ({
      ...prev,
      windows: prev.windows.map((window, i) => 
        i === index ? { ...window, [field]: value } : window
      )
    }));
  };

  const handleDuplicateWindow = (index: number) => {
    const windowToDuplicate = room.windows[index];
    setRoom({
      ...room,
      windows: [...room.windows, { ...windowToDuplicate }]
    });
  };

  const renderBasicFields = () => (
    <div className="form-grid">
      <div>
        <label htmlFor="length" className="form-label">Lengte (meters)</label>
        <input
          type="number"
          id="length"
          className="input-field"
          value={room.length || ''}
          onChange={(e) => setRoom({ ...room, length: parseFloat(e.target.value) })}
          step="0.1"
          min="0"
          placeholder="bijv. 6.0"
        />
      </div>
      <div>
        <label htmlFor="width" className="form-label">Breedte (meters)</label>
        <input
          type="number"
          id="width"
          className="input-field"
          value={room.width || ''}
          onChange={(e) => setRoom({ ...room, width: parseFloat(e.target.value) })}
          step="0.1"
          min="0"
          placeholder="bijv. 4.0"
        />
      </div>
      <div>
        <label htmlFor="height" className="form-label">Hoogte (meters)</label>
        <input
          type="number"
          id="height"
          className="input-field"
          value={room.height || ''}
          onChange={(e) => setRoom({ ...room, height: parseFloat(e.target.value) })}
          step="0.1"
          min="0"
          placeholder="bijv. 2.6"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Isolatie Kwaliteit
          <InfoIcon tooltip={`${TOOLTIPS.insulation.description}\n\n${Object.values(TOOLTIPS.insulation.details).join('\n')}`} />
        </label>
        <select
          value={room.insulation}
          onChange={(e) => setRoom({ ...room, insulation: e.target.value as InsulationType })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {insulationTypes.map((quality) => (
            <option key={quality} value={quality}>
              {insulationLabels[quality]} - {TOOLTIPS.insulation.details[quality]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderAdvancedFields = () => (
    <div className="space-y-6">
      <div className="form-grid">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type Ruimte
          </label>
          <select
            name="type"
            value={room.type}
            onChange={handleInputChange}
            className="input-field"
          >
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {roomTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ventilatie Type</label>
          <select
            name="ventilationType"
            value={room.ventilationType}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="natural">Natuurlijke Ventilatie</option>
            <option value="mechanical">Mechanische Ventilatie</option>
            <option value="balanced">Gebalanceerde Ventilatie</option>
            <option value="none">Geen Ventilatie</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Muur Type</label>
          <select
            name="wallType"
            value={room.wallType}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="brick">Baksteen</option>
            <option value="concrete">Beton</option>
            <option value="wood">Hout</option>
            <option value="steel">Staal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plafond Type</label>
          <select
            name="ceilingType"
            value={room.ceilingType}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="concrete">Beton</option>
            <option value="wood">Hout</option>
            <option value="insulated">Geïsoleerd</option>
            <option value="uninsulated">Niet Geïsoleerd</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vloer Type</label>
          <select
            name="floorType"
            value={room.floorType}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="concrete">Beton</option>
            <option value="wood">Hout</option>
            <option value="tile">Tegels</option>
            <option value="carpet">Tapijt</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type Verwarming
          </label>
          <select
            name="heatingType"
            value={room.heatingType}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="full">Volledige Ruimte</option>
            <option value="spot">Specifieke Zone (Spot)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aantal Personen</label>
          <input
            type="number"
            name="occupancy.numberOfPeople"
            value={room.occupancy?.numberOfPeople ?? 1}
            onChange={handleInputChange}
            className="input-field"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Uren Aanwezig per Dag</label>
          <input
            type="number"
            name="occupancy.hoursPerDay"
            value={room.occupancy?.hoursPerDay ?? 8}
            onChange={handleInputChange}
            className="input-field"
            min="1"
            max="24"
          />
        </div>
      </div>

      {room.heatingType === 'spot' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Percentage van Ruimte te Verwarmen
          </label>
          <input
            type="number"
            name="spotPercentage"
            value={room.spotPercentage}
            onChange={handleInputChange}
            min="1"
            max="100"
            className="input-field"
          />
        </div>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ramen</h3>
          <button
            onClick={handleAddWindow}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Raam Toevoegen
          </button>
        </div>
        
        {room.windows.map((window, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Afmetingen en aantal */}
              <div className="col-span-2 md:col-span-1">
                <label className="text-sm font-medium text-gray-700">Afmetingen & Aantal</label>
                <div className="flex space-x-2 mt-1">
                  <input
                    type="number"
                    value={window.width || ''}
                    onChange={(e) => handleWindowChange(index, 'width', parseFloat(e.target.value))}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="B(m)"
                    title="Breedte in meters"
                  />
                  <span className="text-gray-500">×</span>
                  <input
                    type="number"
                    value={window.height || ''}
                    onChange={(e) => handleWindowChange(index, 'height', parseFloat(e.target.value))}
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="H(m)"
                    title="Hoogte in meters"
                  />
                  <input
                    type="number"
                    value={window.quantity || 1}
                    onChange={(e) => handleWindowChange(index, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="#"
                    title="Aantal identieke ramen"
                  />
                </div>
              </div>

              {/* Glas Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  Type Glas
                  <InfoIcon tooltip={`${TOOLTIPS.glassType.description}\n\n${Object.values(TOOLTIPS.glassType.details).join('\n')}`} />
                </label>
                <select
                  value={window.glassType}
                  onChange={(e) => handleWindowChange(index, 'glassType', e.target.value as GlassType)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {glassTypes.map((type) => (
                    <option key={type} value={type}>
                      {glassTypeLabels[type]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Oriëntatie */}
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  Oriëntatie
                  <InfoIcon tooltip={`${TOOLTIPS.windowOrientation.description}\n\n${Object.values(TOOLTIPS.windowOrientation.details).join('\n')}`} />
                </label>
                <select
                  value={window.orientation}
                  onChange={(e) => handleWindowChange(index, 'orientation', e.target.value as Orientation)}
                  className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {orientations.map((orientation) => (
                    <option key={orientation} value={orientation}>
                      {orientationLabels[orientation]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zonwering */}
              <div className="flex items-end">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={window.hasBlinds || false}
                    onChange={(e) => handleWindowChange(index, 'hasBlinds', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700">Zonwering</span>
                  <InfoIcon tooltip="Zonwering vermindert warmteverlies 's nachts en oververhitting overdag (-15% warmteverlies)" />
                </label>
              </div>

              {/* Verwijder knop */}
              <div className="col-span-2 md:col-span-1 lg:col-span-4 flex justify-end">
                <button
                  onClick={() => handleRemoveWindow(index)}
                  className="text-red-600 hover:text-red-800 text-sm focus:outline-none"
                >
                  Verwijder Raam
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getEnergyLabelColor = (rating: string) => {
    switch (rating) {
      case 'A+':
        return 'bg-green-500';
      case 'A':
        return 'bg-green-400';
      case 'B':
        return 'bg-yellow-400';
      case 'C':
        return 'bg-orange-400';
      case 'D':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="page-title text-center">
        Infrarood Verwarmings Calculator
      </h1>
      
      <p className="text-center text-gray-600 mb-8">
        Bereken snel en eenvoudig het benodigde vermogen voor uw infrarood verwarming
      </p>

      {/* Calculation Result Section */}
      {result && (
        <div 
          ref={resultRef}
          className="mt-8 p-6 bg-white rounded-lg shadow-lg"
          tabIndex={-1}
          role="region"
          aria-label="Berekend Resultaat"
        >
          <h2 className="text-2xl font-bold mb-4">Resultaten</h2>
          
          {/* Energielabel */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              {TOOLTIPS.energyLabel.title}
              <InfoIcon tooltip={`${TOOLTIPS.energyLabel.description}\n\n${Object.values(TOOLTIPS.energyLabel.details).join('\n')}`} />
            </h3>
            <div className="flex items-center">
              <span className={`px-4 py-2 rounded-full font-bold ${getEnergyLabelColor(result.energyEfficiency.rating)}`}>
                {result.energyEfficiency.rating}
              </span>
              <span className="ml-4">
                Besparingspotentieel: {result.energyEfficiency.savingsPotential}%
              </span>
            </div>
          </div>

          {/* Berekening details */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              {calculationMode === 'simple' ? TOOLTIPS.calculation.basic.title : TOOLTIPS.calculation.advanced.title}
              <InfoIcon 
                tooltip={calculationMode === 'simple' 
                  ? `${TOOLTIPS.calculation.basic.description}\n${TOOLTIPS.calculation.basic.formula}`
                  : `${TOOLTIPS.calculation.advanced.description}\n\n${TOOLTIPS.calculation.advanced.formula}\n\n${TOOLTIPS.calculation.advanced.details.join('\n')}`
                } 
              />
            </h3>
            <p>Benodigd vermogen: <span className="font-bold">{result.requiredWattage}W</span></p>
          </div>

          {/* Panel suggesties */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Aanbevolen Panelen</h3>
            <ul className="list-disc list-inside">
              {result.panelSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          {/* Download rapport knop */}
          <button
            onClick={() => downloadReport(room, result, calculationMode)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Download Rapport
          </button>
        </div>
      )}

      {renderModeSelector()}

      <form onSubmit={handleSubmit} className="space-y-6">
        {calculationMode === 'simple' ? (
          renderBasicFields()
        ) : (
          <>
            {renderBasicFields()}
            {renderAdvancedFields()}
          </>
        )}
        
        <div className="flex justify-center mt-8">
          <button type="submit" className="btn-primary">
            Bereken Vermogen
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}

export default Calculator;
