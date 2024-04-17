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
          <v-data-table :headers="headers[activeType]" :items="dataStore.data[activeType]" class="elevation-1">
  <template #item="{ item }">
    <tr>
      <!-- Dynamically create table cells for all headers except 'Actions' -->
      <td v-for="header in headers[activeType].filter(h => h.key !== 'actions')" :key="header.key">
        {{ item[header.key] }}
      </td>
      <!-- Action buttons column -->
      <td>
        <v-btn icon @click="editItem(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteItem(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn icon v-if="activeType === 'DataRack'" @click="viewDetails(item)">
  <v-icon>mdi-eye</v-icon>
</v-btn>

      </td>
    </tr>
  </template>
</v-data-table>

          <!-- Create DataRack -->
          <v-dialog v-model="dataStore.dialogIsActive" max-width="500px">
            <template v-if="activeType === 'DataRack'">
              <v-card>
                <v-card-title>{{ dialogTitle }}</v-card-title>
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
                <v-card-title>{{ dialogTitle }}</v-card-title>
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
                <v-card-title>{{ dialogTitle }}</v-card-title>
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
                <v-card-title>{{ dialogTitle }}</v-card-title>
                <v-card-text>
                  <v-select
                    label="Vælg datacenter"
                    :items="dataCenterItems"
                    item-title="DataCenterName"
                    item-value="datacenterID"
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
import { useRouter } from 'vue-router';
import { ref, computed, watch, onMounted  } from 'vue';
import Sidebar from '@/components/Sidebar';
import { useDataStore } from '@/stores/data';
import { useDataRackStore } from '@/stores/dataRackStore';


const router = useRouter();
const dataRackStore = useDataRackStore();
const dataStore = useDataStore();
const activeType = ref('DataRack');
const search = ref('');
const isEditMode = ref(false);
const editID = ref(null);

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

const statusItems = ['Aktiv', 'Inaktiv', 'Vedligeholdelse', 'Lukket ned'];

const companyItems = computed(() => {
  return dataStore.data['Company']?.map(company => ({
    companyName: company.name,
    companyID: company.companyID
  })) || [];
});


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

const dialogTitle = computed(() => {
  const typeTitles = {
    'DataRack': 'data rack',
    'Company': 'virksomhed',
    'DataCenter': 'datacenter',
    'ServerRoom': 'serverrum'
  };
  
  const action = isEditMode.value ? 'Rediger' : 'Opret';
  const typeLabel = typeTitles[activeType.value];

  return `${action} ${typeLabel}`;
});

const headers = computed(() => ({
  DataRack: [
    { title: 'Placering', key: 'rackPlacement'},
    { title: 'Virksomhed', key: 'companyName' },
    { title: 'Data Center', key: 'dataCenterName' },
    { title: 'Server lokale', key: 'serverRoomName' },
    { title: "Navn", key: 'datarackName'},
    //{ title: 'ID', key: 'dataRackID' },
    { title: 'Opstart', key: 'rackStartupDate' },
    { title: 'Status', key: 'rackStatus' },
    { title: 'Højde(U)', key: 'totalUnits' },
    { title: 'Ledige', key: 'availableUnits' },
    { title: 'Actions', key: 'actions', sortable: false }
  ],
  Company: [
    //{ title: 'Virksomheds ID', key: 'companyID' },
    { title: 'Navn', key: 'name' },
    { title: 'Beskrivelse', key: 'description' },
    { title: 'Actions', key: 'actions', sortable: false }
  ],
  DataCenter: [
    //{ title: 'DataCenter ID', key: 'dataCenterID' },
    { title: 'Navn', key: 'name' },
    { title: 'Adresse', key: 'address' },
    { title: 'Beskrivelse', key: 'description' },
    { title: 'Virksomheds ID', key: 'companyID' },
    { title: 'Actions', key: 'actions', sortable: false }
  ],
  ServerRoom: [
    //{ title: 'ServerRoom ID', key: 'id' },
    { title: "Lokation", key: 'dataCenterName'},
    { title: 'Navn', key: 'serverRoomName'}, 
    { title: 'Opstart', key: 'startupDate'},
    { title: 'Rack kapacitet', key: 'rackCapacity'},
    { title: 'Actions', key: 'actions', sortable: false }

  ]
}));

const idFieldMapping = {
  DataRack: 'dataRackID',
  Company: 'companyID',
  DataCenter: 'dataCenterID',
  ServerRoom: 'serverRoomID'
};

