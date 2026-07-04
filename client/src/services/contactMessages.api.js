import axiosClient from './axiosClient.js';

export const createContactMessage = (payload) => axiosClient.post('/contact-messages', payload);
export const getContactMessages = (params) => axiosClient.get('/contact-messages', { params });
export const updateContactMessage = (id, payload) => axiosClient.patch(`/contact-messages/${id}`, payload);
export const deleteContactMessage = (id) => axiosClient.delete(`/contact-messages/${id}`);
