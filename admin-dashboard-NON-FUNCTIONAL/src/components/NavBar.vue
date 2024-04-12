<template>
  <v-app-bar app color="primary" dense>
    <v-toolbar-title>Inventoria</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text @click="openLoginPopup">Login</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'NavBar',
  methods: {
    openLoginPopup() {
      this.$emit('open-login-popup');
    }
  }
};
</script>
