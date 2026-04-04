<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/60 px-4 py-4 sm:px-6">
    <div class="flex min-h-full items-center justify-center">
      <div class="modal-panel flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl shadow-2xl">
        <div class="modal-header flex items-center justify-between px-5 py-4 sm:px-6">
          <h3 class="modal-title text-lg font-semibold sm:text-xl">
            {{ isEdit ? 'Edit Asset' : 'Create Asset' }}
          </h3>

          <button type="button" class="modal-close rounded-xl px-3 py-2 text-sm transition" @click="$emit('close')">
            ✕
          </button>
        </div>

        <div class="overflow-y-auto px-5 py-5 sm:px-6">
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <BaseInput v-model="form.symbol" label="Symbol" placeholder="BTC" :error="errors.symbol" />

            <BaseInput v-model="form.name" label="Name" placeholder="Bitcoin" :error="errors.name" />

            <BaseInput v-model="form.market" label="Market" placeholder="CRYPTO / STOCK IDX / STOCK US / COMMODITY"
              :error="errors.market" />

            <BaseSelect v-model="form.category" label="Category" placeholder="Select category"
              :options="ASSET_CATEGORIES" :error="errors.category" />

            <BaseInput v-model="form.tradingview_url" label="TradingView URL"
              placeholder="https://www.tradingview.com/chart/..." :error="errors.tradingview_url" />

            <label class="surface-soft page-body flex items-center gap-3 rounded-xl px-4 py-3 text-sm">
              <input v-model="form.is_watchlist" type="checkbox" class="asset-checkbox h-4 w-4 rounded" />
              <span>Mark as watchlist</span>
            </label>

            <div class="modal-preview rounded-xl px-4 py-3 text-sm">
              <p class="modal-preview-label text-xs uppercase tracking-wide">Preview</p>

              <div class="mt-2 flex flex-wrap items-center gap-2">
                <span class="modal-preview-value font-semibold">
                  {{ previewSymbol || '-' }}
                </span>

                <span v-if="form.category" class="badge-neutral rounded-full border px-2 py-0.5 text-xs">
                  {{ categoryLabel }}
                </span>

                <span v-if="form.is_watchlist" class="text-yellow-400">
                  ★ Watchlist
                </span>
              </div>
            </div>

            <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <BaseButton type="button" variant="secondary" class="w-full sm:w-auto" @click="$emit('close')">
                Cancel
              </BaseButton>

              <BaseButton type="submit" class="w-full sm:w-auto" :loading="loading">
                {{ isEdit ? 'Update Asset' : 'Create Asset' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { toastService } from '@/utils/toast'

const ASSET_CATEGORIES = [
  {
    value: 'crypto',
    label: 'Crypto'
  },
  {
    value: 'stock_idx',
    label: 'IDX Stock'
  },
  {
    value: 'stock_us',
    label: 'US Stock'
  },
  {
    value: 'commodity',
    label: 'Commodity'
  },
]

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  asset: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'submit'])

const isEdit = computed(() => !!props.asset?.id)

const form = reactive({
  symbol: '',
  name: '',
  market: '',
  category: '',
  is_watchlist: false,
  tradingview_url: '',
})

const errors = reactive({
  symbol: '',
  name: '',
  market: '',
  category: '',
  tradingview_url: '',
})

const previewSymbol = computed(() => {
  return (form.symbol || '').toUpperCase()
})

const categoryLabel = computed(() => {
  const item = ASSET_CATEGORIES.find((opt) => opt.value === form.category)
  return item?.label || ''
})

function resetForm() {
  form.symbol = props.asset?.symbol || ''
  form.name = props.asset?.name || ''
  form.market = props.asset?.market || ''
  form.category = props.asset?.category || ''
  form.is_watchlist = !!props.asset?.is_watchlist
  form.tradingview_url = props.asset?.tradingview_url || ''
}

function resetErrors() {
  errors.symbol = ''
  errors.name = ''
  errors.market = ''
  errors.category = ''
  errors.tradingview_url = ''
}

watch(
  () => props.asset,
  () => {
    resetForm()
    resetErrors()
  },
  { immediate: true },
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm()
      resetErrors()
    }
  },
)

function handleSubmit() {
  resetErrors()

  if (!form.symbol) errors.symbol = 'Symbol is required.'
  if (!form.name) errors.name = 'Name is required.'
  if (!form.market) errors.market = 'Market is required.'
  if (!form.category) errors.category = 'Category is required.'

  if (form.tradingview_url) {
    try {
      new URL(form.tradingview_url)
    } catch {
      errors.tradingview_url = 'TradingView URL is not valid.'
    }
  }

  if (
    errors.symbol ||
    errors.name ||
    errors.market ||
    errors.category ||
    errors.tradingview_url
  ) {
    toastService.error('Please complete the form correctly.')
    return
  }

  emit('submit', {
    symbol: form.symbol.toUpperCase().trim(),
    name: form.name.trim(),
    market: form.market.trim(),
    category: form.category,
    is_watchlist: !!form.is_watchlist,
    tradingview_url: form.tradingview_url ? form.tradingview_url.trim() : null,
  })
}
</script>

<style scoped>
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

.modal-preview {
  border: 1px solid var(--modal-preview-border);
  background: var(--modal-preview-bg);
}

.modal-preview-label {
  color: var(--modal-preview-label);
}

.modal-preview-value {
  color: var(--modal-preview-value);
}

.surface-soft {
  border: 1px solid var(--surface-soft-border);
  background: var(--surface-soft-bg);
}

.page-body {
  color: var(--text-body);
}

.badge-neutral {
  border-color: var(--badge-neutral-border);
  background: var(--badge-neutral-bg);
  color: var(--badge-neutral-text);
}

.asset-checkbox {
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  accent-color: #facc15;
}
</style>