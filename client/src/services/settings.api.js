import axiosClient from './axiosClient.js';

export const getSettings = () => axiosClient.get('/settings');
export const updateSettings = (payload) => axiosClient.patch('/settings', payload);
