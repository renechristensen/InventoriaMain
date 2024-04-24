<template>
  <v-container fluid>
    <v-row>
      <Sidebar />
      <v-col cols="12">
        <div class="home-content">
          <!-- Action Buttons -->
          <div class="button-group">
            <v-btn @click="setActiveDataType('User')">Brugere</v-btn>
            <v-btn @click="setActiveDataType('Role')">Roller</v-btn>
            <v-btn color="primary" @click="toggleDialog">Opret {{ activeTypeLabel }}</v-btn>
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
                  {{ header.key === 'lastLoginDate' ? formatDate(item[header.key]) : item[header.key] }}
                </td>
                <td>
                  <v-btn icon @click="editItem(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon @click="deleteItem(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn icon v-if="activeType === 'User'" @click="openAssignRoleDialog(item)">
                    <v-icon>mdi-account-check-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>


          <!-- Dialogs for Creating and Editing Users and Roles -->
          <v-dialog v-model="dialogIsActive" max-width="500px">
            <!-- User Dialog -->
            <template v-if="activeType === 'User'">
              <v-card>
                <v-card-title>{{ isEditMode ? 'Rediger Bruger' : 'Opret Bruger' }}</v-card-title>
                <v-card-text>
                  <v-text-field label="Display Navn" v-model="displayName" required outlined></v-text-field>
                  <v-text-field label="Arbejds Email" v-model="studieEmail" required outlined :rules="emailRules"></v-text-field>
                  <v-text-field label="Password" v-model="password" type="password" required outlined :rules="passwordRules"></v-text-field>
                  <v-select 
                    label="Virksomhed" 
                    v-model="selectedCompanyID"
                    :items="companyItems"
                    item-title="companyName"
                    item-value="companyID"
                    required outlined>
                  </v-select>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="toggleDialog">Annuller</v-btn>
                  <v-btn color="primary" @click="saveData">Gem</v-btn>
                </v-card-actions>
              </v-card>
            </template>

            <!-- Role Dialog -->
            <template v-if="activeType === 'Role'">
              <v-card>
                <v-card-title>{{ isEditMode ? 'Rediger Rolle' : 'Opret Rolle' }}</v-card-title>
                <v-card-text>
                  <v-text-field label="Rolle Titel" v-model="roleName" required outlined></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="toggleDialog">Annuller</v-btn>
                  <v-btn color="primary" @click="saveData">Gem</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

          <!-- Role Assignment Dialog -->
          <v-dialog v-model="roleDialogActive" max-width="500px">
            <v-card>
              <v-card-title>Assign Role</v-card-title>
              <v-card-text>
                <v-select 
                  label="Select Role" 
                  v-model="selectedRole"
                  :items="roleItems"
                  item-title="roleName"
                  item-key="roleID"
                  return-object
                  outlined>
                </v-select>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="assignRole">Giv Rolle</v-btn>
                <v-btn color="primary" @click="closeRoleDialog">Annuller</v-btn>
              </v-card-actions>
            </v-card>
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
const activeType = ref('User');
const dialogIsActive = ref(false);
const isEditMode = ref(false);
const editID = ref(null);
const displayName = ref('');
const studieEmail = ref('');
const password = ref('');
const companyID = ref(null);
const roleName = ref('');
const itemID = ref('');
const selectedCompanyID = ref(null);
const roleDialogActive = ref(false);
const selectedRole = ref(null);

const activeTypeLabel = computed(() => activeType.value === 'User' ? 'Brugere' : 'Roller');

const headers = computed(() => ({
  User: [
    { title: 'Display Navn', key: 'displayname' },
    { title: 'Arbejds Email', key: 'studieEmail' },
    { title: 'Virksomhed', key: 'companyName' },
    { title: 'Sidste login', key: 'lastLoginDate' },
    { title: 'Roller', key: 'roles' },
    { title: 'Actions', key: 'actions', sortable: false }
  ],
  Role: [
    { title: 'Rolle Titel', key: 'roleName' },
    { title: 'Actions', key: 'actions', sortable: false }
  ]
}));

const companyItems = computed(() => {
  return dataStore.data['Company']?.map(company => ({
    companyName: company.name,
    companyID: company.companyID
  })) || [];
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' });
}
const roleItems = computed(() => {
  return dataStore.data['Role']?.map(role => ({
    roleName: role.roleName,
    roleID: role.roleID
  })) || [];
});

onMounted(() => {
  setActiveDataType('Role');
  setActiveDataType('Company');
  setActiveDataType('User');
});

const emailRules = [v => !!v || 'E-mail is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid'];
const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 8 || 'Password must be at least 8 characters',
  v => /[A-Za-z]/.test(v) && /\d/.test(v) && /[\s\S]*[\W_]+[\s\S]*/.test(v) || 'Password must include letters, numbers, and special characters'
];

function openAssignRoleDialog(item) {
  console.log(item);
  itemID.value = item.userID;
  roleDialogActive.value = true;
}

function closeRoleDialog() {
  roleDialogActive.value = false;
}

function assignRole() {
  console.log("itemID.value =" + itemID.value);
  console.log(selectedRole.value.roleID);
  const payload = {
    userId: itemID.value,
    roleId: selectedRole.value.roleID
  };
  // Assuming `assignUserRole` is an action in your Vuex store
  dataStore.assignUserRole(payload).then(() => {
    console.log('Role assigned successfully');
    closeRoleDialog();
  }).catch(error => {
    console.error('Error assigning role:', error);
  });
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
  User: 'userID',
  Role: 'roleID'
};
function editItem(item) {
  isEditMode.value = true;
  editID.value = item[idFieldMapping[activeType.value]];

  if (activeType.value === 'User') {
    displayName.value = item.displayname;
    studieEmail.value = item.studieEmail;
    selectedCompanyID.value = item.companyID;
    password.value = ''; 
  } else if (activeType.value === 'Role') {
    roleName.value = item.roleName;
  }
  toggleDialog();
}

function saveData() {
  let payload = {};
  if (activeType.value === 'User') {
    payload = {
      id: isEditMode.value ? editID.value : undefined,
      displayname: displayName.value,
      studieEmail: studieEmail.value,
      companyID: selectedCompanyID.value
    };
        // Include password only if it has been set
    if (password.value) { 
      payload.password = password.value;
    }
  } else if (activeType.value === 'Role') {
    payload = {
      id: isEditMode.value ? editID.value : undefined,
      roleName: roleName.value
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
  if(activeType.value === "Role") {itemID.value = item.roleID; }
  if(activeType.value === "User") {itemID.value = item.userID; }

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
