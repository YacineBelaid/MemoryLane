import { QueryClient } from "@tanstack/react-query";
import axios from 'axios';
import {options} from './../../interfaces/query.interface'
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
  console.log('Starting Request')
  return request
})

axiosInstance.interceptors.response.use(response => {
  console.log('Response:')
  return response
})

export const fetchWithCredentials = async (url: string, options : options = {
  body: undefined,
  method: ""
}) => {
  try {
    const response = await axiosInstance({
      url,
      method : options.method || 'GET',
      data: options.body || undefined,
  });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Network response was not ok');
    }
    throw error;
  }
};
