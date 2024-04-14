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
            <v-btn color="primary" @click="openCreateDialog">Opret {{ activeTypeLabel }}</v-btn>
          </div>

          <!-- Searchable Data Table -->
          <v-data-table
            :headers="headers[activeType.value]"
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

          <!-- Create Record Dialog -->
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
const activeType = ref('DataRack');
const dialogIsActive = ref(false);

const headers = {
  DataRack: [
    { text: 'DataRack ID', value: 'DataRackID', align: "start" },
    { text: 'Serverrum', value: 'ServerRoomName' },
    { text: 'Opstart', value: 'RackStartupDate' },
    { text: 'Status', value: 'RackStatus' },
    { text: 'Antal U', value: 'TotalUnits' },
    { text: 'Ledige U', value: 'AvailableUnits' },
    { text: 'Datacenter', value: 'DataCenterName' },
    { text: 'Virksomhed', value: 'CompanyName' }
  ],
  Company: [
    { text: 'Virksomheds ID', value: 'CompanyID' },
    { text: 'Navn', value: 'Name' },
    { text: 'Beskrivelse', value: 'Description' }
  ],
  // Additional headers can be added here
};

const activeItems = computed(() => dataStore.data[activeType.value]);
const activeTypeLabel = computed(() => ({
  DataRack: 'DataRack',
  Company: 'Virksomhed',
  DataCenter: 'Datacenter',
  ServerRoom: 'Serverrum'
})[activeType.value]);

const setActiveDataType = (type) => {
  dataStore.setActiveType(type);
  activeType.value = type;
};

const openCreateDialog = () => {
  if (activeType.value === 'DataCenter') {
    dataStore.fetchData('Company');
  }
  dialogIsActive.value = true;
};
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

.v-btn {
  margin: 0 5px;
}
</style>
