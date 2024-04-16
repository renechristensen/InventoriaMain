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
              <v-text-field v-model="search" label="Søg" class="mx-4"></v-text-field>
            </template>
          </v-data-table>

          <!-- Create DataRack -->
          <v-dialog v-model="dataStore.dialogIsActive" max-width="500px">
            <template v-if="activeType === 'DataRack'">
              <v-card>
                <v-card-title>Opret ny data rack</v-card-title>
                <v-card-text>
                  <v-text-field label="Data rack titel" v-model="DataRackName" outlined></v-text-field>
                  <v-select
                    label="Vælg server rum"
                    :items="serverRoomItems"
                    item-title="ServerRoomName"
                    item-value="serverRoomID"
                    v-model="selectedServerRoomID"
                    outlined
                  ></v-select>
                  <v-text-field label="Placeringsbeskrivelse" v-model="DataRackPlacement" outlined></v-text-field>
                  <v-text-field label="Højde på rack(U)" v-model="HeightOfDataRack" outlined type="number"></v-text-field>
                  <v-text-field label="Afsatte enheder(U)" v-model="availableDataRackUnits" outlined type="number"></v-text-field>
                  <v-select
                    label="Status"
                    :items="statusItems"
                    item-title="DatarackStatus"
                    v-model="DatarackStatus"
                    outlined
                  ></v-select>
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
                  <v-text-field label="Navn" v-model="CompanyName" outlined></v-text-field>
                  <v-text-field label="Beskriv virksomhed" v-model="CompanyDescription" outlined></v-text-field>
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
                <v-card-title>Opret DataCenter</v-card-title>
                <v-card-text>
                  <v-text-field label="Navn" v-model="DataCenterName" outlined></v-text-field>
                  <v-text-field label="Addresse" v-model="DataCenterAddresse" outlined></v-text-field>
                  <v-text-field label="Beskrivelse" v-model="DataCenterBeskrivelse" outlined></v-text-field>
                  <v-select
                    label="Vælg virksomhed"
                    :items="companyItems"
                    item-title="companyName"
                    item-value="companyID"
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
                <v-card-title>Opret server rum</v-card-title>
                <v-card-text>
                  <v-select
                    label="Vælg datacenter"
                    :items="dataCenterItems"
                    item-title="DataCenterName"
                    v-model="selectedDataCenterID"
                    outlined
                  ></v-select>
                  <v-text-field label="Server lokale" v-model="ServerRoomName" outlined></v-text-field>
                  <v-text-field label="Rack kapacitet" v-model="ServerRoomRackCapacity" outlined type="number"></v-text-field>

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
import { ref, computed, watch, onMounted  } from 'vue';
import Sidebar from '@/components/Sidebar';
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();
const activeType = ref('DataRack');
const search = ref('');


const selectedDatarackID = ref(null);
const HeightOfDataRack = ref('');
const availableDataRackUnits = ref('');
const DatarackStatus = ref('');
const DataRackPlacement = ref('');
const DataRackName = ref('');

const selectedCompanyID = ref(null);
const CompanyName = ref('');
const CompanyDescription = ref('');

const selectedServerRoomID = ref(null);
const ServerRoomName = ref("");
const serverRoomID = ref('');
const ServerRoomRackCapacity = ref('');

const selectedDataCenterID = ref(null);
const DataCenterName = ref('');
const DataCenterAddresse = ref('');
const DataCenterBeskrivelse = ref('')

onMounted(() => {
  setActiveDataType('DataCenter');
  setActiveDataType('ServerRoom');
  setActiveDataType('Company');
  setActiveDataType('DataRack');
});

const companyItems = computed(() => {
  return dataStore.data['Company']?.map(company => ({
    companyName: company.name,
    companyID: company.companyID
  })) || [];
});
/*
const datarackItems = computed(() => {
  return dataStore.data['DataRack']?.map(datarack => ({
    name: datarack.datarackName,
    datarackID: datarack.datarackID
  })) || [];
});
*/
const serverRoomItems = computed(() => {
  return dataStore.data['ServerRoom']?.map(ServerRoom => ({
    serverRoomID: ServerRoom.serverRoomID,
    ServerRoomName: ServerRoom.serverRoomName
  })) || [];
});

