<template>
  <v-container fluid>
    <v-row>
      <Sidebar />
      <v-col cols="12">
        <div class="home-content">
          <!-- Action Buttons -->
          <div class="button-group">
            <v-btn @click="setActiveDataType('EnvironmentalReading')">Miljø målinger</v-btn>
            <v-btn @click="setActiveDataType('EnvironmentalSetting')">Miljø advarsels indstillinger</v-btn>
            <v-btn color="primary" @click="toggleDialog" v-if="activeType === 'EnvironmentalSetting'">Opret {{ activeTypeLabel }}</v-btn>          </div>

          <!-- Display Data -->
          <div>
            <!--{{ dataStore.data[activeType] }}-->
          </div>

          <!-- Searchable Data Table -->
          <v-data-table :headers="headers[activeType]" :items="dataStore.data[activeType]" class="elevation-1">
            <template #item="{ item }">
              <tr>
                <td v-for="header in headers[activeType].filter(h => h.key !== 'actions')" :key="header.key">
                  {{ header.key === 'readingTimestamp' ? formatDate(item[header.key]) : item[header.key] }}
                </td>
                <td>
                  <template v-if="activeType === 'EnvironmentalSetting'">
                    <v-btn icon @click="editItem(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteItem(item)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </td>
              </tr>
            </template>
          </v-data-table>

          <!-- Dialogs for Creating and Editing Environmental Readings and Settings -->
          <v-dialog v-model="dialogIsActive" max-width="500px">
            <!-- EnvironmentalReading Dialog -->
            <template v-if="activeType === 'EnvironmentalReading'">
              <v-card>
                <v-card-title>{{ isEditMode ? 'Edit Environmental Reading' : 'Create Environmental Reading' }}</v-card-title>
                <v-card-text>
                  <v-text-field label="Temperature" v-model="temperature" required outlined></v-text-field>
                  <v-text-field label="Humidity" v-model="humidity" required outlined></v-text-field>
                  <v-text-field label="Timestamp" v-model="readingTimestamp" hint="Optional" persistent-hint outlined></v-text-field>
                  <v-text-field label="Settings ID" v-model="environmentalSettingsID" required outlined></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="toggleDialog">Cancel</v-btn>
                  <v-btn color="primary" @click="saveData">Save</v-btn>
                </v-card-actions>
              </v-card>
            </template>

            <!-- EnvironmentalSetting Dialog -->
            <template v-if="activeType === 'EnvironmentalSetting'">
              <v-card>
                <v-card-title>{{ isEditMode ? 'Edit Environmental Setting' : 'Create Environmental Setting' }}</v-card-title>

                <v-card-text>
                    <v-select
                    label="Vælg server rum"
                    :items="serverRoomItems"
                    item-title="ServerRoomName"
                    item-value="serverRoomID"
                    v-model="serverRoomID"
                    outlined
                  ></v-select>
                  <v-text-field label="Temperature Upper Limit" v-model="temperatureUpperLimit" required outlined></v-text-field>
                  <v-text-field label="Temperature Lower Limit" v-model="temperatureLowerLimit" required outlined></v-text-field>
                  <v-text-field label="Humidity Upper Limit" v-model="humidityUpperLimit" required outlined></v-text-field>
                  <v-text-field label="Humidity Lower Limit" v-model="humidityLowerLimit" required outlined></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="toggleDialog">Cancel</v-btn>
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
import { ref, computed, onMounted } from 'vue';
import Sidebar from '@/components/Sidebar';
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();
const activeType = ref('EnvironmentalReading');
const dialogIsActive = ref(false);
const isEditMode = ref(false);
const editID = ref(null);

// Fields for EnvironmentalReading and EnvironmentalSetting
const temperature = ref('');
const humidity = ref('');
const readingTimestamp = ref('');
const environmentalSettingsID = ref('');
const serverRoomID = ref('');
const temperatureUpperLimit = ref('');
const temperatureLowerLimit = ref('');
const humidityUpperLimit = ref('');
const humidityLowerLimit = ref('');
const itemID = ref('');

// Computed properties for labels and headers
const activeTypeLabel = computed(() => {
  return activeType.value === 'EnvironmentalReading' ? 'Miljø Målinger' : 'Miljø advarsels indstillinger';
});

