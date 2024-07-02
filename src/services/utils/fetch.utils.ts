import { QueryClient } from "@tanstack/react-query";
import axios from 'axios';
import {options} from './../../interfaces/query.interface'
import useUserStore from "./../../store/useStore";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true,
});

axiosInstance.interceptors.request.use(request => {
  return request
})

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data.error;
      if (errorMessage && (errorMessage.includes('No token provided') || errorMessage.includes('Token expired') || errorMessage.includes('Failed to authenticate token'))) {
        const logout = useUserStore.getState().logout;
        logout();
      }
    }
    return Promise.reject(error);
  }
);
export const fetchWithCredentials = async (url: string, options: options = {
  body: undefined,
  method: ""
}) => {

  try {
    const response = await axiosInstance({
      url,
      method: options.method || 'GET',
      data: options.body || undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error in fetchWithCredentials:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || `HTTP error! status: ${error.response.status}`);
    }
    throw error;
  }
};

