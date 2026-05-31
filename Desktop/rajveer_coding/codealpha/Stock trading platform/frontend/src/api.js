import axios from 'axios';

// In production (Vercel), set VITE_BACKEND_URL to your deployed backend URL.
// In development, Vite proxy handles /api → localhost:8080 automatically.
const baseURL = import.meta.env.VITE_BACKEND_URL || '';

const api = axios.create({
  baseURL,
});

export default api;
