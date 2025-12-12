import api from './api';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  imgURL: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface VerifyTokenResponse {
  success: boolean;
  user: User;
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  verifySession: async (): Promise<VerifyTokenResponse | null> => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      return null; 
    }
    try {
      const response = await api.get<VerifyTokenResponse>('/auth/verify-token');
      return response.data;
    } catch (error: any) {
      // Only remove token if the error is explicitly an authentication error (401)
      if (typeof window !== 'undefined' && error.response && error.response.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
};
