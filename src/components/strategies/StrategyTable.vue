<template>
  <div class="surface-table overflow-hidden rounded-2xl shadow-xl">
    <table class="w-full text-sm">
      <thead class="surface-table-head">
        <tr>
          <th class="p-4 text-left">Name</th>
          <th class="p-4 text-left">Timeframe</th>
          <th class="p-4 text-left">Setup Type</th>
          <th class="p-4 text-left">Risk Model</th>
          <th class="p-4 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id" class="surface-table-row">
          <td class="p-4 page-title">{{ item.name }}</td>
          <td class="p-4 page-body">{{ item.timeframe || '-' }}</td>
          <td class="p-4 page-body">{{ formatLabel(item.setup_type) }}</td>
          <td class="p-4 page-body">{{ formatLabel(item.risk_model) }}</td>
          <td class="p-4">
            <div class="flex justify-end gap-2">
              <button class="btn-soft rounded-xl px-3 py-2 text-sm font-medium" @click="$emit('view', item.id)">
                View
              </button>

              <button class="btn-outline rounded-lg px-3 py-2 text-sm font-medium transition"
                @click="$emit('edit', item.id)">
                Edit
              </button>

              <button
                class="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                @click="$emit('delete', item.id)">
                Delete
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="!items.length">
          <td colspan="5" class="p-8 text-center page-subtitle">
            No strategies found.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['view', 'edit', 'delete'])

function formatLabel(value) {
  if (!value) return '-'
  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
</script>

<style scoped>
.surface-table {
  border: 1px solid var(--surface-table-border);
  background: var(--surface-table-bg);
}

.surface-table-head {
  border-bottom: 1px solid var(--surface-table-border);
  background: var(--surface-table-head-bg);
  color: var(--surface-table-head-text);
}

.surface-table-row {
  border-bottom: 1px solid var(--surface-table-row-border);
}

.surface-table-row:hover {
  background: var(--surface-table-row-hover);
}

.page-title {
  color: var(--text-title);
}

.page-body {
  color: var(--text-body);
}

.page-subtitle {
  color: var(--text-muted);
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