<!--<template>
  <v-container fluid>
    <v-row>
      <Sidebar />

      <v-col cols="12">
        <div class="home-content">

          <v-btn @click="setActiveDataType('DataRack')">Tilføj Datarack</v-btn>
          <v-btn @click="setActiveDataType('Company')" >Opret Virksomhed</v-btn>
          <v-btn @click="setActiveDataType('DataCenter')">Opret Datacenter</v-btn>
          <v-btn @click="setActiveDataType('ServerRoom')">Opret Serverrum</v-btn>
          <v-data-table
            :headers="activeHeaders"
            :items="activeItems"
            :search="search"
            class="elevation-1"
            @update:model-value="search = $event"
          >
            <template #top>
              <v-text-field
                v-model="search"
                label="Search"
                class="mx-4"
              ></v-text-field>
            </template>
          </v-data-table>
          <CreateRecordDialog
            :active="dialogIsActive"
            :type="activeType"
            @update:active="dialogIsActive = $event"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Sidebar from '@/components/Sidebar';
import CreateRecordDialog from '@/components/CreateRecordDialog';
import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();
const search = ref('');

// Computed properties to reactively update table headers and items
const activeHeaders = computed(() => dataStore.headers[dataStore.activeType]);
const activeItems = computed(() => dataStore.data[dataStore.activeType]);
const activeType = ref('DataRack'); // Ensure this is defined if used in the template

// Function to set active data type and open dialog
const setActiveDataType = (type) => {
  dataStore.setActiveType(type);
  activeType.value = type; // Ensure the type is updated here
  dialogIsActive.value = true; // Open the dialog when changing type
};

// Dialog active state
const dialogIsActive = ref(false);
</script>

<style scoped>
.home-content {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  text-align: center;
}
</style>
-->