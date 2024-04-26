import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    isSidebarExpanded: localStorage.getItem("is_expanded") === "true" || false,
    apiUrl: 'https://outgoing-eminent-jennet.ngrok-free.app'
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarExpanded = !this.isSidebarExpanded;
      localStorage.setItem("is_expanded", this.isSidebarExpanded);
    },
    setApiUrl(url) {
      this.apiUrl = url;
    }
  }
});
