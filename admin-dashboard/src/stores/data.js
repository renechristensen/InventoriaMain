// src/stores/data.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAppStore } from './app';

export const useDataStore = defineStore('data', {
  state: () => ({
    activeType: 'DataRack',
    data: {
      currentData: {}
    },
    nameLists: {},
    dialogIsActive: false,
  }),
  actions: {
    setActiveType(type) {
      this.activeType = type;
      this.fetchData(type);
    },
    toggleDialog() {
      this.dialogIsActive = !this.dialogIsActive;
    },
    async fetchDataById(type, id) {
      const appStore = useAppStore();
      const url = `${appStore.apiUrl}/api/${type}/${id}`;
      try {
        const response = await axios.get(url);
        this.data.currentData = response.data; // Store the fetched data
      } catch (error) {
        console.error('Fetch by ID failed:', error);
        this.data.currentData = {};
      }
    },
    async fetchData(type) {
      const appStore = useAppStore();
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
        this.fetchData(type);
      } catch (error) {
        console.error('Create failed:', error);
      }
    },
    async updateData(type, payload) {
      const appStore = useAppStore();
      const url = `${appStore.apiUrl}/api/${type}/${payload.id}`;
      try {
        const response = await axios.put(url, payload);
        console.log('Update successful:', response.data);
        this.fetchData(type);
      } catch (error) {
        console.error('Update failed:', error);
      }
    },
    async deleteData(type, id) {
      const appStore = useAppStore();
      const url = `${appStore.apiUrl}/api/${type}/${id}`;
      try {
        await axios.delete(url);
        console.log('Delete successful');
        this.fetchData(type);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  }
});
