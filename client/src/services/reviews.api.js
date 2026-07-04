import axiosClient from './axiosClient.js';

export const getReviews = (params) => axiosClient.get('/reviews', { params });
export const createReview = (payload) => axiosClient.post('/reviews', payload);
export const updateReview = (id, payload) => axiosClient.patch(`/reviews/${id}`, payload);
export const deleteReview = (id) => axiosClient.delete(`/reviews/${id}`);
