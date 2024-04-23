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
      let url = `${appStore.apiUrl}/api/${type}/${id}`;
      if (type === "User") {
        url = `${appStore.apiUrl}/api/User/GetUser/${id}`;
      }
      try {
        const response = await axios.get(url);
        if (type === "DataRack") {
          this.data.dataRackByIDData = response.data;
        } else {
          this.data[type] = response.data;
        }
      } catch (error) {
        console.error(`Fetch by ID for ${type} failed:`, error);
      }
    },
    async fetchData(type) {
      const appStore = useAppStore();
      let url = `${appStore.apiUrl}/api/${type}`;
      if (type === "User") {
        url = `${appStore.apiUrl}/api/User/GetAllUsers`;
      }
      else if(type === "Role"){
        url = `${appStore.apiUrl}/api/Role/GetAllRoles`;
      }
      try {
        const response = await axios.get(url);
        this.data[type] = response.data;
      } catch (error) {
        console.error(`Fetch for ${type} failed:`, error);
      }
    },
    async createData(type, payload) {
      const appStore = useAppStore();
      let url = `${appStore.apiUrl}/api/${type}`;
      if (type === "User") {
        url = `${appStore.apiUrl}/api/User/CreateUser`;
      }
      try {
        const response = await axios.post(url, payload);
        this.fetchData(type);
      } catch (error) {
        console.error(`Create for ${type} failed:`, error);
      }
    },
    async updateData(type, payload) {
      const appStore = useAppStore();
      let url = `${appStore.apiUrl}/api/${type}/${payload.id}`;
      if (type === "User") {
        url = `${appStore.apiUrl}/api/User/UpdateUser/${payload.id}`;
      }
      try {
        const response = await axios.put(url, payload);
        this.fetchData(type);
      } catch (error) {
        console.error(`Update for ${type} failed:`, error);
      }
    },
    async deleteData(type, id) {
      const appStore = useAppStore();
      let url = `${appStore.apiUrl}/api/${type}/${id}`;
      if (type === "User") {
        url = `${appStore.apiUrl}/api/User/DeleteUser/${id}`;
      }
      try {
        await axios.delete(url);
        this.fetchData(type);
      } catch (error) {
        console.error(`Delete for ${type} failed:`, error);
      }
    },
    async deleteReservationsByRackUnit(rackUnitId, startDate, endDate) {
      const appStore = useAppStore();
      const url = `${appStore.apiUrl}/api/Reservation/by-rack-unit?rackUnitId=${rackUnitId}&startDate=${startDate}&endDate=${endDate}`;
      try {
        const response = await axios.delete(url);
        console.log('Delete successful', response.data);
        if (this.activeType === 'RackUnit') {
          this.fetchData('RackUnit');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        throw new Error('Deletion failed due to API error.');
      }
    },
    async assignUserRole(payload) {
      console.log("payload:" + payload);
      const appStore = useAppStore();
      const url = `${appStore.apiUrl}/api/UserRole/Assign`;
      try {
        console.log("payload:" + payload +" url: " + url);
        const response = await axios.post(url, payload);
        console.log('Role assigned successfully', response.data);
        this.fetchData('User');  // Optionally refresh user data
      } catch (error) {
        console.error('Error assigning role:', error);
        throw new Error('Role assignment failed due to API error.');
      }
    }
  }
});
