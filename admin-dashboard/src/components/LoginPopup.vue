<template>
  <v-dialog v-model="authStore.isPopupOpen" persistent max-width="400px">
    <v-card>
      <v-card-title class="text-h5">Log ind</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="Email" prepend-icon="mdi-account" v-model="email" type="email" />
          <v-text-field label="Adgangskode" prepend-icon="mdi-lock" v-model="password" type="password" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="login">Log ind</v-btn>
        <v-btn color="red darken-1" text @click="authStore.closeLoginPopup">Annuller</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');

const login = () => {
  authStore.login(email.value, password.value);
};
</script>

