<template>
  <div class="space-y-3">
    <div v-for="item in items" :key="item.id" class="surface-card rounded-2xl p-4 shadow-xl">
      <div class="space-y-3">
        <div>
          <p class="page-title break-words text-base font-semibold">
            {{ item.name }}
          </p>
          <p class="page-subtitle mt-1 text-sm">
            {{ formatType(item.type) }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="surface-soft rounded-xl p-3">
            <p class="page-caption text-xs">Currency</p>
            <p class="page-title mt-1 text-sm font-medium">
              {{ item.currency }}
            </p>
          </div>

          <div class="surface-soft rounded-xl p-3">
            <p class="page-caption text-xs">Initial Balance</p>
            <p class="page-title mt-1 break-words text-sm font-medium">
              {{ formatCurrency(item.initial_balance, item.currency) }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-3 gap-2">
        <button class="btn-soft rounded-xl px-3 py-2 text-sm font-medium" @click="$emit('view', item.id)">
          View
        </button>

        <button class="btn-outline rounded-xl px-3 py-2 text-sm font-medium transition" @click="$emit('edit', item.id)">
          Edit
        </button>

        <button
          class="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
          @click="$emit('delete', item.id)">
          Delete
        </button>
      </div>
    </div>

    <div v-if="!items.length" class="surface-card rounded-2xl p-6 text-center text-sm page-subtitle">
      No accounts found.
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/formatters'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['view', 'edit', 'delete'])

function formatType(type) {
  if (type === 'intra_day') return 'Intra Day'
  if (!type) return '-'
  return type.charAt(0).toUpperCase() + type.slice(1)
}
</script>

<style scoped>
.surface-card {
  border: 1px solid var(--surface-card-border);
  background: var(--surface-card-bg);
}

.surface-soft {
  border: 1px solid var(--surface-soft-border);
  background: var(--surface-soft-bg);
}

.page-title {
  color: var(--text-title);
}

.page-subtitle {
  color: var(--text-muted);
}

.page-caption {
  color: var(--text-caption);
}

.btn-soft {
  background: var(--button-soft-bg);
  color: var(--button-soft-text);
}

.btn-soft:hover {
  background: var(--button-soft-hover);
}

.btn-outline {
  border: 1px solid var(--button-outline-border);
  background: var(--button-outline-bg);
  color: var(--button-outline-text);
}

.btn-outline:hover {
  border-color: rgba(34, 211, 238, 0.3);
  color: #22d3ee;
}
</style>