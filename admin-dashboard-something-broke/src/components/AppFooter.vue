<template>
  <v-footer padless color="primary">
    <v-col class="text-center" cols="12">
      Kontakt <a href="mailto:adminsupport34@gmail.com" class="contact-link">adminsupport34@gmail.com</a>
    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter'
};
</script>

<style scoped>
.v-footer {
  padding: 8px 0;
  flex: 0 0 auto;
}

.contact-link {
  color: white; /* Makes the link white */
}

/* If you need the link to be dynamic based on theme */
.contact-link {
  color: var(--v-theme-on-primary, white); /* Fallback to white if variable not found */
}
</style>
