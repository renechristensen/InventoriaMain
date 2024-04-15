import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    isSidebarExpanded: localStorage.getItem("is_expanded") === "true" || false,
    apiUrl: ' https://4571-91-101-203-112.ngrok-free.app'
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
