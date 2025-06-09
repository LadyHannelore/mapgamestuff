<template>
  <div class="card">
    <slot />
  </div>
</template>

<script setup lang="ts">
// No props or emits for now, purely presentational
</script>

<style scoped>
.card {
  @apply p-4 bg-white shadow-md rounded-lg;
}
</style>
