<template>
  <v-container fluid>
    <v-row>
      <Sidebar />
      <v-col cols="12">
        <div class="home-content">
          <!-- Action Buttons -->
          <div class="button-group">
            <v-btn>Rediger adgangsrettigheder</v-btn>
            <v-btn>Rediger</v-btn>
          </div>

          <!-- Column layout for data display -->
          <v-row>
            <v-col cols="12">
              <div class="details-card">
                <div v-for="(value, key) in dataDetails" :key="key" class="detail-item">
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

          <!-- Data table for data display -->
          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="tableHeaders"
                :items="[dataDetails]"
                class="elevation-1"
              ></v-data-table>
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
const activeType = ref('DataRack');

onMounted(async () => {
  if (!dataRackStore.currentDataRackId) {
    router.push('/home'); // Ensure you define the 'home' route in your router
  } else {
    await dataStore.fetchDataById(activeType.value, dataRackStore.currentDataRackId);
  }
});

const dataDetails = computed(() => {
  return dataStore.data.currentData || {};
});

const formattedRoles = computed(() => {
  return dataDetails.value.roles ? dataDetails.value.roles.join(", ") : "";
});

const formattedDate = computed(() => {
  if (dataDetails.value.rackStartupDate) {
    return new Date(dataDetails.value.rackStartupDate).toLocaleDateString('en-GB');
  }
  return "";
});

const headersMap = {
  'rackPlacement': 'Placering',
  'dataRackID' : 'DatabaseID',
  'rackStartupDate': 'Opstart',
  'rackStatus' : 'Status',
  'totalUnits' : 'Enheder(U)',
  'availableUnits' : 'Ledige Enheder(U)',
  'companyName': 'Virksomhed',
  'dataCenterName': 'Data Center',
  'serverRoomName': 'Server lokale',
  'datarackName': 'Navn',
  'roles': 'Rolle'
};

const tableHeaders = computed(() => [
  { title: 'Placering', key: 'rackPlacement' },
  { title: 'Virksomhed', key: 'companyName' },
  { title: 'Data Center', key: 'dataCenterName' },
  { title: 'Server lokale', key: 'serverRoomName' },
  { title: 'Navn', key: 'datarackName' },
]);
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
</style>
