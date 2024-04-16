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
        /*
          <div>
  {{ dataStore.data[activeType] }}
</div>*/

          <!-- Searchable Data Table -->
          <v-data-table 
            :headers="headers[activeType]"
            :items="dataStore.data[activeType]"
            :search="search" 
            class="elevation-1">
            <template #top>
              <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
            </template>
          </v-data-table>

          <!-- Create DataRack -->
          <v-dialog v-model="dataStore.dialogIsActive" max-width="500px">
            <template v-if="activeType === 'DataRack'">
              <v-card>
                <v-card-title>Create DataRack</v-card-title>
                <v-card-text>
                  <v-text-field label="Server Room ID" v-model="serverRoomID" outlined type="number"></v-text-field>
                  <v-text-field label="Rack Placement" v-model="rackPlacement" outlined></v-text-field>
                  <v-text-field label="Total Units" v-model="totalUnits" outlined type="number"></v-text-field>
                  <v-text-field label="Available Units" v-model="availableUnits" outlined type="number"></v-text-field>
                  <v-text-field label="Status" v-model="status" outlined></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
                  <v-btn color="primary" @click="saveData">Save</v-btn>
                </v-card-actions>
              </v-card>
            </template>

            <!-- Create Company -->
            <template v-if="activeType === 'Company'">
              <v-card>
                <v-card-title>Create Company</v-card-title>
                <v-card-text>
                  <v-text-field label="Name" v-model="name" outlined></v-text-field>
                  <v-text-field label="Description" v-model="description" outlined></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
                  <v-btn color="primary" @click="saveData">Save</v-btn>
                </v-card-actions>
              </v-card>
            </template>

            <!-- Create DataCenter -->
            <template v-if="activeType === 'DataCenter'">
              <v-card>
                <v-card-title>Create DataCenter</v-card-title>
                <v-card-text>
                  <v-text-field label="Name" v-model="name" outlined></v-text-field>
                  <v-text-field label="Address" v-model="address" outlined></v-text-field>
                  <v-text-field label="Description" v-model="description" outlined></v-text-field>
                  <v-select
                    label="Select Company"
                    :items="companyItems"
                    item-title="name"
                    v-model="selectedCompanyID"
                    outlined
                  ></v-select>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
                  <v-btn color="primary" @click="saveData">Save</v-btn>
                </v-card-actions>
              </v-card>
            </template>

          <!-- Create ServerRoom -->
            <template v-if="activeType === 'ServerRoom'">
              <v-card>
                <v-card-title>Create ServerRoom</v-card-title>
                <v-card-text>
                  <v-text-field label="Name" v-model="name" outlined></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
                  <v-btn color="primary" @click="saveData">Save</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Sidebar from '@/components/Sidebar';
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();
const activeType = ref('DataRack');
const search = ref('');
const name = ref('');
const description = ref('');
const address = ref('');
const selectedCompanyID = ref(null);
const serverRoomID = ref('');
const rackPlacement = ref('');
const totalUnits = ref('');
const availableUnits = ref('');
const status = ref('');

const companyItems = computed(() => {
  return dataStore.data['Company']?.map(company => ({
    name: company.name,
    companyID: company.companyID
  })) || [];
});


const headers = computed(() => ({
  DataRack: [
    { title: 'ID', key: 'dataRackID' },
    { title: 'Server lokale', key: 'serverRoomName' },
    { title: 'Startup', key: 'rackStartupDate' },
    { title: 'Status', key: 'rackStatus' },
    { title: 'Højde(U)', key: 'totalUnits' },
    { title: 'Ledige', key: 'availableUnits' },
    { title: 'Data Center', key: 'dataCenterName' },
    { title: 'Virksomhed', key: 'companyName' }
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
  if (activeType.value === 'DataCenter' && dataStore.dialogIsActive) {
    dataStore.fetchData('Company');
  }
}

function closeDialog() {
  dataStore.toggleDialog();
  resetFields();
}

watch(activeType, () => {
  if (activeType.value === 'DataCenter') {
    dataStore.fetchData('Company');
  }
  resetFields();
});

function resetFields() {
  name.value = '';
  description.value = '';
  address.value = '';
  selectedCompanyID.value = null;
  serverRoomID.value = '';
  rackPlacement.value = '';
  totalUnits.value = '';
  availableUnits.value = '';
  status.value = '';
}

function saveData() {
  let payload;

  switch (activeType.value) {
    case 'Company':
      payload = {
        Name: name.value,
        Description: description.value
      };
      break;

    case 'DataCenter':
      payload = {
        Name: name.value,
        Address: address.value,
        Description: description.value,
        CompanyID: selectedCompanyID.value
      };
      break;

    case 'DataRack':
      payload = {
        ServerRoomID: serverRoomID.value,
        RackPlacement: rackPlacement.value,
        TotalUnits: totalUnits.value,
        AvailableUnits: availableUnits.value,
        Status: status.value
      };
      break;

    case 'ServerRoom':
      payload = {
        DataCenterID: selectedCompanyID.value, // Assuming 'selectedCompanyID' holds DataCenterID for ServerRoom
        ServerRoomName: name.value,
        RackCapacity: totalUnits.value, // Assuming 'totalUnits' holds RackCapacity for ServerRoom
        StartupDate: new Date() // Assuming the startup date is the current date
      };
      break;
  }

  if (payload) {
    dataStore.createData(activeType.value, payload)
      .then(() => {
        closeDialog();
      })
      .catch(error => {
        console.error('Save failed:', error);
      });
  }
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