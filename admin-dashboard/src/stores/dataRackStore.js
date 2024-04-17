import { defineStore } from 'pinia';

export const useDataRackStore = defineStore('dataRack', {
  state: () => ({
    currentDataRackId: null
  }),
  actions: {
    setDataRackId(id) {
      this.currentDataRackId = id;
    },
    clearDataRackId() {
      this.currentDataRackId = null;
    }
  }
});
