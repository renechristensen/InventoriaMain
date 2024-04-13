<template>
    <v-navigation-drawer
      app
      permanent
      color="primary"
    >
      <v-list dense>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          link
          @click="navigateTo(item.route)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const menuItems = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard' },
    { title: 'Settings', icon: 'mdi-cog', route: '/settings' },
    { title: 'Profile', icon: 'mdi-account', route: '/profile' },
    { title: 'Messages', icon: 'mdi-message', route: '/messages' },
    { title: 'Logout', icon: 'mdi-exit-to-app', route: '/logout' },
  ];
  
  const router = useRouter();
  
  const navigateTo = (route) => {
    router.push({ name: route });
  };
  </script>
  
  <style scoped>
  </style>
  