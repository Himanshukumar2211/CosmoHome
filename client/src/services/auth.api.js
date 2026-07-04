import axiosClient from './axiosClient.js';

export const loginAdmin = (payload) => axiosClient.post('/admin/login', payload);
export const logoutAdmin = () => axiosClient.post('/admin/logout');
export const getAdminProfile = () => axiosClient.get('/admin/profile');
