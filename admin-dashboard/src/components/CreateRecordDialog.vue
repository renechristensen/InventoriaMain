<template>
  <v-dialog v-model="dialogIsActive" max-width="500px">
    <template v-if="type === 'DataRack'">
      <v-card>
        <v-card-title>Create DataRack</v-card-title>
        <v-card-text>
          <v-text-field label="DataRack Name" v-model="dataRack.name" outlined></v-text-field>
          <!-- Additional fields for DataRack can be added here -->
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary-darken-1" @click="close" text>Cancel</v-btn>
          <v-btn color="primary-darken-1" @click="saveDataRack">Save</v-btn>
        </v-card-actions>
      </v-card>
    </template>
    <!-- Additional templates for other types such as Company -->
    <!---
    <template v-if="type === 'DataCenter'">
      <v-card>
        <v-card-title>Create DataCenter</v-card-title>
        <v-card-text>
          <v-text-field label="DataCenter Name" v-model="dataCenter.name" outlined required :rules="[rules.required]"></v-text-field>
          <v-text-field label="Address" v-model="dataCenter.address" outlined required :rules="[rules.required, rules.maxLength500]"></v-text-field>
          <v-text-field label="Description" v-model="dataCenter.description" outlined></v-text-field>
          <v-select :items="companyNames" item-text="text" item-value="value" label="Company" v-model="dataCenter.companyId" outlined required :rules="[rules.required]"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary-darken-1" @click="close" text>Cancel</v-btn>
          <v-btn color="primary-darken-1" @click="saveDataCenter">Save</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  -->
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/data';
import {
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VTextField,
  VSelect,
  VBtn,
  VCardActions
} from 'vuetify/components';

const props = defineProps({
  active: Boolean,
  type: String
});

const emit = defineEmits(['update:active']);
const dataStore = useDataStore();

//const dialogIsActive = ref(props.active);
/*
const dataCenter = ref({
  name: '',
  address: '',
  description: '',
  companyId: null
});
*/
//const companyNames = computed(() => dataStore.nameLists['Company']);

const rules = {
  required: value => !!value || 'This field is required',
  maxLength500: value => value.length <= 500 || 'Maximum 500 characters allowed'
};

const close = () => {
  dialogIsActive.value = false;
  emit('update:active', false);
};

/*
const saveDataCenter = () => {
  const payload = {
    Name: dataCenter.value.name,
    Address: dataCenter.value.address,
    Description: dataCenter.value.description,
    CompanyID: dataCenter.value.companyId
  };
  dataStore.createData('DataCenter', payload);
  close();
};
*/

</script>
