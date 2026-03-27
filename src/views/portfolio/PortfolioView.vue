<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <h1 class="page-title text-2xl font-bold">Portfolio</h1>
        <p class="page-subtitle mt-1 text-sm">
          Manage your long-term positions and investment thesis.
        </p>
      </div>

      <BaseButton class="w-full sm:w-auto" @click="$router.push('/dash/trades')">
        Add Trade / Investment
      </BaseButton>
    </div>

    <div class="alert-info rounded-2xl px-4 py-4 text-sm">
      <p>
        Your account is your starting capital. All performance is tracked through trades - not by changing account
        balances.
      </p>

      <p class="mt-1">
        To add new investment, go to
        <span class="alert-info-strong font-semibold">Trade page</span>
        and select
        <span class="alert-info-strong font-semibold">Position Type: Investment</span>.
      </p>
    </div>

    <div v-if="store.summary" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="surface-card rounded-2xl p-4">
        <p class="page-subtitle text-sm">Total Positions</p>
        <p class="page-title mt-2 text-2xl font-bold">
          {{ store.summary.total_positions }}
        </p>
      </div>

      <div class="surface-card rounded-2xl p-4">
        <p class="page-subtitle text-sm">Total Invested</p>
        <p class="page-title mt-2 break-words text-2xl font-bold">
          {{ formatMoney(store.summary.total_invested, store.summary.display_currency) }}
        </p>
      </div>

      <div class="surface-card rounded-2xl p-4">
        <p class="page-subtitle text-sm">Total Value</p>
        <p class="page-title mt-2 break-words text-2xl font-bold">
          {{ formatMoney(store.summary.total_value, store.summary.display_currency) }}
        </p>
      </div>

      <div class="surface-card rounded-2xl p-4">
        <p class="page-subtitle text-sm">Unrealized PnL</p>
        <p class="mt-2 break-words text-2xl font-bold"
          :class="Number(store.summary.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'">
          {{ formatMoney(store.summary.pnl, store.summary.display_currency) }}
        </p>
        <p class="page-subtitle mt-2 text-xs">
          {{ Number(store.summary.pnl_percent || 0).toFixed(2) }}%
        </p>
      </div>
    </div>

    <PortfolioAllocation :allocation="store.allocation" />

    <BaseCard>
      <PortfolioSearch @search="handleSearch" />
    </BaseCard>

    <div v-if="store.loading" class="surface-soft rounded-2xl p-6 page-subtitle">
      Loading portfolio...
    </div>

    <template v-else>
      <div v-if="store.items.length" class="hidden md:block">
        <PortfolioTable :items="store.items" @edit="editPosition" @delete="deletePosition" @manage="openManageModal" />
      </div>

      <div v-if="store.items.length" class="md:hidden">
        <PortfolioCardList :items="store.items" @edit="editPosition" @delete="deletePosition"
          @manage="openManageModal" />
      </div>

      <div v-if="!store.items.length" class="surface-soft rounded-2xl p-6 text-center page-subtitle">
        No portfolio positions found.
      </div>
    </template>

    <PortfolioFormModal :open="modal" :position="selected" :loading="formLoading" @close="closeModal"
      @submit="savePosition" />

    <PortfolioManageModal :open="manageModal" :item="selectedItem" :loading="manageLoading" @close="closeManageModal"
      @submit="handleManage" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio.store'
import { partialClosePortfolio } from '@/api/portfolio.api'
import { updateAssetPrice } from '@/api/asset.api'
import PortfolioTable from '@/components/portfolio/PortfolioTable.vue'
import PortfolioCardList from '@/components/portfolio/PortfolioCardList.vue'
import PortfolioFormModal from '@/components/portfolio/PortfolioFormModal.vue'
import PortfolioManageModal from '@/components/portfolio/PortfolioPriceModal.vue'
import PortfolioSearch from '@/components/portfolio/PortfolioSearch.vue'
import PortfolioAllocation from '@/components/portfolio/PortfolioAllocation.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import { toastService } from '@/utils/toast'

const store = usePortfolioStore()

const modal = ref(false)
const selected = ref(null)
const formLoading = ref(false)

const manageModal = ref(false)
const selectedItem = ref(null)
const manageLoading = ref(false)

onMounted(async () => {
  store.reset()

  try {
    await refreshPortfolio()
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to load portfolio.'
    )
  }
})

async function refreshPortfolio() {
  await Promise.all([
    store.getAll(),
    store.getSummary(),
    store.getAllocation(),
  ])
}

function editPosition(id) {
  selected.value = store.items.find((item) => item.id === id) || null
  modal.value = true
}

function openManageModal(item) {
  selectedItem.value = item
  manageModal.value = true
}

function closeManageModal() {
  manageModal.value = false
  selectedItem.value = null
}

async function handleSearch(filters) {
  store.filters.search = filters.search || ''
  store.filters.conviction_level = filters.conviction_level || ''
  store.filters.horizon = filters.horizon || ''
  store.filters.watchlist_only = !!filters.watchlist_only

  try {
    await refreshPortfolio()
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to search portfolio.'
    )
  }
}

async function handleManage(payload) {
  if (!selectedItem.value) return

  manageLoading.value = true
  const toastId = toastService.loading('Updating position...')

  try {
    if (payload.current_price !== null && selectedItem.value.asset?.id) {
      await updateAssetPrice(selectedItem.value.asset.id, {
        current_price: payload.current_price,
      })
    }

    if (payload.partial_close) {
      await partialClosePortfolio(selectedItem.value.id, payload.partial_close)
    }

    await refreshPortfolio()

    toastService.dismiss(toastId)
    toastService.success('Position updated successfully.')
    closeManageModal()
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to update position.'
    )
  } finally {
    manageLoading.value = false
  }
}

async function savePosition(data) {
  formLoading.value = true
  const toastId = toastService.loading(selected.value?.id ? 'Updating position...' : 'Creating position...')

  try {
    if (selected.value?.id) {
      await store.update(selected.value.id, data)
      toastService.dismiss(toastId)
      toastService.success('Portfolio position updated successfully.')
    } else {
      await store.create(data)
      toastService.dismiss(toastId)
      toastService.success('Portfolio position created successfully.')
    }

    await refreshPortfolio()
    closeModal()
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to save portfolio position.'
    )
  } finally {
    formLoading.value = false
  }
}

async function deletePosition(id) {
  const ok = window.confirm('Are you sure you want to delete this portfolio position?')
  if (!ok) return

  const toastId = toastService.loading('Deleting position...')

  try {
    await store.remove(id)
    await refreshPortfolio()

    toastService.dismiss(toastId)
    toastService.success('Portfolio position deleted successfully.')
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to delete portfolio position.'
    )
  }
}

function closeModal() {
  modal.value = false
  selected.value = null
}

function formatMoney(value, currency = 'IDR') {
  if (value === null || value === undefined || value === '') return '-'

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value))
}
</script>

<style scoped>
.page-title {
  color: var(--text-title);
}

.page-subtitle {
  color: var(--text-muted);
}

.surface-card {
  border: 1px solid var(--surface-card-border);
  background: var(--surface-card-bg);
}

.surface-soft {
  border: 1px solid var(--surface-soft-border);
  background: var(--surface-soft-bg);
}

.alert-info {
  border: 1px solid var(--alert-info-border);
  background: var(--alert-info-bg);
  color: var(--alert-info-text);
}

.alert-info-strong {
  color: var(--alert-info-strong);
}
</style>