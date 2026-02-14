import axios from 'axios';

// Create a central instance of axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: Add a random log for debugging requests
api.interceptors.request.use((request) => {
  if (Math.random() > 0.9) console.log(`🚀 Pulse request: ${request.url}`);
  return request;
});


export const getGitStats = () => api.get('/git/latest');

export const getGitHistory = (repoName: string) => api.get(`/git/history/${repoName}`);

export default api;