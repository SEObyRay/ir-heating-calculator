'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface StroomprijsContextType {
  stroomprijs: number;
  setStroomprijs: (prijs: number) => void;
  laatstBijgewerkt: Date;
  setLaatstBijgewerkt: (datum: Date) => void;
}

const StroomprijsContext = createContext<StroomprijsContextType | undefined>(undefined);

export function StroomprijsProvider({ children }: { children: React.ReactNode }) {
  const [stroomprijs, setStroomprijs] = useState<number>(0.32);
  const [laatstBijgewerkt, setLaatstBijgewerkt] = useState<Date>(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const opgeslagenPrijs = localStorage.getItem('stroomprijs');
    const opgeslagenDatum = localStorage.getItem('laatstBijgewerkt');
    
    if (opgeslagenPrijs) {
      setStroomprijs(parseFloat(opgeslagenPrijs));
    }
    if (opgeslagenDatum) {
      setLaatstBijgewerkt(new Date(opgeslagenDatum));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('stroomprijs', stroomprijs.toString());
      localStorage.setItem('laatstBijgewerkt', laatstBijgewerkt.toISOString());
    }
  }, [stroomprijs, laatstBijgewerkt, isClient]);

  return (
    <StroomprijsContext.Provider value={{ 
      stroomprijs, 
      setStroomprijs, 
      laatstBijgewerkt, 
      setLaatstBijgewerkt 
    }}>
      {children}
    </StroomprijsContext.Provider>
  );
}

export function useStroomprijs() {
  const context = useContext(StroomprijsContext);
  if (context === undefined) {
    throw new Error('useStroomprijs must be used within a StroomprijsProvider');
  }
  return context;
}
