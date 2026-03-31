<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <h1 class="page-title text-2xl font-bold">Dashboard</h1>
        <p class="page-subtitle mt-1 text-sm">
          Review your edge, habits, asset performance, and portfolio in one place.
        </p>
      </div>

      <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <BaseButton variant="secondary" class="w-full sm:w-auto" @click="refreshDashboard">
          Refresh
        </BaseButton>

        <BaseButton variant="secondary" class="w-full sm:w-auto" @click="handleLogout">
          Logout
        </BaseButton>
      </div>
    </div>

    <DashboardFilterBar @apply="handleApplyFilters" @reset="handleResetFilters" />

    <div v-if="analyticsStore.loading" class="surface-soft rounded-2xl p-6 page-subtitle">
      Loading dashboard...
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <BaseCard>
          <p class="page-subtitle text-sm">Total Trades</p>
          <p class="page-title mt-3 text-3xl font-bold">{{ summary.total_trades ?? 0 }}</p>
          <p class="page-caption mt-2 text-xs">Closed trades with realized results</p>
        </BaseCard>

        <BaseCard>
          <p class="page-subtitle text-sm">Win Rate</p>
          <p class="page-title mt-3 text-3xl font-bold">{{ formatPercent(summary.win_rate) }}</p>
          <p class="page-caption mt-2 text-xs">
            {{ summary.winning_trades ?? 0 }} win / {{ summary.losing_trades ?? 0 }} loss
          </p>
        </BaseCard>

        <BaseCard>
          <p class="page-subtitle text-sm">Net Profit</p>
          <p class="mt-3 text-3xl font-bold"
            :class="Number(summary.net_profit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'">
            {{ formatMoney(summary.net_profit, summary.display_currency) }}
          </p>
          <p class="page-caption mt-2 text-xs">
            Gross profit {{ formatMoney(summary.gross_profit, summary.display_currency) }}
          </p>
        </BaseCard>

        <BaseCard>
          <p class="page-subtitle text-sm">Profit Factor</p>
          <p class="page-title mt-3 text-3xl font-bold">{{ displayProfitFactor(summary.profit_factor) }}</p>
          <p class="page-caption mt-2 text-xs">
            Avg win {{ formatMoney(summary.average_win, summary.display_currency) }}
          </p>
        </BaseCard>
      </div>

      <div class="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
        <BaseCard>
          <div class="mb-5">
            <h2 class="page-title text-lg font-semibold">Strategy Performance</h2>
            <p class="page-subtitle mt-1 text-sm">
              See which strategy is worth keeping and which one is draining your account.
            </p>
          </div>

          <div v-if="strategyRows.length" class="surface-table hidden overflow-hidden rounded-2xl md:block">
            <table class="w-full text-sm">
              <thead class="surface-table-head">
                <tr>
                  <th class="p-4 text-left font-medium">Strategy</th>
                  <th class="p-4 text-left font-medium">Trades</th>
                  <th class="p-4 text-left font-medium">Winrate</th>
                  <th class="p-4 text-left font-medium">Profit</th>
                  <th class="p-4 text-left font-medium">Profit Factor</th>
                  <th class="p-4 text-left font-medium">Label</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in strategyRows" :key="item.strategy_id ?? item.strategy_name"
                  class="surface-table-row">
                  <td class="p-4 font-medium page-title">{{ item.strategy_name }}</td>
                  <td class="p-4 page-body">{{ item.total_trades }}</td>
                  <td class="p-4 page-body">{{ formatPercent(item.win_rate) }}</td>
                  <td class="p-4 font-medium"
                    :class="Number(item.net_profit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'">
                    {{ formatMoney(item.net_profit, summary.display_currency) }}
                  </td>
                  <td class="p-4 page-body">{{ displayProfitFactor(item.profit_factor) }}</td>
                  <td class="p-4">
                    <span class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium"
                      :class="performanceBadgeClass(item)">
                      {{ performanceLabel(item) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="surface-soft rounded-2xl p-6 text-center text-sm page-subtitle">
            No strategy performance yet.
          </div>
        </BaseCard>

        <BaseCard>
          <h2 class="page-title text-lg font-semibold">Quick Insights</h2>
          <p class="page-subtitle mt-1 text-sm">
            Focus on what matters first before opening the trades page.
          </p>

          <div class="mt-5 space-y-3">
            <div class="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p class="text-sm font-medium text-emerald-300">Best Strategy</p>
              <p class="mt-2 text-base font-semibold page-title">
                {{ bestStrategy?.strategy_name || 'No data yet' }}
              </p>
              <p class="mt-1 text-sm leading-6 page-body">
                <template v-if="bestStrategy">
                  Profit {{ formatMoney(bestStrategy.net_profit, summary.display_currency) }}
                  • Winrate {{ formatPercent(bestStrategy.win_rate) }}
                </template>
                <template v-else>
                  Start closing more trades to unlock insights.
                </template>
              </p>
            </div>

            <div class="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
              <p class="text-sm font-medium text-cyan-300">Best Asset</p>
              <p class="mt-2 text-base font-semibold page-title">
                {{ bestAsset?.asset_symbol || bestAsset?.asset_name || 'No data yet' }}
              </p>
              <p class="mt-1 text-sm leading-6 page-body">
                <template v-if="bestAsset">
                  Profit {{ formatMoney(bestAsset.net_profit, summary.display_currency) }}
                  • Winrate {{ formatPercent(bestAsset.win_rate) }}
                </template>
                <template v-else>
                  No asset edge detected yet.
                </template>
              </p>
            </div>

            <div class="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <p class="text-sm font-medium text-amber-300">Habit Warning</p>
              <p class="mt-2 text-base font-semibold page-title">
                {{ worstTag?.tag_name || 'No tag data yet' }}
              </p>
              <p class="mt-1 text-sm leading-6 page-body">
                <template v-if="worstTag">
                  Profit {{ formatMoney(worstTag.net_profit, summary.display_currency) }}
                  • Winrate {{ formatPercent(worstTag.win_rate) }}
                </template>
                <template v-else>
                  Add tags to your trades so TradeLedger can expose harmful habits.
                </template>
              </p>
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <BaseCard>
          <div class="mb-5">
            <h2 class="page-title text-lg font-semibold">Asset Performance</h2>
            <p class="page-subtitle mt-1 text-sm">
              Review realized net profit by asset, including DCA results that have been realized.
            </p>
          </div>

          <div v-if="assetPerformanceRows.length" class="space-y-3">
            <div v-for="item in assetPerformanceRows" :key="item.asset_id ?? item.asset_symbol"
              class="surface-soft rounded-2xl p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="font-medium page-title">{{ item.asset_symbol || item.asset_name }}</p>

                    <span v-if="item.category"
                      class="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
                      {{ formatCategoryLabel(item.category) }}
                    </span>

                    <span class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium"
                      :class="performanceBadgeClass(item)">
                      {{ performanceLabel(item) }}
                    </span>
                  </div>

                  <p class="mt-1 text-sm page-subtitle">
                    {{ item.total_trades }} trades • Winrate {{ formatPercent(item.win_rate) }}
                  </p>
                </div>

                <div class="text-right">
                  <p class="font-semibold"
                    :class="Number(item.net_profit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'">
                    {{ formatMoney(item.net_profit, summary.display_currency) }}
                  </p>
                  <p class="mt-1 text-xs page-caption">
                    PF {{ displayProfitFactor(item.profit_factor) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="surface-soft rounded-2xl p-6 text-center text-sm page-subtitle">
            No asset performance yet.
          </div>
        </BaseCard>

        <BaseCard>
          <div class="mb-5">
            <h2 class="page-title text-lg font-semibold">Tag Performance</h2>
            <p class="page-subtitle mt-1 text-sm">
              Spot behavior patterns that help or hurt your performance.
            </p>
          </div>

          <div v-if="tagRows.length" class="space-y-3">
            <div v-for="item in tagRows" :key="item.tag_id ?? item.tag_name" class="surface-soft rounded-2xl p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="font-medium page-title">{{ item.tag_name }}</p>
                    <span class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium"
                      :class="performanceBadgeClass(item)">
                      {{ performanceLabel(item) }}
                    </span>
                  </div>

                  <p class="mt-1 text-sm page-subtitle">
                    {{ item.total_trades }} trades • Winrate {{ formatPercent(item.win_rate) }}
                  </p>
                </div>

                <div class="text-right">
                  <p class="font-semibold"
                    :class="Number(item.net_profit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'">
                    {{ formatMoney(item.net_profit, summary.display_currency) }}
                  </p>
                  <p class="mt-1 text-xs page-caption">
                    PF {{ displayProfitFactor(item.profit_factor) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="surface-soft rounded-2xl p-6 text-center text-sm page-subtitle">
            No tag performance yet.
          </div>
        </BaseCard>
      </div>

      <BaseCard>
        <div class="mb-5">
          <h2 class="page-title text-lg font-semibold">Monthly Performance</h2>
          <p class="page-subtitle mt-1 text-sm">
            Quick visual overview of realized performance over time.
          </p>
        </div>

        <div v-if="monthlyRows.length" class="space-y-4">
          <div class="surface-soft flex h-56 items-end gap-2 overflow-hidden rounded-2xl p-4 sm:gap-3">
            <div v-for="item in monthlyRows" :key="item.month"
              class="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
              <div class="w-full rounded-t-xl"
                :class="Number(item.net_profit || 0) >= 0 ? 'bg-emerald-500/70' : 'bg-red-500/70'"
                :style="{ height: `${getBarHeight(item.net_profit)}px` }" />
              <span class="text-[10px] page-caption sm:text-[11px]">
                {{ formatMonthShort(item.month) }}
              </span>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div v-for="item in monthlyRows" :key="`${item.month}-info`" class="surface-soft rounded-2xl p-4">
              <div class="flex items-start justify-between gap-3">
                <p class="font-medium page-title">{{ formatMonthLabel(item.month) }}</p>
                <p class="text-sm font-semibold"
                  :class="Number(item.net_profit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'">
                  {{ formatMoney(item.net_profit, summary.display_currency) }}
                </p>
              </div>
              <p class="mt-2 text-sm page-subtitle">
                {{ item.total_trades }} trades • Winrate {{ formatPercent(item.win_rate) }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="surface-soft rounded-2xl p-6 text-center text-sm page-subtitle">
          No monthly performance yet.
        </div>
      </BaseCard>

      <BaseCard>
        <div class="mb-5">
          <h2 class="page-title text-lg font-semibold">Portfolio Snapshot</h2>
          <p class="page-subtitle mt-1 text-sm">
            High-level overview of your currently tracked investment positions.
          </p>
        </div>

        <div class="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="surface-soft rounded-2xl p-4">
              <p class="text-sm page-subtitle">Total Positions</p>
              <p class="mt-2 text-2xl font-bold page-title">
                {{ portfolioSummary.total_positions ?? 0 }}
              </p>
            </div>

            <div class="surface-soft rounded-2xl p-4">
              <p class="text-sm page-subtitle">Total Invested</p>
              <p class="mt-2 text-2xl font-bold page-title">
                {{ formatMoney(portfolioSummary.total_invested, portfolioSummary.display_currency ||
                  summary.display_currency)
                }}
              </p>
            </div>

            <div class="surface-soft rounded-2xl p-4 sm:col-span-2">
              <p class="text-sm page-subtitle">Largest Position</p>
              <p class="mt-2 text-lg font-semibold page-title">
                {{ portfolioSummary.largest_position?.asset || 'No position yet' }}
              </p>
              <p class="mt-1 text-sm page-subtitle">
                <template v-if="portfolioSummary.largest_position">
                  Qty {{ formatQty(portfolioSummary.largest_position.quantity) }}
                  • Invested
                  {{ formatMoney(portfolioSummary.largest_position.invested_value, portfolioSummary.display_currency ||
                    summary.display_currency) }}
                </template>
                <template v-else>
                  No investment position tracked yet.
                </template>
              </p>
            </div>
          </div>

          <div>
            <h3 class="mb-3 text-sm font-semibold page-body">Asset Allocation</h3>

            <div v-if="assetAllocation.length" class="space-y-3">
              <div v-for="item in assetAllocation" :key="item.asset" class="surface-soft rounded-2xl p-4">
                <div class="mb-2 flex items-center justify-between gap-3">
                  <p class="font-medium page-title">{{ item.asset }}</p>
                  <p class="text-sm page-body">{{ formatPercent(item.percentage) }}</p>
                </div>

                <div class="progress-bg h-2 overflow-hidden rounded-full">
                  <div class="h-full rounded-full bg-cyan-500"
                    :style="{ width: `${Math.min(Number(item.percentage || 0), 100)}%` }" />
                </div>

                <p class="mt-2 text-sm page-subtitle">
                  {{ formatMoney(item.value, item.display_currency || portfolioSummary.display_currency ||
                    summary.display_currency) }}
                </p>
              </div>
            </div>

            <div v-else class="surface-soft rounded-2xl p-6 text-center text-sm page-subtitle">
              No asset allocation data yet.
            </div>
          </div>
        </div>
      </BaseCard>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import DashboardFilterBar from '@/components/dashboard/DashboardFilterBar.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useAnalyticsStore } from '@/stores/analytics.store'
import { toastService } from '@/utils/toast'

const router = useRouter()
const authStore = useAuthStore()
const analyticsStore = useAnalyticsStore()

onMounted(async () => {
  await refreshDashboard()
})

const summary = computed(() => analyticsStore.summary ?? {})
const strategyRows = computed(() => analyticsStore.strategyPerformance ?? [])
const tagRows = computed(() => analyticsStore.tagPerformance ?? [])
const monthlyRows = computed(() => analyticsStore.monthlyPerformance ?? [])
const assetPerformanceRows = computed(() => analyticsStore.assetPerformance ?? [])
const portfolioSummary = computed(() => analyticsStore.portfolioSummary ?? {})
const assetAllocation = computed(() => analyticsStore.assetAllocation ?? [])

const bestStrategy = computed(() => {
  if (!strategyRows.value.length) return null
  return [...strategyRows.value].sort((a, b) => Number(b.net_profit || 0) - Number(a.net_profit || 0))[0]
})

const bestAsset = computed(() => {
  if (!assetPerformanceRows.value.length) return null
  return [...assetPerformanceRows.value].sort((a, b) => Number(b.net_profit || 0) - Number(a.net_profit || 0))[0]
})

const worstTag = computed(() => {
  if (!tagRows.value.length) return null
  return [...tagRows.value].sort((a, b) => Number(a.net_profit || 0) - Number(b.net_profit || 0))[0]
})

function handleUpgradeRequired(error) {
  const response = error.response?.data

  if (response?.upgrade_required) {
    toastService.error(
      response.message?.id || 'Upgrade ke Pro untuk akses dashboard analytics.'
    )
    router.push({ name: 'payment', query: { plan: 'monthly' } })
    return true
  }

  return false
}

async function refreshDashboard() {
  const toastId = toastService.loading('Loading dashboard...')

  try {
    await analyticsStore.getDashboardData()
    toastService.dismiss(toastId)
  } catch (error) {
    toastService.dismiss(toastId)

    if (handleUpgradeRequired(error)) return

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to load dashboard.'
    )
  }
}

async function handleApplyFilters(payload) {
  const toastId = toastService.loading('Applying filters...')

  try {
    await analyticsStore.getDashboardData(payload)
    toastService.dismiss(toastId)
  } catch (error) {
    toastService.dismiss(toastId)

    if (handleUpgradeRequired(error)) return

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to apply filters.'
    )
  }
}

async function handleResetFilters() {
  const toastId = toastService.loading('Resetting filters...')

  try {
    await analyticsStore.getDashboardData()
    toastService.dismiss(toastId)
  } catch (error) {
    toastService.dismiss(toastId)

    if (handleUpgradeRequired(error)) return

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to reset filters.'
    )
  }
}

async function handleLogout() {
  const toastId = toastService.loading('Signing out...')

  try {
    await authStore.logout()
    toastService.dismiss(toastId)
    toastService.success('Logout successful')
    router.push('/login')
  } catch {
    toastService.dismiss(toastId)
    toastService.error('Failed to logout.')
  }
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(2)}%`
}

function formatDecimal(value) {
  return Number(value || 0).toFixed(2)
}

function displayProfitFactor(value) {
  return value === null ? '∞' : formatDecimal(value)
}

function formatMoney(value, currency = 'IDR') {
  if (value === null || value === undefined || value === '') return '-'

  const amount = Number(value)

  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency || 'IDR',
    maximumFractionDigits: currency === 'IDR' ? 0 : 2,
  }).format(amount)
}

function formatQty(value) {
  return Number(value || 0).toLocaleString('id-ID', {
    maximumFractionDigits: 8,
  })
}

function formatMonthShort(value) {
  if (!value) return '-'
  const [year, month] = value.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('id-ID', { month: 'short' })
}

function formatMonthLabel(value) {
  if (!value) return '-'
  const [year, month] = value.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

function formatCategoryLabel(value) {
  if (!value) return '-'

  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function getBarHeight(netProfit) {
  const values = monthlyRows.value.map((item) => Math.abs(Number(item.net_profit || 0)))
  const max = Math.max(...values, 1)
  const current = Math.abs(Number(netProfit || 0))
  const scaled = (current / max) * 160
  return Math.max(scaled, 12)
}

function performanceLabel(item) {
  const profit = Number(item.net_profit || 0)
  const factor = item.profit_factor === null ? Infinity : Number(item.profit_factor || 0)

  if (profit > 0 && factor >= 1.2) return 'Profitable'
  if (profit < 0 || factor < 1) return 'Needs Review'
  return 'Break-even'
}

function performanceBadgeClass(item) {
  const label = performanceLabel(item)

  if (label === 'Profitable') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
  }

  if (label === 'Needs Review') {
    return 'border-red-500/30 bg-red-500/10 text-red-300'
  }

  return 'border-amber-500/30 bg-amber-500/10 text-amber-300'
}
</script>

<style scoped>
.page-title {
  color: var(--text-title);
}

.page-subtitle {
  color: var(--text-muted);
}

.page-body {
  color: var(--text-body);
}

.page-caption {
  color: var(--text-caption);
}

.surface-soft {
  border: 1px solid var(--surface-soft-border);
  background: var(--surface-soft-bg);
}

.surface-table {
  border: 1px solid var(--surface-table-border);
  background: var(--surface-table-bg);
}

.surface-table-head {
  background: var(--surface-table-head-bg);
  color: var(--surface-table-head-text);
}

.surface-table-row {
  border-top: 1px solid var(--surface-table-row-border);
}

.progress-bg {
  background: var(--progress-bg);
}
</style>