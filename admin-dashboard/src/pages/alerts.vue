<template>
  <v-container fluid>
    <v-row>
      <Sidebar />
      <v-col cols="12">
        <div class="home-content">
          <!-- Action Buttons -->
          <div class="button-group">
            <v-btn @click="setActiveDataType('Alert')">Alarmer</v-btn>
            <v-btn @click="setActiveDataType('AlertType')">Alarmtype</v-btn>

            <v-btn color="primary" @click="toggleDialog" v-if="activeType !== 'Alert'">Opret {{ activeTypeLabel }}</v-btn>
          </div>

          <!-- Display Data -->
          <div>
            {{ dataStore.data[activeType] }}
          </div>

          <!-- Searchable Data Table -->
          <v-data-table :headers="headers[activeType]" :items="dataStore.data[activeType]" class="elevation-1">
            <template #item="{ item }">
              <tr>
                <td v-for="header in headers[activeType].filter(h => h.key !== 'actions')" :key="header.key">
                  {{ item[header.key] }}
                </td>
                <td>
                  <v-btn icon @click="editItem(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon @click="deleteItem(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>

          <v-dialog v-model="dialogIsActive" max-width="500px">
            <!-- Alert Dialog -->
            <template v-if="activeType === 'Alert'">
              <v-card>
                <v-card-title>{{ isEditMode ? 'Rediger Alarm' : 'Opret Alarm' }}</v-card-title>
                <v-card-text>
                  <!-- Checkbox for Resolved -->
                  <v-checkbox
                    label="Løst"
                    v-model="resolved"
                  ></v-checkbox>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="toggleDialog">Annuller</v-btn>
                  <v-btn color="primary" @click="saveData">Gem</v-btn>
                </v-card-actions>
              </v-card>
            </template>

            <!-- Alert Type Dialog -->
            <template v-if="activeType === 'AlertType'">
              <v-card>
                <v-card-title>{{ isEditMode ? 'Rediger Alarm Type' : 'Opret Alarm Type' }}</v-card-title>
                <v-card-text>
                  <!-- Input for Alert Type Name -->
                  <v-text-field
                    label="Navn på alarmtype"
                    v-model="alertTypeName"
                    :rules="[v => !!v || 'Navn er påkrævet']"
                    required
                    outlined
                  ></v-text-field>

                  <!-- Input for Alert Type Description -->
                  <v-textarea
                    label="Beskrivelse"
                    v-model="alertTypeDescription"
                    outlined
                    rows="3"
                  ></v-textarea>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="toggleDialog">Annuller</v-btn>
                  <v-btn color="primary" @click="saveData">Gem</v-btn>
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
import { ref, computed, watch, onMounted } from 'vue';
import Sidebar from '@/components/Sidebar';
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();
const activeType = ref('Alert');
const dialogIsActive = ref(false);
const isEditMode = ref(false);
const editID = ref(null);
const displayName = ref('');
const studieEmail = ref('');
const password = ref('');
const roleName = ref('');
const itemID = ref('');
const selectedCompanyID = ref(null);
const roleDialogActive = ref(false);
const selectedRole = ref(null);

//alert reactive types
const resolved = ref(false);

// AlertType form properties
const alertTypeName = ref('');
const alertTypeDescription = ref('');

// figure out which label to use when configuring rediger and create text boxes
const activeTypeLabel = computed(() => activeType.value === 'Alert' ? 'Alarm' : 'Alarm Type');

const headers = computed(() => ({
  Alert: [
    {title: 'Lokation', key:'serverRoomName'},
    {title: 'Tidspunkt', key: 'alertTimestamp'},
    {title: 'Fejlbesked', key: 'alertTypeDescription'},
    {title: 'Håndteret', key: 'resolved'}
  ],
  AlertType: [
    {title: 'Navn', key: 'typeName' },
    { title: 'Beskrivelse', key: 'description'}

  ]
}));

onMounted(() => {
  setActiveDataType('AlertType');
  setActiveDataType('Alert');
});

function closeRoleDialog() {
  roleDialogActive.value = false;
}

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

const idFieldMapping = {
  Alert: 'alertID',
  AlertType: 'alertTypeID'
};

function editItem(item) {
  isEditMode.value = true;
  console.log(item[idFieldMapping[activeType.value]]);
  editID.value = item[idFieldMapping[activeType.value]];
  if (activeType.value === 'Alert') {
    resolved.value = item.resolved;
  } else if(activeType.value === 'AlertType'){
    alertTypeName.value = item.typeName;
    alertTypeDescription.value = item.description;
  }
  toggleDialog();
}

function saveData() {
  let payload = {};
  if (activeType.value === 'Alert') {
    payload = {
      id: isEditMode.value ? editID.value : undefined,
      Resolved: resolved.value
    };
    dataStore.updateData(activeType.value, payload).then(() => {
      console.log('Alert update successful');
      toggleDialog();
      isEditMode.value = false;
      resetFields();
    }).catch(error => {
      console.error('Failed to update alert:', error);
    });
    return;
  }

  else if(activeType.value === 'AlertType'){
    payload = {
      id: isEditMode.value ? editID.value : undefined,
      typeName: alertTypeName.value,
      description: alertTypeDescription.value
    };
  };



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
  if(activeType.value === "Alert") {itemID.value = item.alertID; }
  if(activeType.value === "AlertType") {itemID.value = item.alertTypeID; }

  if (confirm(`Are you sure you want to delete this ${activeType.value}? This cannot be undone.`)) {
    dataStore.deleteData(activeType.value, itemID.value).then(() => {
      console.log('Item deleted successfully');
    }).catch(error => {
      console.error('Error deleting item:', error);
    });
  }
}

function resetFields() {
  editID.value = null;
  displayName.value = '';
  studieEmail.value = '';
  password.value = '';
  selectedCompanyID.value = null;
  roleName.value = '';
  isEditMode.value = false;
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
