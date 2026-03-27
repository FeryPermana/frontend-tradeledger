<template>
  <div class="space-y-3">
    <div v-for="item in items" :key="item.id" class="surface-card rounded-2xl p-4 shadow-xl">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="page-title text-base font-semibold">
            {{ item.symbol }}
          </p>
          <p class="page-subtitle mt-1 break-words text-sm">
            {{ item.name }}
          </p>
        </div>

        <button type="button"
          class="watchlist-btn flex h-9 w-9 items-center justify-center rounded-xl text-lg transition"
          @click="$emit('toggle-watchlist', item.id)">
          <span v-if="item.is_watchlist" class="text-yellow-400">★</span>
          <span v-else class="watchlist-idle">☆</span>
        </button>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <span class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium"
          :class="categoryBadgeClass(item.category)">
          {{ formatCategory(item.category) }}
        </span>

        <span class="page-caption text-xs">
          {{ item.market || '-' }}
        </span>
      </div>

      <div class="mt-4 grid grid-cols-3 gap-2">
        <button class="btn-soft rounded-xl px-3 py-2 text-sm font-medium" @click="$emit('view', item.id)">
          View
        </button>

        <button class="btn-outline rounded-xl px-3 py-2 text-sm font-medium transition" @click="$emit('edit', item.id)">
          Edit
        </button>
      </div>

      <div class="mt-3">
        <a v-if="item.tradingview_url" :href="item.tradingview_url" target="_blank" rel="noopener noreferrer"
          class="open-chart-btn block w-full rounded-xl px-3 py-2 text-center text-sm transition">
          Open TradingView
        </a>

        <div v-else class="page-caption text-center text-xs">
          No chart link
        </div>
      </div>
    </div>

    <div v-if="!items.length" class="surface-card rounded-2xl p-6 text-center page-subtitle">
      No assets found.
    </div>
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
  if (category === 'stock') return 'Stock'
  if (category === 'commodity') return 'Commodity'
  return category
}

function categoryBadgeClass(category) {
  if (category === 'crypto') {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-300'
  }

  if (category === 'stock') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
  }

  if (category === 'commodity') {
    return 'border-sky-500/30 bg-sky-500/10 text-sky-300'
  }

  return 'badge-neutral'
}
</script>

<style scoped>
.surface-card {
  border: 1px solid var(--surface-card-border);
  background: var(--surface-card-bg);
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

.watchlist-btn {
  border: 1px solid var(--watchlist-btn-border);
  background: var(--watchlist-btn-bg);
}

.watchlist-btn:hover {
  border-color: rgba(250, 204, 21, 0.3);
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