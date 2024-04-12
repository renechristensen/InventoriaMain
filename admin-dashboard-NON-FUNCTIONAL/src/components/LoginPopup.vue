<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card>
      <v-card-title class="text-h5">Login</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            label="Brugernavn"
            prepend-icon="mdi-account"
            v-model="username"
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            label="Kodeord"
            prepend-icon="mdi-lock"
            v-model="password"
            type="password"
            :rules="[rules.required]"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closePopup">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="login">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LoginPopup',
  props: {
    isPopupVisible: Boolean
  },
  computed: {
    dialog: {
      get() {
        return this.isPopupVisible;
      },
      set(value) {
        // Emit event to update the parent's state
        this.$emit('update:isPopupVisible', value);
      }
    }
  },
  data() {
    return {
      username: '',
      password: '',
      rules: {
        required: value => !!value || 'Required.'
      }
    };
  },
  methods: {
    login() {
      this.$emit('login', { username: this.username, password: this.password });
      this.closePopup();
    },
    closePopup() {
      this.$emit('update:isPopupVisible', false);
    }
  }
};
</script>
