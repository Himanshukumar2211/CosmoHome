import axiosClient from './axiosClient.js';

export const registerBeautician = (payload) => axiosClient.post('/beauticians/register', payload);
export const getBeauticians = (params) => axiosClient.get('/beauticians', { params });
export const getBeauticianById = (id) => axiosClient.get(`/beauticians/${id}`);
export const approveBeautician = (id) => axiosClient.patch(`/beauticians/${id}/approve`);
export const rejectBeautician = (id, payload) => axiosClient.patch(`/beauticians/${id}/reject`, payload);
export const deleteBeautician = (id) => axiosClient.delete(`/beauticians/${id}`);
