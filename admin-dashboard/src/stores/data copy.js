import { defineStore } from 'pinia';
import axios from 'axios';
import { useAppStore } from './app'; // Import useAppStore

export const useDataStore = defineStore('data', {
  state: () => ({
    activeType: 'DataRack',
    data: {},
    nameLists: {}
  }),
  actions: {
    setActiveType(type) {
      this.activeType = type;
      this.fetchData(type);
    },
    async fetchData(type) {
      const appStore = useAppStore();
      let url = `${appStore.apiUrl}/api/${type}`;
      if (type === 'DataRack') {
        url += '/GetAll' + type + 'TableRecords';
      }
      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
        this.data[type] = response.data;
        if (type === 'Company') {
          this.updateNameList(type, response.data);
        }
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    },
    updateNameList(type, data) {
      if (type === 'Company') {
        this.nameLists[type] = data.map(company => ({
          text: company.Name,
          value: company.CompanyID
        }));
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
        this.fetchData(type);  // Refresh data after creation
      } catch (error) {
        console.error('Create failed:', error);
      }
    }
  }
});