const dataCenterItems = computed(() => {
  return dataStore.data['DataCenter']?.map(datacenter => ({
    DataCenterName: datacenter.name,
    datacenterID: datacenter.dataCenterID
  })) || [];
});

const statusItems = ['Aktiv', 'Inaktiv', 'Vedligeholdelse', 'Lukket ned'];

const headers = computed(() => ({
  DataRack: [
    { title: 'Virksomhed', key: 'companyName' },
    { title: 'Data Center', key: 'dataCenterName' },
    { title: 'Server lokale', key: 'serverRoomName' },
    { title: "Navn", key: 'datarackName'},
    //{ title: 'ID', key: 'dataRackID' },
    { title: 'Opstart', key: 'rackStartupDate' },
    { title: 'Status', key: 'rackStatus' },
    { title: 'Højde(U)', key: 'totalUnits' },
    { title: 'Ledige', key: 'availableUnits' }
  ],
  Company: [
    //{ title: 'Virksomheds ID', key: 'companyID' },
    { title: 'Navn', key: 'name' },
    { title: 'Beskrivelse', key: 'description' }
  ],
  DataCenter: [
    //{ title: 'DataCenter ID', key: 'dataCenterID' },
    { title: 'Navn', key: 'name' },
    { title: 'Adresse', key: 'address' },
    { title: 'Beskrivelse', key: 'description' },
    { title: 'Virksomheds ID', key: 'companyID' }
  ],
  ServerRoom: [
    //{ title: 'ServerRoom ID', key: 'id' },
    { title: "Lokation", key: 'dataCenterName'},
    { title: 'Navn', key: 'serverRoomName'}, 
    { title: 'Opstart', key: 'startupDate'},
    { title: 'Rack kapacitet', key: 'rackCapacity'}

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

watch(selectedServerRoomID, (newVal) => {
  console.log('Selected Server Room ID:', newVal);
}, { immediate: true });

watch(serverRoomItems, (newVal) => {
  console.log('Server Room Items:', newVal);
}, { immediate: true });

watch(activeType, () => {
  if (activeType.value === 'DataCenter') {
    dataStore.fetchData('Company');
  }
  resetFields();
});

function resetFields() {
  selectedDatarackID.value = null;
  HeightOfDataRack.value = '';
  availableDataRackUnits.value = '';
  DatarackStatus.value = '';
  DataRackPlacement.value = '';
  DataRackName.value = '';

  selectedCompanyID.value = null;
  CompanyName.value = '';
  CompanyDescription.value = '';

  selectedServerRoomID.value = null;
  ServerRoomName.value = "";
  serverRoomID.value = '';
  ServerRoomRackCapacity.value = '';

  selectedDataCenterID.value = null;
  DataCenterName.value = '';
  DataCenterAddresse.value = '';
  DataCenterBeskrivelse.value = '';
}

function saveData() {
  let payload;

  switch (activeType.value) {
    case 'Company':
      payload = {
        Name: CompanyName.value,
        Description: CompanyDescription.value
      };
      break;

    case 'DataCenter':
      payload = {
        name: DataCenterName.value,
        address: DataCenterAddresse.value,
        description: DataCenterBeskrivelse.value,
        companyID: selectedCompanyID.value
      };
      break;

    case 'DataRack':
      payload = {
        'datarackName': DataRackName.value,
        'serverRoomID': selectedServerRoomID.value,
        'rackPlacement': DataRackPlacement.value,
        'totalUnits': HeightOfDataRack.value,
        'availableUnits': availableDataRackUnits.value,
        'status': DatarackStatus.value
      };
      break;

    case 'ServerRoom':
      payload = {
        DataCenterID: selectedDataCenterID.value,
        ServerRoomName: ServerRoomRackCapacity.value,
        RackCapacity: ServerRoomRackCapacity.value,
        StartupDate: new Date()
      };
      break;
  }
  console.log(payload);
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