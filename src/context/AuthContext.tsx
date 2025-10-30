import { createContext, useContext, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  isPremium: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setPremiumStatus: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Cookies.get('isAuthenticated') === 'true';
  });
  
  const [isPremium, setIsPremium] = useState(() => {
    return Cookies.get('isPremium') === 'true';
  });

  const login = (username: string, password: string) => {
    if (username === 'chan' && password === 'password') {
      setIsAuthenticated(true);
      Cookies.set('isAuthenticated', 'true', { expires: 7 });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsPremium(false);
    Cookies.remove('isAuthenticated');
    Cookies.remove('isPremium');
  };

  const setPremiumStatus = (status: boolean) => {
    setIsPremium(status);
    Cookies.set('isPremium', status.toString(), { expires: 30 });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isPremium, login, logout, setPremiumStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}