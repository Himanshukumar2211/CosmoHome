import axios from 'axios';
import { API_CONFIG } from '../config/api.config.js';

const axiosClient = axios.create(API_CONFIG);

export default axiosClient;
