<template>
  <div>
    <h1>Data Rack Details</h1>
    <p>Data Rack ID: {{ dataRackId }}</p>
    <!-- More details here -->
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDataRackStore } from '@/stores/dataRackStore';

const dataRackStore = useDataRackStore();

const dataRackId = computed(() => dataRackStore.currentDataRackId);
</script>
