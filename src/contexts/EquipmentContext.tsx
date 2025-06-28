import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EquipmentContext {
  equipment_id?: string;
  equipment_type?: string;
  equipment_name?: string;
  location?: string;
  qr_code?: string;
  [key: string]: any;
}

interface EquipmentContextType {
  currentEquipment: EquipmentContext | null;
  setCurrentEquipment: (equipment: EquipmentContext | null) => void;
  clearEquipment: () => void;
}

const EquipmentContextObj = createContext<EquipmentContextType | undefined>(undefined);

export const EquipmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentEquipment, setCurrentEquipment] = useState<EquipmentContext | null>(null);

  const clearEquipment = () => setCurrentEquipment(null);

  return (
    <EquipmentContextObj.Provider value={{
      currentEquipment,
      setCurrentEquipment,
      clearEquipment
    }}>
      {children}
    </EquipmentContextObj.Provider>
  );
};

export const useEquipment = () => {
  const context = useContext(EquipmentContextObj);
  if (context === undefined) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
};