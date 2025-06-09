<template>
  <button :class="buttonClass" @click="onClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary',
  },
});

defineEmits(['click']);

const onClick = () => {
  emit('click');
};

const buttonClass = computed(() => {
  return [
    'px-4 py-2 rounded font-semibold',
    variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black',
  ];
});
</script>

<style scoped>
button {
  transition: background-color 0.3s;
}

button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
