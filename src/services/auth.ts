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
      // You can handle successful login here if needed
      localStorage.setItem('user-storage', JSON.stringify(data.user));
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const logout = async (): Promise<void> => {
  // If you implement a server-side logout, you can call it here
  // await axiosInstance.post('/logout');
  
  localStorage.removeItem('user-storage');
};
