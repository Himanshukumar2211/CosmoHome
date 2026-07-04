export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api',
  timeout: 30000,
  withCredentials: true,
};
