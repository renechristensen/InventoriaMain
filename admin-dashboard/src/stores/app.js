// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isSidebarExpanded: localStorage.getItem("is_expanded") === "true" || false
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarExpanded = !this.isSidebarExpanded;
      localStorage.setItem("is_expanded", this.isSidebarExpanded);
    }
  }
});
