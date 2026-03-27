<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <h1 class="page-title text-2xl font-bold">Assets</h1>
        <p class="page-subtitle mt-1 text-sm">
          Manage your tradable and investable assets.
        </p>
      </div>

      <BaseButton class="w-full sm:w-auto" @click="openCreate">
        Create Asset
      </BaseButton>
    </div>

    <BaseCard>
      <AssetSearch @search="handleSearch" />
    </BaseCard>

    <BaseCard>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label class="page-body flex items-center gap-2 text-sm">
          <input v-model="watchlistOnly" type="checkbox" class="asset-checkbox h-4 w-4 rounded"
            @change="handleWatchlistFilter" />
          <span>Watchlist Only</span>
        </label>
      </div>
    </BaseCard>

    <BaseCard v-if="store.detail">
      <div class="surface-divider mb-4 flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="section-title text-lg font-semibold">Asset Detail</h2>

        <button type="button"
          class="btn-outline inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs transition sm:w-auto"
          @click="store.detail = null">
          <span>✕</span>
          <span>Close Detail</span>
        </button>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div class="surface-soft rounded-xl p-4">
          <p class="page-subtitle text-sm">Symbol</p>
          <p class="page-title mt-1 break-words text-sm font-medium">
            {{ store.detail.symbol }}
          </p>
        </div>

        <div class="surface-soft rounded-xl p-4">
          <p class="page-subtitle text-sm">Name</p>
          <p class="page-title mt-1 break-words text-sm font-medium">
            {{ store.detail.name }}
          </p>
        </div>

        <div class="surface-soft rounded-xl p-4">
          <p class="page-subtitle text-sm">Market</p>
          <p class="page-title mt-1 text-sm font-medium">
            {{ formatMarket(store.detail.market) }}
          </p>
        </div>
      </div>
    </BaseCard>

    <div v-if="store.loading" class="surface-soft rounded-2xl p-6 page-subtitle">
      Loading assets...
    </div>

    <template v-else>
      <div v-if="store.items.length" class="hidden md:block">
        <AssetTable :items="store.items" @view="viewAsset" @edit="editAsset" @delete="deleteAsset"
          @toggle-watchlist="handleToggleWatchlist" />
      </div>

      <div v-if="store.items.length" class="md:hidden">
        <AssetCardList :items="store.items" @view="viewAsset" @edit="editAsset" @delete="deleteAsset"
          @toggle-watchlist="handleToggleWatchlist" />
      </div>

      <div v-if="!store.items.length" class="surface-soft rounded-2xl p-6 text-center page-subtitle">
        No assets found.
      </div>
    </template>

    <AssetFormModal :open="modal" :asset="selected" :loading="formLoading" @close="closeModal" @submit="saveAsset" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAssetStore } from '@/stores/asset.store'
import AssetTable from '@/components/assets/AssetTable.vue'
import AssetCardList from '@/components/assets/AssetCardList.vue'
import AssetFormModal from '@/components/assets/AssetFormModal.vue'
import AssetSearch from '@/components/assets/AssetSearch.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import { toastService } from '@/utils/toast'

const store = useAssetStore()

const modal = ref(false)
const selected = ref(null)
const formLoading = ref(false)
const watchlistOnly = ref(false)

onMounted(async () => {
  store.reset()
  watchlistOnly.value = false

  try {
    await store.getAll()
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to load assets.'
    )
  }
})

function openCreate() {
  selected.value = null
  modal.value = true
}

function formatMarket(market) {
  if (!market) return '-'
  return market.charAt(0).toUpperCase() + market.slice(1)
}

async function viewAsset(id) {
  const toastId = toastService.loading('Loading asset detail...')

  try {
    await store.getOne(id)
    toastService.dismiss(toastId)
    toastService.success('Asset detail loaded successfully.')
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to load asset detail.'
    )
  }
}

async function editAsset(id) {
  const toastId = toastService.loading('Loading asset for editing...')

  try {
    const res = await store.getOne(id)
    selected.value = res.data.data
    modal.value = true
    toastService.dismiss(toastId)
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to load asset.'
    )
  }
}

async function handleSearch(keyword) {
  store.filters.search = keyword?.trim() || ''

  try {
    await store.getAll()
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to search assets.'
    )
  }
}

async function handleWatchlistFilter() {
  store.filters.watchlist_only = !!watchlistOnly.value

  try {
    await store.getAll()
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to filter assets.'
    )
  }
}

async function handleToggleWatchlist(id) {
  const toastId = toastService.loading('Updating watchlist...')

  try {
    await store.toggleWatchlist(id)
    toastService.dismiss(toastId)
    toastService.success('Watchlist updated.')
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to update watchlist.'
    )
  }
}

async function saveAsset(data) {
  formLoading.value = true

  const toastId = toastService.loading(
    selected.value?.id ? 'Updating asset...' : 'Creating asset...'
  )

  try {
    if (selected.value?.id) {
      await store.update(selected.value.id, data)
      toastService.dismiss(toastId)
      toastService.success('Asset updated successfully.')
    } else {
      await store.create(data)
      toastService.dismiss(toastId)
      toastService.success('Asset created successfully.')
    }

    await store.getAll()
    closeModal()
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to save asset.'
    )
  } finally {
    formLoading.value = false
  }
}

async function deleteAsset(id) {
  const toastId = toastService.loading('Deleting asset...')

  try {
    await store.remove(id)
    await store.getAll()

    if (store.detail?.id === id) {
      store.detail = null
    }

    toastService.dismiss(toastId)
    toastService.success('Asset deleted successfully.')
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to delete asset.'
    )
  }
}

function closeModal() {
  modal.value = false
  selected.value = null
}
</script>

<style scoped>
.page-title {
  color: var(--text-title);
}

.section-title {
  color: var(--text-title);
}

.page-subtitle {
  color: var(--text-muted);
}

.page-body {
  color: var(--text-body);
}

.surface-soft {
  border: 1px solid var(--surface-soft-border);
  background: var(--surface-soft-bg);
}

.surface-divider {
  border-bottom: 1px solid var(--surface-soft-border);
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

.asset-checkbox {
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  accent-color: #06b6d4;
}
</style>