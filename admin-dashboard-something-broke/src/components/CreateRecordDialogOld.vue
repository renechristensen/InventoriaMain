<!--<template>
    <v-dialog v-model="dialogIsActive">
      <template v-if="type === 'DataRack'">
        <v-card>
          <v-card-title>
            Create DataRack
          </v-card-title>
          <v-card-text>
            <v-text-field
              label="DataRack Name"
              v-model="dataRack.name"
              outlined
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" @click="close" variant="text">Cancel</v-btn>
            <v-btn color="blue darken-1" @click="saveDataRack">Save</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    active: Boolean,
    type: String
  });
  
  const emit = defineEmits(['update:active']);
  
  const dialogIsActive = ref(props.active);
  const dataRack = ref({ name: '' });
  
  watch(() => props.active, (newVal) => {
    dialogIsActive.value = newVal;
  });
  
  const close = () => {
    dialogIsActive.value = false;
    emit('update:active', false);
  };
  
  const saveDataRack = () => {
    // Assuming saving logic here, possibly using the datastore
    console.log('Saving DataRack:', dataRack.value);
    close();
  };
  </script>
-->