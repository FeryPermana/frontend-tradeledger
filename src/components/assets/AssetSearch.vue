<template>
  <input v-model="keyword" placeholder="Search asset" class="input-field w-full rounded-xl px-4 py-3"
    @input="emitSearch" />
</template>

<script setup>
import { ref } from 'vue'

const keyword = ref('')
const emit = defineEmits(['search'])

function emitSearch() {
  emit('search', keyword.value)
}
</script>

<style scoped>
.input-field {
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--input-text);
}

.input-field::placeholder {
  color: var(--input-placeholder);
}

.input-field:focus {
  outline: none;
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 2px var(--input-focus-ring);
}
</style>