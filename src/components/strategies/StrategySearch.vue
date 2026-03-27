<template>
  <input v-model="keyword" placeholder="Search strategy"
    class="strategy-search-input w-full rounded-xl px-4 py-3 text-sm" @input="emit('search', keyword)" />
</template>

<script setup>
import { ref } from 'vue'

const keyword = ref('')
const emit = defineEmits(['search'])
</script>

<style scoped>
.strategy-search-input {
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--input-text);
}

.strategy-search-input::placeholder {
  color: var(--input-placeholder);
}

.strategy-search-input:focus {
  outline: none;
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 2px var(--input-focus-ring);
}
</style>