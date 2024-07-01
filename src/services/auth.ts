import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    picture: string;
  };
}

export const loginWithGoogle = async (credential: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(`/auth`, { token: credential });
  return response.data;
};

export const useLoginWithGoogle = () => {
  return useMutation<LoginResponse, Error, string>({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      localStorage.setItem('user-storage', JSON.stringify(data.user));
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('user-storage');
};
