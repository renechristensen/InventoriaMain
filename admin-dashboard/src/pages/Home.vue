<template>
  <v-navigation-drawer
    app
    permanent
    color="grey lighten-4"
    class="elevation-2"
  >
    <v-list dense>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        link
        class="nav-item"
        @click="navigateTo(item.route)"
      >
        <v-list-item-icon class="icon-container">
          <v-icon color="primary">{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content class="text-container">
          <v-list-item-title class="primary--text text-center">{{ item.title }}</v-list-item-title>
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
.nav-item {
  border: 1px solid rgba(0, 0, 0, 0.12); /* subtle border for each item */
  border-radius: 4px; /* rounded corners for the buttons */
  margin: 4px 0; /* space between items */
}

.icon-container, .text-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-center {
  text-align: center;
}
</style>
