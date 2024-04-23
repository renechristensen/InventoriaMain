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
const activeType = ref('User');

const activeTypeLabel = computed(() => {
  return activeType.value === 'User' ? 'User' : 'Role';
});

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

function toggleDialog() {
  dataStore.dialogIsActive = !dataStore.dialogIsActive;
}

function editItem(item) {
  // Implement editing logic based on item details
}

function deleteItem(item) {
  if (confirm(`Are you sure you want to delete this ${activeType.value}? This cannot be undone.`)) {
    dataStore.deleteData(activeType.value, item.id);
  }
}

function setActiveDataType(type) {
  activeType.value = type;
  dataStore.setActiveType(type);
  dataStore.fetchData(type);
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
