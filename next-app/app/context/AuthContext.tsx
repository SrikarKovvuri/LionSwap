// app/context/AuthContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import type { User } from '@/lib/types';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  //user: User | null;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);      // ← new
  //const [user, setUser] = useState<User | null>(null);

  const refetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      // const res = await axios.get<{ user: User }>(
      //   'http://localhost:5000/current_user',
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      // setUser(res.data.user);
      setIsLoggedIn(true);
    } catch (err) {
      //setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    refetchUser().finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, isLoading, refetchUser}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
