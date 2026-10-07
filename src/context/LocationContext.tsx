import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Sede } from '../types/index.ts';
import { api } from '../services/api.ts';

export type SedeSlug = 'all' | 'ibague' | 'medellin';

interface LocationContextType {
  selectedSede: SedeSlug;
  setSelectedSede: (sede: SedeSlug) => void;
  sedes: Sede[];
  currentSedeObj: Sede | null;
  loading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSede, setSelectedSedeState] = useState<SedeSlug>(() => {
    const saved = localStorage.getItem('tp_selected_sede');
    return (saved as SedeSlug) || 'all';
  });
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getSedes().then(data => {
      if (mounted) {
        setSedes(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setSelectedSede = (sede: SedeSlug) => {
    setSelectedSedeState(sede);
    localStorage.setItem('tp_selected_sede', sede);
  };

  const currentSedeObj = sedes.find(s => s.slug === selectedSede) || null;

  return (
    <LocationContext.Provider
      value={{
        selectedSede,
        setSelectedSede,
        sedes,
        currentSedeObj,
        loading
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation debe usarse dentro de un LocationProvider');
  }
  return context;
}
