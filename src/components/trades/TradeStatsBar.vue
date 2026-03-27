<template>
  <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <div class="surface-card rounded-2xl p-4 shadow-xl">
      <p class="page-subtitle text-sm">Total Trades</p>
      <p class="page-title mt-2 text-2xl font-bold">
        {{ summary.total_trades ?? 0 }}
      </p>
    </div>

    <div class="surface-card rounded-2xl p-4 shadow-xl">
      <p class="page-subtitle text-sm">Win Rate</p>
      <p class="page-title mt-2 text-2xl font-bold">
        {{ formatPercent(summary.win_rate) }}
      </p>
    </div>

    <div class="surface-card rounded-2xl p-4 shadow-xl">
      <p class="page-subtitle text-sm">Net Profit</p>
      <p class="mt-2 text-2xl font-bold"
        :class="Number(summary.net_profit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'">
        {{ formatCurrency(summary.net_profit, summary.display_currency) }}
      </p>
    </div>

    <div class="surface-card rounded-2xl p-4 shadow-xl">
      <p class="page-subtitle text-sm">Profit Factor</p>
      <p class="page-title mt-2 text-2xl font-bold">
        {{ displayProfitFactor(summary.profit_factor) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics.store'
import { formatCurrency } from '@/utils/formatters'

const analyticsStore = useAnalyticsStore()
const summary = computed(() => analyticsStore.summary || {})

function formatPercent(value) {
  return `${Number(value || 0).toFixed(2)}%`
}

function displayProfitFactor(value) {
  if (value === null || value === undefined) return '∞'
  return Number(value).toFixed(2)
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
</style>