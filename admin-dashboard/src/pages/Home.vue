<template>
    <div class="home-container">
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const logout = () => {
    authStore.logout();
    router.push({ name: 'Login' }); // Redirect to login after logout
  };
  </script>
  
  <style>
  .home-container {
    max-width: 300px;
    margin: 50px auto;
    padding: 20px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  </style>
  