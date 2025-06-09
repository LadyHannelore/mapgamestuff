<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
    <p class="mt-4 text-gray-600">Manage your brigades, generals, and battles here.</p>

    <!-- Brigade Form -->
    <div class="mt-6 bg-white p-4 rounded shadow">
      <h2 class="text-xl font-semibold text-gray-700">Create a Brigade</h2>
      <form @submit.prevent="addBrigade" class="mt-4 space-y-4">
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
          <select v-model="newBrigade.type" id="type" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option value="Cavalry">Cavalry</option>
            <option value="Heavy">Heavy</option>
            <option value="Light">Light</option>
            <option value="Ranged">Ranged</option>
            <option value="Support">Support</option>
          </select>
        </div>
        <div>
          <label for="enhancement" class="block text-sm font-medium text-gray-700">Enhancement</label>
          <input v-model="newBrigade.enhancement" id="enhancement" type="text" placeholder="e.g., Life Guard" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label for="stats" class="block text-sm font-medium text-gray-700">Stats</label>
          <input v-model="newBrigade.stats" id="stats" type="text" placeholder="e.g., +2 Defense" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Brigade</button>
      </form>
    </div>

    <!-- Brigade List -->
    <div v-if="brigades.length" class="mt-8">
      <h2 class="text-xl font-semibold text-gray-700">Brigades</h2>
      <ul class="mt-4 space-y-2">
        <li v-for="(brigade, index) in brigades" :key="index" class="p-4 bg-white rounded shadow">
          <p><strong>Type:</strong> {{ brigade.type }}</p>
          <p><strong>Enhancement:</strong> {{ brigade.enhancement }}</p>
          <p><strong>Stats:</strong> {{ brigade.stats }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// State for brigades
const brigades = ref([]);
const newBrigade = ref({
  type: 'Cavalry',
  enhancement: '',
  stats: '',
});

// Function to add a brigade
function addBrigade() {
  if (newBrigade.value.enhancement && newBrigade.value.stats) {
    brigades.value.push({ ...newBrigade.value });
    newBrigade.value.enhancement = '';
    newBrigade.value.stats = '';
  }
}
</script>

<style scoped>
/* Add any custom styles for the dashboard here */
</style>
