import axiosClient from './axiosClient.js';

export const getGallery = (params) => axiosClient.get('/gallery', { params });
export const createGalleryItem = (payload) => axiosClient.post('/gallery', payload);
export const updateGalleryItem = (id, payload) => axiosClient.patch(`/gallery/${id}`, payload);
export const deleteGalleryItem = (id) => axiosClient.delete(`/gallery/${id}`);
