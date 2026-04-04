<template>
  <div class="surface-table overflow-hidden rounded-2xl shadow-xl">
    <table class="w-full text-sm">
      <thead class="surface-table-head">
        <tr>
          <th class="p-4 text-left">Asset</th>
          <th class="p-4 text-left">Category</th>
          <th class="p-4 text-left">Market</th>
          <th class="p-4 text-left">Watchlist</th>
          <th class="p-4 text-left">Chart</th>
          <th class="p-4 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id" class="surface-table-row">
          <td class="p-4">
            <div class="flex flex-col">
              <span class="page-title font-semibold">{{ item.symbol }}</span>
              <span class="page-subtitle">{{ item.name }}</span>
            </div>
          </td>

          <td class="p-4">
            <span class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium"
              :class="categoryBadgeClass(item.category)">
              {{ formatCategory(item.category) }}
            </span>
          </td>

          <td class="page-body p-4">
            {{ item.market || '-' }}
          </td>

          <td class="p-4">
            <button type="button" class="text-lg" @click="$emit('toggle-watchlist', item.id)">
              <span v-if="item.is_watchlist" class="text-yellow-400">★</span>
              <span v-else class="watchlist-idle">☆</span>
            </button>
          </td>

          <td class="p-4">
            <a v-if="item.tradingview_url" :href="item.tradingview_url" target="_blank" rel="noopener noreferrer"
              class="open-chart-btn inline-flex rounded-lg px-3 py-1.5 text-xs">
              Open Chart
            </a>
            <span v-else class="page-subtitle">-</span>
          </td>

          <td class="p-4">
            <div class="flex justify-end gap-2">
              <button class="btn-soft rounded-xl px-3 py-2 text-sm font-medium" @click="$emit('view', item.id)">
                View
              </button>

              <button class="btn-outline rounded-lg px-3 py-2 text-sm font-medium transition"
                @click="$emit('edit', item.id)">
                Edit
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="!items.length">
          <td colspan="6" class="p-8 text-center page-subtitle">
            No assets found.
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

defineEmits(['view', 'edit', 'delete', 'toggle-watchlist'])

function formatCategory(category) {
  if (!category) return '-'
  if (category === 'crypto') return 'Crypto'
  if (category === 'stock_idx') return 'IDX Stock'
  if (category === 'stock_us') return 'US Stock'
  if (category === 'commodity') return 'Commodity'
  return category
}

function categoryBadgeClass(category) {
  if (category === 'crypto') {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-300'
  }

  if (category === 'stock_us') {
    return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
  }

  if (category === 'stock_idx') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
  }

  if (category === 'commodity') {
    return 'border-sky-500/30 bg-sky-500/10 text-sky-300'
  }

  return 'badge-neutral'
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

.page-subtitle {
  color: var(--text-muted);
}

.page-body {
  color: var(--text-body);
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

.watchlist-idle {
  color: var(--text-caption);
}

.watchlist-idle:hover {
  color: #facc15;
}

.open-chart-btn {
  border: 1px solid var(--open-chart-border);
  background: var(--open-chart-bg);
  color: var(--open-chart-text);
}

.open-chart-btn:hover {
  border-color: var(--open-chart-hover-border);
  color: var(--open-chart-hover-text);
}

.badge-neutral {
  border-color: var(--badge-neutral-border);
  background: var(--badge-neutral-bg);
  color: var(--badge-neutral-text);
}
</style>