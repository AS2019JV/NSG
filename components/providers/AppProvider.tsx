'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AppProviderProps {
  children: React.ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Verificar autenticación al cargar la aplicación
    checkAuth();
  }, []);

  return <>{children}</>;
}