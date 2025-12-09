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

export interface AuthResponse {
  user: any; // Adjustable based on actual response
  token: string;
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
};
