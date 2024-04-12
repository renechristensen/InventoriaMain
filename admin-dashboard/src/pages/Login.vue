<template>
  <v-container class="fill-height" fluid>
    <!-- Navigation Bar -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Inventoria</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="isPopupOpen = true">Login</v-btn>
    </v-app-bar>

    <!-- Login Popup -->
    <v-dialog v-model="isPopupOpen" persistent max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Login</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              label="Email"
              v-model="email"
              prepend-icon="mdi-account"
              type="email"
              autocomplete="username"
            ></v-text-field>
            <v-text-field
              label="Password"
              v-model="password"
              prepend-icon="mdi-lock"
              type="password"
              autocomplete="current-password"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="login">Login</v-btn>
          <v-btn color="red darken-1" text @click="isPopupOpen = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Content -->
    <v-row justify="center" align="center" class="text-center">
      <v-col cols="12" sm="8" md="6">
        <h1>Welcome to Inventoria</h1>
        <p>Access the school's data center with Inventoria.</p>
        <v-btn color="secondary" @click="download">Download</v-btn>
      </v-col>
    </v-row>

    <!-- Footer -->
    <v-footer fixed padless>
      <v-col class="text-center" cols="12">
        Kontakt <a href="mailto:adminsupport34@gmail.com">adminsupport34@gmail.com</a>
      </v-col>
    </v-footer>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();
const isPopupOpen = ref(false);

const login = async () => {
  try {
    await authStore.login(email.value, password.value);
    isPopupOpen.value = false;
    router.push({ name: 'Home' });
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed: ' + error.message);
  }
};

const download = () => {
  console.log("Download started");
};
</script>

<style scoped>
/* Add styles if needed */
</style>
