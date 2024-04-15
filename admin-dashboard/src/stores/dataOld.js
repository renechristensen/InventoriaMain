/*import { defineStore } from 'pinia';
import axios from 'axios';
import { useAppStore } from './app'; // Import useAppStore

export const useDataStore = defineStore('data', {
  state: () => ({
    activeType: 'DataRack',  // Default active type
    data: {},
    headers: {
      DataRack: [],
      Company: [],
      DataCenter: []],
      ServerRoom: [],
    }
  }),
  actions: {
    setActiveType(type) {
      this.activeType = type;
      this.fetchData(type);
    },
    async fetchData(type) {
      const appStore = useAppStore();
      let url;
      // Check if the type is 'DataRack' for the special URL, otherwise use the standard URL
      if (type === 'DataRack') {
        url = `${appStore.apiUrl}/api/${type}/GetAll${type}TableRecords`;
      } else {
        url = `${appStore.apiUrl}/api/${type}`;
      }
      console.log('Making API call to:', url);
      try {
        const response = await axios.get(url, {
          headers: {
            'ngrok-skip-browser-warning': 'true' // Include the ngrok skip header
          }
        });
        this.data[type] = response.data; // Assumes response format is directly usable
      } catch (error) {
        console.error('Fetch failed:', error);
        console.error('Failed URL:', url); // Log the failing URL for debugging
      }
    }
  }
});
*/