const headers = computed(() => ({
  EnvironmentalReading: [
    { title: 'Temperatur', key: 'temperature' },
    { title: 'Luftfugtighed', key: 'humidity' },
    { title: 'Tidspunkt', key: 'readingTimestamp' },
    { title: 'Handlinger', key: 'actions', sortable: false }
  ],
  EnvironmentalSetting: [
    { title: 'Lokal', key: 'serverRoomName' },
    { title: 'Temperatur Øvre Grænse', key: 'temperatureUpperLimit' },
    { title: 'Temperature Nedre Grænse', key: 'temperatureLowerLimit' },
    { title: 'Luftfugtighed Øvre Grænse', key: 'humidityUpperLimit' },
    { title: 'Luftfugtighed Øvre Grænse', key: 'humidityLowerLimit' },
    { title: 'Handlinger', key: 'actions', sortable: false }
  ]
}));

const serverRoomItems = computed(() => {
  return dataStore.data['ServerRoom']?.map(ServerRoom => ({
    serverRoomID: ServerRoom.serverRoomID,
    ServerRoomName: ServerRoom.serverRoomName
  })) || [];
});

onMounted(() => {
  setActiveDataType('ServerRoom');
  setActiveDataType('EnvironmentalSetting');
  setActiveDataType('EnvironmentalReading');
});

function setActiveDataType(type) {
  activeType.value = type;
  dataStore.setActiveType(type);
  dataStore.fetchData(type);
  resetFields();
}

function toggleDialog() {
  dialogIsActive.value = !dialogIsActive.value;
  if (!dialogIsActive.value) {
    resetFields();
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' });
}
function resetFields() {
  editID.value = null;
  temperature.value = '';
  humidity.value = '';
  readingTimestamp.value = '';
  environmentalSettingsID.value = '';
  serverRoomID.value = '';
  temperatureUpperLimit.value = '';
  temperatureLowerLimit.value = '';
  humidityUpperLimit.value = '';
  humidityLowerLimit.value = '';
  isEditMode.value = false;
}

const idFieldMapping = {
  EnvironmentalSetting: 'environmentalSettingsID'
};

function editItem(item) {
  isEditMode.value = true;

  editID.value = item[idFieldMapping[activeType.value]];
  console.log(item[idFieldMapping[activeType.value]]);
  if (activeType.value === 'EnvironmentalReading') {
    temperature.value = item.temperature;
    humidity.value = item.humidity;
    readingTimestamp.value = item.readingTimestamp;
    environmentalSettingsID.value = item.environmentalSettingsID;
  } else if (activeType.value === 'EnvironmentalSetting') {
    serverRoomID.value = item.serverRoomID;
    temperatureUpperLimit.value = item.temperatureUpperLimit;
    temperatureLowerLimit.value = item.temperatureLowerLimit;
    humidityUpperLimit.value = item.humidityUpperLimit;
    humidityLowerLimit.value = item.humidityLowerLimit;
  }
  toggleDialog();
}

function saveData() {
  let payload = {};
  if (activeType.value === 'EnvironmentalReading') {
    payload = {
      id: isEditMode.value ? editID.value : undefined,
      temperature: temperature.value,
      humidity: humidity.value,
      readingTimestamp: readingTimestamp.value,
      environmentalSettingsID: environmentalSettingsID.value
    };
  } else if (activeType.value === 'EnvironmentalSetting') {
    payload = {
      id: isEditMode.value ? editID.value : undefined,
      serverRoomID: serverRoomID.value,
      temperatureUpperLimit: temperatureUpperLimit.value,
      temperatureLowerLimit: temperatureLowerLimit.value,
      humidityUpperLimit: humidityUpperLimit.value,
      humidityLowerLimit: humidityLowerLimit.value
    };
  }

  console.log(payload);
  const action = isEditMode.value ? 'updateData' : 'createData';
  dataStore[action](activeType.value, payload).then(() => {
    toggleDialog();
    isEditMode.value = false;
    resetFields();
  }).catch(error => {
    console.error(`${isEditMode.value ? 'Update' : 'Create'} failed:`, error);
  });
}


function deleteItem(item) {
  itemID.value = item.id;
  console.log(item);
  if(activeType.value === "EnvironmentalSetting") {itemID.value = item.environmentalSettingsID; }
  if(activeType.value === "EnvironmentalReading") {itemID.value = item.environmentalReadingID; }

  if (confirm(`Are you sure you want to delete this ${activeType.value}? This cannot be undone.`)) {
    dataStore.deleteData(activeType.value, itemID.value).then(() => {
      console.log('Item deleted successfully');
    }).catch(error => {
      console.error('Error deleting item:', error);
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
