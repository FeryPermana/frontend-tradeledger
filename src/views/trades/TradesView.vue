<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <h1 class="page-title text-2xl font-bold">Trades</h1>
        <p class="page-subtitle mt-1 text-sm">
          Track, review, and manage your trades.
        </p>
      </div>

      <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <BaseButton variant="secondary" class="w-full sm:w-auto" @click="handleExportCsv">
          Export CSV
        </BaseButton>

        <BaseButton class="w-full sm:w-auto" @click="openCreate">
          Add Trade / Investment
        </BaseButton>
      </div>
    </div>

    <TradeStatsBar />

    <TradeFilterBar @apply="handleApplyFilters" @reset="handleResetFilters" />

    <div v-if="tradeStore.loading" class="surface-soft rounded-2xl p-6 page-subtitle">
      Loading trades...
    </div>

    <template v-else>
      <div v-if="tradeStore.items.length" class="hidden md:block">
        <TradeTable :items="tradeStore.items" :sort-by="tradeStore.filters.sort_by"
          :sort-direction="tradeStore.filters.sort_direction" @view="handleView" @edit="handleEdit"
          @delete="handleDelete" @sort="handleSort" />
      </div>

      <div v-if="tradeStore.items.length" class="md:hidden">
        <TradeCardList :items="tradeStore.items" @view="handleView" @edit="handleEdit" @delete="handleDelete" />
      </div>

      <div v-if="!tradeStore.items.length" class="surface-soft rounded-2xl p-6 text-center page-subtitle">
        No trades found.
      </div>

      <TradePagination v-if="tradeStore.items.length" :pagination="tradeStore.pagination" @change="handlePageChange" />
    </template>

    <TradeFormModal :open="showForm" :trade="selectedTrade" @close="closeForm" @saved="handleSaved" />

    <TradeViewModal :open="showView" :trade="selectedTrade" @close="closeView" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import TradeStatsBar from '@/components/trades/TradeStatsBar.vue'
import TradeFilterBar from '@/components/trades/TradeFilterBar.vue'
import TradeTable from '@/components/trades/TradeTable.vue'
import TradeCardList from '@/components/trades/TradeCardList.vue'
import TradePagination from '@/components/trades/TradePagination.vue'
import TradeFormModal from '@/components/trades/TradeFormModal.vue'
import TradeViewModal from '@/components/trades/TradeViewModal.vue'
import { useTradeStore } from '@/stores/trade.store'
import { useAnalyticsStore } from '@/stores/analytics.store'
import { useAuthStore } from '@/stores/auth.store'
import { toastService } from '@/utils/toast'

const tradeStore = useTradeStore()
const analyticsStore = useAnalyticsStore()
const authStore = useAuthStore()

const showForm = ref(false)
const showView = ref(false)
const selectedTrade = ref(null)

onMounted(async () => {
  tradeStore.reset()

  try {
    await tradeStore.getAll()
    await analyticsStore.getSummary(tradeStore.filters)
    await authStore.fetchPlanStatus()
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to load trades.'
    )
  }
})

function openCreate() {
  selectedTrade.value = null
  showForm.value = true
}

async function handleView(id) {
  const toastId = toastService.loading('Loading trade detail...')

  try {
    const res = await tradeStore.getOne(id)
    selectedTrade.value = res.data?.data ?? tradeStore.detail
    showView.value = true
    toastService.dismiss(toastId)
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to load trade detail.'
    )
  }
}

async function handleEdit(id) {
  const trade = tradeStore.items.find((t) => t.id === id)

  if (trade?.position_type === 'investment') {
    toastService.info('Investment trades cannot be edited. Use Portfolio to manage the position.')
    return
  }

  const toastId = toastService.loading('Loading trade for editing...')

  try {
    const res = await tradeStore.getOne(id)
    selectedTrade.value = res.data?.data ?? tradeStore.detail
    showForm.value = true
    toastService.dismiss(toastId)
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to load trade.'
    )
  }
}

async function handleDelete(id) {
  const trade = tradeStore.items.find((t) => t.id === id)
  if (!trade) return

  let confirmMessage =
    'Are you sure you want to delete this trade? This action cannot be undone.'

  if (trade.position_type === 'investment') {
    confirmMessage =
      '⚠️ This is an INVESTMENT trade group action.\n\n' +
      'Deleting this trade will remove ALL investment entries for the same asset and account.\n\n' +
      'This will also remove the synced portfolio position and reset its average position data.\n\n' +
      'This action cannot be undone.\n\n' +
      'Continue?'
  }

  const ok = window.confirm(confirmMessage)
  if (!ok) return

  const toastId = toastService.loading('Deleting trade...')

  try {
    await tradeStore.remove(id)
    await tradeStore.getAll()
    await analyticsStore.getSummary(tradeStore.filters)
    await authStore.fetchPlanStatus()

    toastService.dismiss(toastId)

    if (trade.position_type === 'investment') {
      toastService.success('Investment group deleted successfully.')
    } else {
      toastService.success('Trade deleted successfully.')
    }
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to delete trade.'
    )
  }
}

async function handleApplyFilters(payload) {
  tradeStore.filters = {
    ...tradeStore.filters,
    ...payload,
    page: 1,
  }

  try {
    await tradeStore.getAll()
    await analyticsStore.getSummary(tradeStore.filters)
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to apply filters.'
    )
  }
}

async function handleResetFilters() {
  tradeStore.resetFilters()

  try {
    await tradeStore.getAll()
    await analyticsStore.getSummary(tradeStore.filters)
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to reset filters.'
    )
  }
}

async function handleSort(column) {
  let direction = 'asc'

  if (tradeStore.filters.sort_by === column) {
    direction = tradeStore.filters.sort_direction === 'asc' ? 'desc' : 'asc'
  } else {
    direction =
      column === 'entry_date' ||
        column === 'exit_date' ||
        column === 'created_at'
        ? 'desc'
        : 'asc'
  }

  tradeStore.filters = {
    ...tradeStore.filters,
    sort_by: column,
    sort_direction: direction,
    page: 1,
  }

  try {
    await tradeStore.getAll()
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to sort trades.'
    )
  }
}

async function handlePageChange(page) {
  tradeStore.filters = {
    ...tradeStore.filters,
    page,
  }

  try {
    await tradeStore.getAll()
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to change page.'
    )
  }
}

async function handleExportCsv() {
  const toastId = toastService.loading('Exporting CSV...')

  try {
    const res = await tradeStore.exportCsv(tradeStore.filters)

    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `trades-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.URL.revokeObjectURL(url)

    toastService.dismiss(toastId)
    toastService.success('CSV exported successfully.')
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to export CSV.'
    )
  }
}

async function handleSaved() {
  closeForm()

  try {
    await tradeStore.getAll()
    await analyticsStore.getSummary(tradeStore.filters)
    await authStore.fetchPlanStatus()
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to refresh trades.'
    )
  }
}

function closeView() {
  showView.value = false
  selectedTrade.value = null
}

function closeForm() {
  showForm.value = false
  selectedTrade.value = null
}
</script>

<style scoped>
.page-title {
  color: var(--text-title);
}

.page-subtitle {
  color: var(--text-muted);
}

.surface-soft {
  border: 1px solid var(--surface-soft-border);
  background: var(--surface-soft-bg);
}
</style>