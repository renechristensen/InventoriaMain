import { defineStore } from 'pinia';

export const useDataRackStore = defineStore('dataRack', {
  state: () => ({
    currentDataRackId: localStorage.getItem('currentDataRackId')
  }),
  actions: {
    setDataRackId(id) {
      this.currentDataRackId = id;
      localStorage.setItem('currentDataRackId', id);
    },
    clearDataRackId() {
      this.currentDataRackId = null;
      localStorage.removeItem('currentDataRackId');
    }
  }
});
