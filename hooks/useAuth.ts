import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    setUser, 
    setAuthenticated, 
    setLoading, 
    logout: storeLogout 
  } = useAppStore();
  
  const router = useRouter();

  // Verificar sesión al cargar la aplicación
  const checkAuth = async () => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifySession();
      if (response && response.success && response.user) {
        setUser(response.user);
        setAuthenticated(true);
      } else {
        // Token inválido o expirado
        localStorage.removeItem('token');
        setAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando sesión:', error);
      localStorage.removeItem('token');
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setAuthenticated(true);
        return { success: true, user: response.user };
      }
      
      throw new Error('Respuesta de login inválida');
    } catch (error: any) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    storeLogout();
    router.push('/');
  };

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  };
};