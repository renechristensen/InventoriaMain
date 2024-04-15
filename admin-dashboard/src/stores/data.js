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
      // Assuming each type just appends to /api/{type}
      const url = `${appStore.apiUrl}/api/${type}`;
      try {
        const response = await axios.get(url);
        this.data[type] = response.data;
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    },
    async createData(type, payload) {
      const appStore = useAppStore();
      const url = `${appStore.apiUrl}/api/${type}`;
      try {
        const response = await axios.post(url, payload);
        console.log('Create successful:', response.data);
        this.fetchData(type);  // Refresh the data list after a successful create
      } catch (error) {
        console.error('Create failed:', error);
      }
    }
  }
});
