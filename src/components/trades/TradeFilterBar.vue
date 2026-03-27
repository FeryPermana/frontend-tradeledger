<template>
  <div class="space-y-4">
    <div class="surface-card hidden rounded-2xl p-4 shadow-xl md:block">
      <FilterFields :filters="filters" :options="allOptions" @apply="applyFilters" @reset="resetFilters" />
    </div>

    <div class="space-y-3 md:hidden">
      <BaseInput v-model="filters.search" placeholder="Search keyword..." @keyup.enter="applyFilters" />

      <div class="grid grid-cols-2 gap-2">
        <BaseSelect v-model="filters.sort_by" label="Sort By" :options="allOptions.sortBy" />

        <BaseSelect v-model="filters.sort_direction" label="Direction" :options="allOptions.sortDirection" />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <BaseButton variant="secondary" class="w-full" @click="showMobileModal = true">
          More Filters
        </BaseButton>

        <BaseButton class="w-full" @click="applyFilters">
          Apply
        </BaseButton>
      </div>

      <div v-if="showMobileModal" class="fixed inset-0 z-50 bg-black/60 px-4 py-4 sm:px-6">
        <div class="flex min-h-full items-center justify-center">
          <div class="modal-panel flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl shadow-2xl">
            <div class="modal-header flex items-center justify-between px-5 py-4 sm:px-6">
              <h3 class="modal-title text-lg font-semibold sm:text-xl">More Filters</h3>

              <button type="button" class="modal-close rounded-xl px-3 py-2 text-sm transition"
                @click="showMobileModal = false">
                ✕
              </button>
            </div>

            <div class="overflow-y-auto px-5 py-5 sm:px-6">
              <div class="space-y-4">
                <BaseSelect v-model="filters.account_id" label="Account" :options="allOptions.accounts" />

                <SearchSelect v-model="filters.asset_id" label="Asset" :options="allOptions.assets" />

                <SearchSelect v-model="filters.strategy_id" label="Strategy" :options="allOptions.strategies" />

                <BaseSelect v-model="filters.position_type" label="Position Type" :options="allOptions.positions" />

                <div class="grid grid-cols-2 gap-3">
                  <BaseInput v-model="filters.date_from" label="From" type="date" />

                  <BaseInput v-model="filters.date_to" label="To" type="date" />
                </div>
              </div>

              <div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <BaseButton variant="secondary" class="w-full sm:w-auto" @click="resetFilters">
                  Reset
                </BaseButton>

                <BaseButton class="w-full sm:w-auto" @click="handleMobileApply">
                  Apply Filters
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import SearchSelect from '@/components/common/SearchSelect.vue'
import FilterFields from './FilterFields.vue'
import { useAccountStore } from '@/stores/account.store'
import { useAssetStore } from '@/stores/asset.store'
import { useStrategyStore } from '@/stores/strategy.store'

const emit = defineEmits(['apply', 'reset'])

const showMobileModal = ref(false)

const accountStore = useAccountStore()
const assetStore = useAssetStore()
const strategyStore = useStrategyStore()

const filters = reactive({
  search: '',
  account_id: '',
  asset_id: '',
  strategy_id: '',
  position_type: '',
  date_from: '',
  date_to: '',
  sort_by: 'entry_date',
  sort_direction: 'desc',
})

const allOptions = computed(() => ({
  accounts: accountStore.items.map((item) => ({
    value: item.id,
    label: item.name,
  })),
  assets: assetStore.items.map((item) => ({
    value: item.id,
    label: `${item.symbol} - ${item.name}`,
  })),
  strategies: strategyStore.items.map((item) => ({
    value: item.id,
    label: item.name,
  })),
  positions: [
    { value: 'scalping', label: 'Scalping' },
    { value: 'intra_day', label: 'Intra Day' },
    { value: 'swing', label: 'Swing' },
    { value: 'investment', label: 'Investment' },
    { value: 'no_investment', label: 'No Investment' },
  ],
  sortBy: [
    { value: 'entry_date', label: 'Entry Date' },
    { value: 'exit_date', label: 'Exit Date' },
    { value: 'profit_loss', label: 'Profit / Loss' },
    { value: 'created_at', label: 'Created At' },
  ],
  sortDirection: [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' },
  ],
}))

onMounted(async () => {
  if (!accountStore.items.length) await accountStore.getAll()
  if (!assetStore.items.length) await assetStore.getAll()
  if (!strategyStore.items.length) await strategyStore.getAll()
})

function applyFilters() {
  emit('apply', {
    ...filters,
  })
}

function handleMobileApply() {
  applyFilters()
  showMobileModal.value = false
}

function resetFilters() {
  filters.search = ''
  filters.account_id = ''
  filters.asset_id = ''
  filters.strategy_id = ''
  filters.position_type = ''
  filters.date_from = ''
  filters.date_to = ''
  filters.sort_by = 'entry_date'
  filters.sort_direction = 'desc'

  emit('reset')
  showMobileModal.value = false
}
</script>

<style scoped>
.surface-card {
  border: 1px solid var(--surface-card-border);
  background: var(--surface-card-bg);
}

.modal-panel {
  border: 1px solid var(--modal-border);
  background: var(--modal-bg);
}

.modal-header {
  border-bottom: 1px solid var(--modal-border);
}

.modal-title {
  color: var(--modal-title);
}

.modal-close {
  border: 1px solid var(--modal-close-border);
  background: var(--modal-close-bg);
  color: var(--modal-close-text);
}

.modal-close:hover {
  color: var(--modal-close-hover-text);
}
</style>