const activeTypeLabel = computed(() => activeType.value);

function setActiveDataType(type) {
  dataStore.setActiveType(type);
  activeType.value = type;
}

function toggleDialog() {
  dataStore.dialogIsActive = !dataStore.dialogIsActive;
}

function closeDialog() {
  isEditMode.value = false;
  resetFields();
  dataStore.toggleDialog();
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

watch(() => dataStore.dialogIsActive, (newValue, oldValue) => {
  if (!newValue) {
    isEditMode.value = false;
    resetFields();
    console.log("Dialog closed");
  }
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
  let payload = {};

  switch (activeType.value) {
    case 'DataRack':
      payload = {
        id: editID.value,
        datarackName: DataRackName.value,
        serverRoomID: selectedServerRoomID.value,
        rackPlacement: DataRackPlacement.value,
        totalUnits: HeightOfDataRack.value,
        availableUnits: availableDataRackUnits.value,
        status: DatarackStatus.value
      };
      break;
    case 'Company':
      payload = {
        id: editID.value,
        name: CompanyName.value,
        description: CompanyDescription.value
      };
      break;
    case 'DataCenter':
      payload = {
        id: editID.value,
        name: DataCenterName.value,
        address: DataCenterAddresse.value,
        description: DataCenterBeskrivelse.value,
        companyID: selectedCompanyID.value
      };
      break;
    case 'ServerRoom':
      payload = {
        id: editID.value,
        dataCenterID: selectedDataCenterID.value,
        serverRoomName: ServerRoomName.value,
        rackCapacity: ServerRoomRackCapacity.value
      };
      break;
  }

  if (isEditMode.value) {
    // Assuming you have a method for updating data in your store
    dataStore.updateData(activeType.value, payload)
      .then(() => {
        closeDialog();
        resetFields();
        isEditMode.value = false;  // Reset edit mode
      })
      .catch(error => {
        console.error('Save failed:', error);
      });
  } else {
    dataStore.createData(activeType.value, payload)
      .then(() => {
        closeDialog();
        resetFields();
      })
      .catch(error => {
        console.error('Save failed:', error);
      });
  }
}


function editItemOldLegacy(item) {
  console.log('Edit item:', item);
}

function editItem(item) {
  isEditMode.value = true; 
  editID.value = item[idFieldMapping[activeType.value]];
  console.log("EditId is: " + item.serverRoomID);
  switch (activeType.value) {
    case 'DataRack':
      DataRackName.value = item.datarackName;
      selectedServerRoomID.value = item.serverRoomName;
      DataRackPlacement.value = item.rackPlacement;
      HeightOfDataRack.value = item.totalUnits;
      availableDataRackUnits.value = item.availableUnits;
      DatarackStatus.value = item.rackStatus;
      break;
    case 'Company':
      CompanyName.value = item.name;
      CompanyDescription.value = item.description;
      break;
    case 'DataCenter':
      DataCenterName.value = item.name;
      DataCenterAddresse.value = item.address;
      DataCenterBeskrivelse.value = item.description;
      selectedCompanyID.value = item.companyID;
      break;
    case 'ServerRoom':
      selectedDataCenterID.value = item.dataCenterID;
      ServerRoomName.value = item.serverRoomName;
      ServerRoomRackCapacity.value = item.rackCapacity;
      break;
  }

  toggleDialog(); 
}

function deleteItem(item) {
  const confirmDelete = confirm(`Are you sure you want to delete this ${activeType.value}? This cannot be undone.`);
  if (confirmDelete) {
    let idKey;
    switch (activeType.value) {
      case 'DataRack':
        idKey = 'dataRackID';
        break;
      case 'Company':
        idKey = 'companyID';
        break;
      case 'DataCenter':
        idKey = 'dataCenterID';
        break;
      case 'ServerRoom':
        idKey = 'serverRoomID';
        break;
      default:
        console.error('Unsupported type for deletion');
        return;
    }

    // Pass idKey to the deleteData action
    dataStore.deleteData(activeType.value, item[idKey], idKey)
      .then(() => {
        console.log('Item deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting item:', error);
      });
  }
}

function viewDetails(item) {
  console.log('View details for item:', item.dataRackID);
  dataRackStore.setDataRackId(item.dataRackID);
  router.push('/DataRackDetails');
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