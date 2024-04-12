<template>
  <v-container class="fill-height" fluid>
    <!-- Navigation Bar -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Inventoria</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="authStore.openLoginPopup">Log ind</v-btn>
    </v-app-bar>

    <!-- Login Popup -->
    <v-dialog v-model="authStore.isPopupOpen" persistent max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Log ind</v-card-title>
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
              label="Adgangskode"
              v-model="password"
              prepend-icon="mdi-lock"
              type="password"
              autocomplete="current-password"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" @click="login">Log ind</v-btn>
          <v-btn color="red darken-1"  @click="authStore.closeLoginPopup">Annuller</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Content -->
    <v-row justify="center" align="center" class="text-center">
      <v-col cols="12" sm="8" md="4">
        <h1>Velkommen til Inventoria</h1>
        <p>Tilgå dit datacenter med Inventoria appen.</p>
        <v-btn color="secondary" @click="download">Download</v-btn>
      </v-col>
      
      <!-- Image Column -->
      <v-col cols="12" sm="4" md="4" class="phone-image-col">
        <v-img
          src="@/assets/phone.png"
          alt="Telefonbillede"
          contain
          max-height="300" 
        ></v-img>
      </v-col>
    </v-row>
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

const login = async () => {
  try {
    await authStore.login(email.value, password.value);
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
.phone-image-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 960px) {
  .phone-image-col v-img {
    max-width: 70%;
    max-height: 200px;
  }
}

@media (max-width: 600px) {
  .phone-image-col {
    display: none;
  }
}
</style>
