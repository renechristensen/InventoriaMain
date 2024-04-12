<template>
  <v-container class="fill-height" fluid>
    <nav-bar @open-login-popup="togglePopup(true)" />
    <login-popup
      :isPopupVisible="isPopupOpen"
      @update:isPopupVisible="togglePopup"
      @login="handleLogin"
    />
    
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <h1>Inventoria</h1>
        <p>Få adgang til skolens datacenter ved hjælp af Inventoria!</p>
        <v-btn color="secondary" @click="download">Download</v-btn>
      </v-col>
    </v-row>

    <footer-bar />
  </v-container>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterBar from '@/components/FooterBar.vue';
import LoginPopup from '@/components/LoginPopup.vue';

export default {
  name: 'LoginView',
  components: {
    NavBar,
    FooterBar,
    LoginPopup
  },
  data() {
    return {
      isPopupOpen: false
    };
  },
  methods: {
    togglePopup(value) {
      this.isPopupOpen = value;
    },
    handleLogin(credentials) {
      this.isPopupOpen = false;
      console.log(`Logging in with username: ${credentials.username} and password: ${credentials.password}`);
    },
    download() {
      console.log("Download started");
    }
  }
};
</script>

<style scoped>
/* Style adjustments if necessary */
</style>
