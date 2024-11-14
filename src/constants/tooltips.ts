export const TOOLTIPS = {
  // Isolatie tooltips
  insulation: {
    title: 'Isolatie',
    description: 'De kwaliteit van de isolatie in de ruimte',
    details: {
      excellent: 'Uitstekende isolatie (20% minder warmteverlies)',
      good: 'Goede isolatie (standaard warmteverlies)',
      average: 'Gemiddelde isolatie (20% meer warmteverlies)',
      poor: 'Slechte isolatie (40% meer warmteverlies)'
    }
  },

  // Glas type tooltips
  glassType: {
    title: 'Type Glas',
    description: 'Het type beglazing in de ramen',
    details: {
      single: 'Enkel glas (50% meer warmteverlies)',
      double: 'Dubbel glas (20% meer warmteverlies)',
      hr: 'HR glas (10% meer warmteverlies)',
      'hr+': 'HR+ glas (standaard warmteverlies)',
      'hr++': 'HR++ glas (10% minder warmteverlies)',
      triple: 'Triple glas (20% minder warmteverlies)'
    }
  },

  // Muur type tooltips
  wallType: {
    title: 'Type Muur',
    description: 'Het materiaal van de muren',
    details: {
      brick: 'Baksteen (standaard warmteverlies)',
      concrete: 'Beton (10% meer warmteverlies)',
      wood: 'Hout (10% minder warmteverlies)',
      steel: 'Staal (20% meer warmteverlies)'
    }
  },

  // Plafond type tooltips
  ceilingType: {
    title: 'Type Plafond',
    description: 'Het type plafond in de ruimte',
    details: {
      concrete: 'Beton (10% meer warmteverlies)',
      wood: 'Hout (10% minder warmteverlies)',
      insulated: 'Geïsoleerd (20% minder warmteverlies)',
      uninsulated: 'Ongeïsoleerd (30% meer warmteverlies)'
    }
  },

  // Vloer type tooltips
  floorType: {
    title: 'Type Vloer',
    description: 'Het type vloer in de ruimte',
    details: {
      concrete: 'Beton (10% meer warmteverlies)',
      wood: 'Hout (10% minder warmteverlies)',
      tile: 'Tegels (20% meer warmteverlies)',
      carpet: 'Tapijt (20% minder warmteverlies)'
    }
  },

  // Ventilatie type tooltips
  ventilationType: {
    title: 'Type Ventilatie',
    description: 'Het ventilatiesysteem in de ruimte',
    details: {
      natural: 'Natuurlijke ventilatie (10% meer warmteverlies)',
      mechanical: 'Mechanische ventilatie (standaard warmteverlies)',
      balanced: 'Gebalanceerde ventilatie (10% minder warmteverlies)',
      none: 'Geen ventilatie (20% meer warmteverlies, niet aanbevolen i.v.m. vocht)'
    }
  },

  // Raam oriëntatie tooltips
  windowOrientation: {
    title: 'Raam Oriëntatie',
    description: 'De richting waarin het raam geplaatst is',
    details: {
      north: 'Noord (20% meer warmteverlies, minste zonlicht)',
      east: 'Oost (10% meer warmteverlies)',
      south: 'Zuid (10% minder warmteverlies, meeste zonlicht)',
      west: 'West (standaard warmteverlies)'
    }
  },

  // Energielabel tooltips
  energyLabel: {
    title: 'Energielabel',
    description: 'De energieprestatie van de ruimte',
    details: {
      'A+++': 'Uitstekende energieprestatie (0% besparingspotentieel)',
      'A++': 'Zeer goede energieprestatie (5% besparingspotentieel)',
      'A+': 'Goede energieprestatie (10% besparingspotentieel)',
      'A': 'Bovengemiddelde energieprestatie (15% besparingspotentieel)',
      'B': 'Gemiddelde energieprestatie (20% besparingspotentieel)',
      'C': 'Matige energieprestatie (25% besparingspotentieel)',
      'D': 'Onder gemiddelde energieprestatie (30% besparingspotentieel)',
      'E': 'Slechte energieprestatie (35% besparingspotentieel)',
      'F': 'Zeer slechte energieprestatie (40% besparingspotentieel)'
    }
  },

  // Algemene berekening tooltips
  calculation: {
    basic: {
      title: 'Basis Berekening',
      description: 'Eenvoudige berekening gebaseerd op ruimtevolume en isolatie',
      formula: 'Wattage = Volume × 30W/m³ × Isolatiefactor'
    },
    advanced: {
      title: 'Uitgebreide Berekening',
      description: 'Gedetailleerde berekening die rekening houdt met alle factoren',
      formula: 'Wattage = Basis × Isolatie × Muur × Plafond × Vloer × Ventilatie × Raamfactoren',
      details: [
        'Basis: Volume × 30W/m³',
        'Isolatie: -20% tot +40% effect',
        'Muur: -10% tot +20% effect',
        'Plafond: -20% tot +30% effect',
        'Vloer: -20% tot +20% effect',
        'Ventilatie: -10% tot +20% effect',
        'Ramen: Effect gebaseerd op:',
        '- Glastype (-20% tot +50%)',
        '- Oriëntatie (-10% tot +20%)',
        '- Zonwering (-15% indien aanwezig)',
        '- Oppervlakte t.o.v. vloer'
      ]
    }
  }
};
