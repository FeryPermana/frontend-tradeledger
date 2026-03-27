<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <h1 class="page-title text-2xl font-bold">Strategies</h1>
        <p class="page-subtitle mt-1 text-sm">
          Manage your trading and investing strategies.
        </p>
      </div>

      <BaseButton class="w-full sm:w-auto" @click="openCreate">
        Create Strategy
      </BaseButton>
    </div>

    <BaseCard>
      <StrategySearch @search="handleSearch" />
    </BaseCard>

    <BaseCard v-if="store.detail" class="border-l-4 border-l-cyan-500">
      <div class="surface-divider mb-4 flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="section-title text-lg font-semibold">Strategy Detail</h2>

        <button type="button"
          class="btn-outline inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs transition"
          @click="store.detail = null">
          Close Detail
        </button>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div class="surface-soft rounded-xl p-4">
          <p class="page-caption text-[10px] font-medium uppercase tracking-wider">
            Name
          </p>
          <p class="page-title mt-1 break-words text-base font-semibold">
            {{ store.detail.name }}
          </p>
        </div>

        <div class="surface-soft rounded-xl p-4">
          <p class="page-caption text-[10px] font-medium uppercase tracking-wider">
            Timeframe
          </p>
          <p class="page-body mt-1 text-sm">
            {{ store.detail.timeframe || '-' }}
          </p>
        </div>

        <div class="surface-soft rounded-xl p-4">
          <p class="page-caption text-[10px] font-medium uppercase tracking-wider">
            Setup Type
          </p>
          <p class="page-body mt-1 text-sm">
            {{ formatLabel(store.detail.setup_type) }}
          </p>
        </div>

        <div class="surface-soft rounded-xl p-4">
          <p class="page-caption text-[10px] font-medium uppercase tracking-wider">
            Risk Model
          </p>
          <p class="page-body mt-1 text-sm">
            {{ formatLabel(store.detail.risk_model) }}
          </p>
        </div>
      </div>

      <div class="surface-divider mt-6 pt-4">
        <p class="page-caption mb-2 text-[10px] font-medium uppercase tracking-wider">
          Notes / Description
        </p>

        <div class="surface-soft page-body rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap">
          {{ store.detail.description || 'No description provided for this strategy.' }}
        </div>
      </div>
    </BaseCard>

    <div v-if="store.loading" class="surface-soft rounded-2xl p-6 page-subtitle">
      Loading strategies...
    </div>

    <template v-else>
      <div v-if="store.items.length" class="hidden md:block">
        <StrategyTable :items="store.items" @view="viewStrategy" @edit="editStrategy" @delete="deleteStrategy" />
      </div>

      <div v-if="store.items.length" class="md:hidden">
        <StrategyCardList :items="store.items" @view="viewStrategy" @edit="editStrategy" @delete="deleteStrategy" />
      </div>

      <div v-if="!store.items.length" class="surface-soft rounded-2xl p-6 text-center page-subtitle">
        No strategies found.
      </div>
    </template>

    <StrategyFormModal :open="modal" :strategy="selected" :loading="formLoading" @close="closeModal"
      @submit="saveStrategy" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useStrategyStore } from '@/stores/strategy.store'
import StrategyTable from '@/components/strategies/StrategyTable.vue'
import StrategyCardList from '@/components/strategies/StrategyCardList.vue'
import StrategyFormModal from '@/components/strategies/StrategyFormModal.vue'
import StrategySearch from '@/components/strategies/StrategySearch.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import { toastService } from '@/utils/toast'

const store = useStrategyStore()

const modal = ref(false)
const selected = ref(null)
const formLoading = ref(false)

onMounted(async () => {
  store.reset()

  try {
    await store.getAll()
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to load strategies.'
    )
  }
})

function formatLabel(value) {
  if (!value) return '-'
  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function openCreate() {
  selected.value = null
  modal.value = true
}

async function viewStrategy(id) {
  const toastId = toastService.loading('Loading strategy detail...')

  try {
    await store.getOne(id)
    toastService.dismiss(toastId)
    toastService.success('Strategy detail loaded successfully.')
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to load strategy detail.'
    )
  }
}

async function editStrategy(id) {
  const toastId = toastService.loading('Loading strategy for editing...')

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
      'Failed to load strategy.'
    )
  }
}

async function handleSearch(keyword) {
  const search = keyword?.trim() || ''

  try {
    if (!search) {
      await store.getAll()
      return
    }

    await store.getAll({ search })
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to search strategies.'
    )
  }
}

async function saveStrategy(data) {
  formLoading.value = true

  const toastId = toastService.loading(
    selected.value?.id ? 'Updating strategy...' : 'Creating strategy...'
  )

  try {
    if (selected.value?.id) {
      await store.update(selected.value.id, data)
      toastService.dismiss(toastId)
      toastService.success('Strategy updated successfully.')
    } else {
      await store.create(data)
      toastService.dismiss(toastId)
      toastService.success('Strategy created successfully.')
    }

    await store.getAll()
    closeModal()
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to save strategy.'
    )
  } finally {
    formLoading.value = false
  }
}

async function deleteStrategy(id) {
  const toastId = toastService.loading('Deleting strategy...')

  try {
    await store.remove(id)
    await store.getAll()

    if (store.detail?.id === id) {
      store.detail = null
    }

    toastService.dismiss(toastId)
    toastService.success('Strategy deleted successfully.')
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to delete strategy.'
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

.page-caption {
  color: var(--text-caption);
}

.surface-soft {
  border: 1px solid var(--surface-soft-border);
  background: var(--surface-soft-bg);
}

.surface-divider {
  border-top: 1px solid var(--surface-soft-border);
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
</style>