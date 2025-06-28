// Equipment Context Provider - Manages selected equipment state across the app

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Equipment {
  id: string;
  qr_code: string;
  custom_name: string;
  equipment_type: string;
  manufacturer: string;
  model: string;
  location: string;
  site_name: string;
  status: string;
  category?: string;
}

interface EquipmentContextType {
  currentEquipment: Equipment | null;
  setCurrentEquipment: (equipment: Equipment | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export const EquipmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <EquipmentContext.Provider value={{
      currentEquipment,
      setCurrentEquipment,
      loading,
      setLoading
    }}>
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (context === undefined) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
};