import axiosClient from './axiosClient.js';

export const getDashboardStats = () => axiosClient.get('/dashboard/stats');
