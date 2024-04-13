<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <Sidebar />
      </v-col>
      <v-col cols="9">
        <div class="home-content">
          <h1>Home Page</h1>
          <p>Welcome to the home page!</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push({ name: 'Login' });
};
</script>

<style scoped>
.home-content {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
