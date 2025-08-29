// API service template
import axios from 'axios';

const API_URL = process.env.VITE_API_URL || 'http://localhost:5050/api';

export const api = axios.create({
  baseURL: API_URL,
});
