// src/stores/data.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAppStore } from './app';

export const useDataStore = defineStore('data', {
  state: () => ({
    activeType: 'DataRack',
    data: {},
    nameLists: {},
    dialogIsActive: false, // State to manage dialog visibility
  }),
  actions: {
    setActiveType(type) {
      this.activeType = type;
      this.fetchData(type);
    },
    toggleDialog() {
      this.dialogIsActive = !this.dialogIsActive;
    },
    async fetchData(type) {
      const appStore = useAppStore();
      const url = `${appStore.apiUrl}/api/${type}${type === 'DataRack' ? '/GetAll' + type + 'TableRecords' : ''}`;
      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
        this.data[type] = response.data;
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    },
    async createData(type, payload) {
      const appStore = useAppStore();
      const url = `${appStore.apiUrl}/api/${type}`;
      try {
        const response = await axios.post(url, payload, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
        console.log('Create successful:', response.data);
        this.fetchData(type);
      } catch (error) {
        console.error('Create failed:', error);
      }
    }
  }
});
