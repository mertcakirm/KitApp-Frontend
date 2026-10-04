import axios from 'axios';
import { getCookie, removeCookie } from '../utils/cookie';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/';
export const FILEBASE_URL = (import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');


const api = axios.create({
  baseURL: BASE_URL || 'http://localhost:3000/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.skipAuth) {
      return config;
    }

    const token = getCookie('token'); 

    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn('Oturum süresi doldu veya yetkisiz erişim. Çıkış yapılıyor...');

        removeCookie('token'); 

        if (window.location.pathname !== '/login') {
          window.location.href = '/login'; 
        }
      }
      
      if (status === 403) {
        console.warn('Bu işlemi yapmaya yetkiniz yok.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
