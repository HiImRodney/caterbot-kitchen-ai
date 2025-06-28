// User Context Provider - Manages user authentication and site context

import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  role: 'staff' | 'manager' | 'admin';
  siteId: string;
  siteName: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // For demo purposes, we'll start with a test user
  const [user, setUser] = useState<User | null>({
    id: 'test-user',
    name: 'Test Staff',
    role: 'staff',
    siteId: 'TOCA-TEST-001',
    siteName: 'TOCA Test Restaurant'
  });

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      isAuthenticated: !!user
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};