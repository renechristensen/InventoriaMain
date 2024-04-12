import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    isPopupOpen: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    // Actions to control the popup visibility
    openLoginPopup() {
      this.isPopupOpen = true;
    },
    closeLoginPopup() {
      this.isPopupOpen = false;
    },

    // Async login action
    async login(studieEmail, passwordHash) {
      const loginUrl = 'https://36c5-91-101-203-112.ngrok-free.app/api/Login';
      try {
        const response = await axios.post(loginUrl, {
          StudieEmail: studieEmail,
          PasswordHash: passwordHash
        });
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        this.closeLoginPopup();
        router.push('/home');
      } catch (error) {
        this.closeLoginPopup();
        console.error('Authentication failed:', error);
        throw error; 
      }
    },

    // Logout action
    logout() {
      this.token = null;
      localStorage.removeItem('token');
      router.push('/login');
    }
  }
});
