// axiosSetup.js

import axios from 'axios';

export function setupAxiosInterceptors() {
  axios.interceptors.request.use(config => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Include the ngrok skip browser warning header
    config.headers['ngrok-skip-browser-warning'] = 'true';

    return config;
  }, error => {
    // Do something with request error
    return Promise.reject(error);
  });
}
