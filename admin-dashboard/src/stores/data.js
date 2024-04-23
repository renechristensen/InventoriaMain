// src/stores/data.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAppStore } from './app';

export const useDataStore = defineStore('data', {
  state: () => ({
    activeType: 'DataRack',
    data: {
      dataRackByIDData: {},
      rackUnitByDataRackID: {}
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
        if (type === "DataRack") this.data.dataRackByIDData = response.data;
        if (type === "RackUnit") this.data[type] = response.data;
      } catch (error) {
        console.error('Fetch by ID failed:', error);
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
        this.fetchData(type);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    },
    async deleteReservationsByRackUnit(rackUnitId, startDate, endDate) {
      const appStore = useAppStore();
      const url = `${appStore.apiUrl}/api/Reservation/by-rack-unit?rackUnitId=${rackUnitId}&startDate=${startDate}&endDate=${endDate}`;
      try {
        const response = await axios.delete(url);
        console.log('Delete successful', response.data);
        this.fetchData('RackUnit'); // Optionally refresh RackUnit data
      } catch (error) {
        console.error('Delete failed:', error);
        throw new Error('Deletion failed due to API error.');
      }
    }
  }
});
