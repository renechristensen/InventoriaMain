import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';
import { useAppStore } from './app';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    isPopupOpen: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    openLoginPopup() {
      this.isPopupOpen = true;
    },
    closeLoginPopup() {
      this.isPopupOpen = false;
    },
    async login(studieEmail, passwordHash) {
      const appStore = useAppStore();
      const loginUrl = `${appStore.apiUrl}/api/Login`;
      try {
        const response = await axios.post(loginUrl, {
          StudieEmail: studieEmail,
          PasswordHash: passwordHash
        }, {
          headers: {
            'ngrok-skip-browser-warning': 'true' // Add this if needed for every API call
          }
        });
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        router.push('/home');
        this.closeLoginPopup();
      } catch (error) {
        console.error('Authentication failed:', error);
        this.closeLoginPopup();
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
