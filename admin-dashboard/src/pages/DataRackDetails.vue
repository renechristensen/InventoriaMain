<template>
  <v-container fluid>
    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Data Rack</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editData.datarackName" label="Data Rack Name" :rules="[v => !!v || 'Name is required']"></v-text-field>
                <v-text-field v-model="editData.RackPlacement" label="Rack Placement" :rules="[v => !!v || 'Rack Placement is required']"></v-text-field>
                <v-text-field v-model="editData.TotalUnits" type="number" label="Total Units" :rules="[v => v > 0 || 'Must be at least 1']"></v-text-field>
                <v-text-field v-model="editData.AvailableUnits" type="number" label="Available Units" :rules="[v => v >= 0 || 'Cannot be negative']"></v-text-field>
                <v-text-field v-model="editData.Status" label="Status" :rules="[v => !!v || 'Status is required']"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="submitEditData">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- New Dialog for Editing Access Permissions -->
    <v-dialog v-model="accessPermissionsDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Access Permissions</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="selectedRoleId"
                  :items="roleItems"
                  item-title="roleName"
                  item-value="roleID"
                  label="Select Role"
                  :rules="[v => !!v || 'A role is required']"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="submitAccessPermissions">Save</v-btn>
          <v-btn color="red darken-1" text @click="closeAccessPermissionsDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <Sidebar />
      <v-col cols="12">
        <div class="home-content">
          <!-- Action Buttons -->
          <div class="button-group">
            <v-btn @click="openAccessPermissionsDialog">Rediger adgangsrettigheder</v-btn>
            <v-btn @click="openEditDialog">Rediger</v-btn>
          </div>

          <!-- Column layout for data display -->
          <v-row>
            <v-col cols="12">
              <div class="details-card">
                <div v-for="(value, key) in dataRackDetails" :key="key" class="detail-item">
                  <div class="detail-header">{{ headersMap[key] }}</div>
                  <div class="detail-content">
                    <!-- Conditional rendering for roles and date -->
                    {{ key === 'roles' ? formattedRoles :
                      (key === 'rackStartupDate' ? formattedDate : value) }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
            
        <div>
          <!--{{ dataStore.data['RackUnit'] }}-->
        </div>

          <!-- Data table for data display -->
          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="dataUnitTableHeaders"
                :items="dataStore.data['RackUnit']"
                class="elevation-1"
              >
                <template v-slot:item="{ item }">
                  <tr :class="getRowClass(item)">
                    <td v-for="header in dataUnitTableHeaders" :key="header.key">
                      {{ item[header.key] }}
                    </td>
                    <!-- Conditional rendering of the Delete button -->
                    <td v-if="item.startDate && item.endDate">
                      <v-btn 
                        icon 
                        @click="deleteReservation(item.rackUnitID, item.startDate, item.endDate)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </td>
                    <!--styling issue, its being set to not show up so it doesn't set the backgroundcolor on the last part-->
                    <td v-if="!item.startDate && !item.endDate">
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import Sidebar from '@/components/Sidebar';
import { useDataStore } from '@/stores/data';
import { useDataRackStore } from '@/stores/dataRackStore';

const router = useRouter();
const dataRackStore = useDataRackStore();
const dataStore = useDataStore();

const accessPermissionsDialog = ref(false);
const selectedRoleId = ref(null);
// Dialog state and editing data setup
const editDialog = ref(false);
const editData = ref({
  datarackName: '',
  RackPlacement: '',
  TotalUnits: 0,
  AvailableUnits: 0,
  Status: ''
});

function openEditDialog() {
  // This function is triggered when you want to open the dialog to edit a data rack.
  if (dataRackStore.currentDataRackId && dataStore.data.dataRackByIDData) {
    const currentData = dataStore.data.dataRackByIDData;
    editData.value = {
      datarackName: currentData.datarackName || '',
      RackPlacement: currentData.rackPlacement || '',
      TotalUnits: currentData.totalUnits || 0,
      AvailableUnits: currentData.availableUnits || 0,
      Status: currentData.rackStatus || ''
    };
  }
  editDialog.value = true;
}

function closeEditDialog() {
  editDialog.value = false;
}

async function submitEditData() {
  // Submit the updated data through the store
  try {
    const payload = { id: dataRackStore.currentDataRackId, ...editData.value };
    await dataStore.updateData('DataRack', payload);
    await dataStore.fetchDataById('DataRack', dataRackStore.currentDataRackId); // Refresh the details
    alert('Data Rack updated successfully');
    closeEditDialog();
  } catch (error) {
    console.error('Failed to update Data Rack:', error);
    alert('Failed to update Data Rack');
  }
}
function openAccessPermissionsDialog() {
  if (dataRackStore.currentDataRackId) {
    accessPermissionsDialog.value = true;
    // Optionally load roles here if not preloaded
  } else {
    console.error("No Data Rack ID found.");
  }
}

function closeAccessPermissionsDialog() {
  accessPermissionsDialog.value = false;
}

const roleItems = computed(() => {
  return dataStore.data['Role']?.map(role => ({
    roleName: role.roleName,
    roleID: role.roleID
  })) || [];
});

// Ensure the needed data is fetched on component mount
onMounted(async () => {
  if (!dataRackStore.currentDataRackId) {
    router.push('/home');
  } else {
    await dataStore.fetchDataById('DataRack', dataRackStore.currentDataRackId);
    await dataStore.fetchDataById('RackUnit', dataRackStore.currentDataRackId);
    dataStore.setActiveType('Role');
  }
});

async function submitAccessPermissions() {
  try {
    const payload = {
      dataRackID: dataRackStore.currentDataRackId,
      roleID: selectedRoleId.value
    };

    console.log(payload);
    await dataStore.createData('RackAccessPermission', payload);
    alert('Access permissions updated successfully');
    closeAccessPermissionsDialog();
  } catch (error) {
    console.error('Failed to update access permissions:', error);
    alert('Failed to update access permissions');
  }
}


// Computed properties for displaying data
const dataRackDetails = computed(() => dataStore.data.dataRackByIDData || {});
const formattedRoles = computed(() => dataRackDetails.value.roles ? dataRackDetails.value.roles.join(", ") : "");
const formattedDate = computed(() => dataRackDetails.value.rackStartupDate ? new Date(dataRackDetails.value.rackStartupDate).toLocaleDateString('en-GB') : "");

const headersMap = {
  'rackPlacement': 'Placering',
  'dataRackID' : 'DatabaseID',
  'rackStartupDate': 'Opstart',
  'rackStatus' : 'Status',
  'totalUnits' : 'Enheder(Unit)',
  'availableUnits' : 'Ledige Enheder(Unit)',
  'companyName': 'Virksomhed',
  'dataCenterName': 'Data Center',
  'serverRoomName': 'Server lokale',
  'datarackName': 'Navn',
  'roles': 'RolleAdgang'
};

const dataUnitTableHeaders = computed(() => [
  { title: 'Unit', key: "unitNumber"},
  { title: 'Res', key: "displayName"},
  { title: 'Studie email', key: "studieEmail"},
  { title: 'Start', key: 'startDate'},
  { title: 'Slut', key: 'endDate'},
  { title: 'Udstyr titel', key: 'equipmentName'}, 
  { title: 'type', key: 'equipmentType'},
  { title: 'model', key: 'equipmentModel'},
]);

function getRowClass(item) {
  if (item.displayName && item.equipmentName) {
    return 'red-row'; 
  } else if (item.displayName) {
    return 'blue-row'; 
  }
  return 'green-row';
}

function deleteReservation(rackUnitID, startDate, endDate) {
  const confirmed = window.confirm(`Are you sure you want to delete the reservation for Rack Unit ID ${rackUnitID} from ${startDate} to ${endDate}?`);
  if (confirmed) {
    dataStore.deleteReservationsByRackUnit(rackUnitID, startDate, endDate)
      .then(() => {
        alert('Reservation deleted successfully.');
        dataStore.fetchData('RackUnit'); // Optionally fetch data again if needed
      })
      .catch(error => {
        console.error('Failed to delete reservation:', error);
        alert('Failed to delete the reservation.');
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
  text-align: left;
  margin-bottom: 20px;
}
.details-card {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: inline-block;
}
.detail-item {
  display: flex;
  padding: 8px 0;
  align-items: center;
}
.detail-header {
  font-weight: bold;
  min-width: 230px;
}
.detail-content {
  padding-left: 12px;
}

.red-row {
  background-color: #ffcccc;
}
.blue-row {
  background-color: #ccccff;
}
.green-row {
  background-color: #ccffcc;
}

</style>
