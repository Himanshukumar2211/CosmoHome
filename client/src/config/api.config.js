export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://api.cosmohome.co.in/api' : 'http://localhost:9000/api'),
  timeout: 30000,
  withCredentials: true,
};
