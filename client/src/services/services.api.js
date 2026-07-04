import axiosClient from './axiosClient.js';

export const getServices = (params) => axiosClient.get('/services', { params });
export const createService = (payload) => axiosClient.post('/services', payload);
export const updateService = (id, payload) => axiosClient.patch(`/services/${id}`, payload);
export const deleteService = (id) => axiosClient.delete(`/services/${id}`);
