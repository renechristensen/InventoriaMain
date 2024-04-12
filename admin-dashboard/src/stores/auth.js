import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(studieEmail, passwordHash) {
      const loginUrl = 'https://36c5-91-101-203-112.ngrok-free.app/api/Login';
      try {
        const response = await axios.post(loginUrl, {
          StudieEmail: studieEmail,
          PasswordHash: passwordHash
        });
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        router.push('/home');
      } catch (error) {
        console.error('Authentication failed:', error);
        throw error;
      }
    },
    logout() {
      this.token = null;
      localStorage.removeItem('token');
      router.push('/login');
    }
  }
});
