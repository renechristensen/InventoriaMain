<template>
  <v-container fluid>
    <v-row>
      <Sidebar />
      <v-col cols="12">
        <div class="home-content">
          <!-- Action Buttons -->
          <div class="button-group">
            <v-btn @click="setActiveDataType('DataRack')">DataRack</v-btn>
            <v-btn @click="setActiveDataType('Company')">Virksomhed</v-btn>
            <v-btn @click="setActiveDataType('DataCenter')">Datacenter</v-btn>
            <v-btn @click="setActiveDataType('ServerRoom')">Serverrum</v-btn>
            <v-btn color="primary" @click="toggleDialog">Opret {{ activeTypeLabel }}</v-btn>
          </div>

          <div>
  {{ dataStore.data[activeType] }}
</div>

          <!-- Searchable Data Table -->
          <v-data-table 
          :headers="headers[activeType]"
          :items=dataStore.data[activeType]
          :search="search" class="elevation-1">
            <template #top>
              <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
            </template>
          </v-data-table>
          <!-- Create Record Dialog -->
          <v-dialog v-model="dataStore.dialogIsActive" max-width="500px">
            <v-card>
              <v-card-title>Create {{ activeType }}</v-card-title>
              <v-card-text>
                <v-text-field label="Name" v-model="name" outlined></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
                <v-btn color="primary" @click="saveData">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import Sidebar from '@/components/Sidebar';
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();
const activeType = ref('DataRack');
const search = ref('');
const name = ref('');

const headers = computed(() => ({
  DataRack: [
    { title: 'DataRack ID', key: 'DataRackID' }
  ],
  Company: [
    { title: 'Virksomheds ID', key: 'companyID' },
    { title: 'Navn', key: 'name' },
    { title: 'Beskrivelse', key: 'description' }
  ],
  DataCenter: [
    { title: 'DataCenter ID', key: 'dataCenterID' },
    { title: 'Navn', key: 'name' },
    { title: 'Adresse', key: 'address' },
    { title: 'Beskrivelse', key: 'description' },
    { title: 'Virksomheds ID', key: 'companyID' }
  ],
  ServerRoom: [
    { title: 'ServerRoom ID', key: 'id' }
  ]
}));

const activeTypeLabel = computed(() => activeType.value);

function setActiveDataType(type) {
  dataStore.setActiveType(type);
  activeType.value = type;
}

function toggleDialog() {
  dataStore.toggleDialog();
}

function closeDialog() {
  dataStore.toggleDialog();
}

function saveData() {
  // Save data logic here
  closeDialog();
}
</script>

<style scoped>
.home-content {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}
.button-group {
  text-align: center;
  margin-bottom: 20px;
}
</style>
