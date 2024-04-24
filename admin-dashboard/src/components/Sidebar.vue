<template>
  <v-navigation-drawer
    app
    permanent
    :class="{'is-expanded': isExpanded}"
    color="#031425"
    :style="{ width: sidebarWidth }"
  >
    <div class="sidebar-header">
      <div class="header-content">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        {{ isExpanded ? 'Inventoria' : '' }}
      </div>
      <v-btn icon @click="toggleSidebar" class="toggle-button">
        <v-icon>{{ isExpanded ? 'mdi-chevron-left' : 'mdi-menu' }}</v-icon>
      </v-btn>
    </div>

    <v-list dense class="sidebar-menu">
      <v-list-subheader>Menu</v-list-subheader>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        link
        @click="handleNavigation(item.route, item.title)"
      >
        <template #prepend>
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        {{ item.title }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore(); 
const router = useRouter();

const isExpanded = ref(true);
const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

const menuItems = [
  { title: 'Hjem', icon: 'mdi-view-dashboard', route: '/home' },
  { title: 'Brugere', icon: 'mdi-account', route: '/users' },
  { title: 'Alarmer', icon:'mdi-alert', route: '/alerts'},
  { title: 'Miljø', icon: 'mdi-earth', route: '/environment' },
  { title: 'Log ud', icon: 'mdi-exit-to-app', route: '/logout' },
];

const handleNavigation = (route, title) => {
  if (route === 'logout') {
    authStore.logout(); 
    router.push('/login');
  } else {
    router.push(route);
  }
};

const sidebarWidth = computed(() => isExpanded.value ? '200px' : '70px');
</script>


<style scoped>
.v-navigation-drawer {
  background-color: #031425; /* Dark blue */
  color: white;
  transition: width 0.3s ease-in-out;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
  overflow: hidden;
}

.logo {
  height: 30px;
  margin-right: 10px; /* Spacing between logo and text */
}

.toggle-button {
  transition: transform 0.3s ease-in-out;
}

.sidebar-menu {
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.v-list-item {
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.v-list-item.v-list-item--active {
  background-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 1024px) {
  .v-navigation-drawer {
    position: absolute;
    z-index: 100;
  }
}
</style>
