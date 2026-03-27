<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/60 px-4 py-4 sm:px-6">
    <div class="flex min-h-full items-center justify-center">
      <div class="modal-panel flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl shadow-2xl">

        <!-- HEADER -->
        <div class="modal-header flex items-center justify-between px-5 py-4 sm:px-6">
          <h3 class="modal-title text-lg font-semibold sm:text-xl">
            {{ isEdit ? 'Edit Trade' : 'Create Trade' }}
          </h3>

          <button type="button" class="modal-close rounded-xl px-3 py-2 text-sm transition" @click="$emit('close')">
            ✕
          </button>
        </div>

        <!-- BODY -->
        <div class="modal-body overflow-y-auto px-5 py-5 sm:px-6">
          <p v-if="!isInvestment && !isClosedTrade && selectedAssetCategory === 'stock'"
                  class="field-helper text-xs">
                  For stocks, quantity uses lots. 1 lot = 100 shares.
                </p>
          <form class="space-y-6" @submit.prevent="handleSubmit">

            <!-- SELECT -->
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <BaseSelect v-model="form.account_id" label="Account *" :options="accountOptions"
                :error="errors.account_id" :disabled="isEdit" />

              <SearchSelect v-model="form.asset_id" label="Asset *" :options="assetOptions" :error="errors.asset_id"
                :disabled="isEdit" />

              <SearchSelect v-if="!isInvestment" v-model="form.strategy_id" label="Strategy" :options="strategyOptions"
                :error="errors.strategy_id" />

              <BaseSelect v-model="form.position_type" label="Position Type *" :options="positionTypeOptions"
                :error="errors.position_type" :disabled="isEdit" />
            </div>

            <!-- ALERT -->
            <div v-if="isInvestment" class="alert-warning rounded-2xl px-4 py-3 text-sm">
              <p class="font-medium">Investment Position</p>
              <p class="mt-1">Investment mode only keeps required fields.</p>
            </div>

            <!-- INPUT -->
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <BaseInput v-model="form.entry_price" label="Entry Price *" type="number" :error="errors.entry_price" placeholder="Use dot (.) for decimals. Do not use thousand separators."/>

              <BaseInput v-if="!isInvestment" v-model="form.exit_price" label="Exit Price" type="number" placeholder="Use dot (.) for decimals. Do not use thousand separators."
                :error="errors.exit_price" />

              <div class="space-y-2">
                <BaseInput v-model="form.quantity" label="Quantity *" type="number" :error="errors.quantity" placeholder="Use dot (.) for decimals. Do not use thousand separators."
                  :disabled="isEdit" />
              </div>

              <BaseInput v-if="!isInvestment && !isClosedTrade" v-model="form.partial_close" label="Partial Close"
                type="number" :error="errors.partial_close" placeholder="Use dot (.) for decimals. Do not use thousand separators." />

              <BaseInput v-if="!isInvestment" v-model="form.fees" label="Fees" type="number" :error="errors.fees" placeholder="Use dot (.) for decimals. Do not use thousand separators." />
            </div>

            <!-- SL TP -->
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <BaseInput v-if="!isInvestment" v-model="form.stop_loss" label="Stop Loss" type="number" placeholder="Use dot (.) for decimals. Do not use thousand separators."/>

              <BaseInput v-if="!isInvestment" v-model="form.take_profit" label="Take Profit" type="number" placeholder="Use dot (.) for decimals. Do not use thousand separators."/>

              <BaseInput v-model="form.entry_date" label="Entry Date *" type="datetime-local"
                :error="errors.entry_date" />

              <BaseInput v-if="!isInvestment" v-model="form.exit_date" label="Exit Date" type="datetime-local"
                :error="errors.exit_date" />
            </div>

            <!-- TAGS + NOTES -->
            <div v-if="!isInvestment" class="grid gap-4 xl:grid-cols-2">
              <div>
                <label class="page-subtitle mb-2 block text-sm font-medium">Tags</label>

                <div class="surface-soft grid max-h-52 gap-2 overflow-y-auto rounded-xl p-3 sm:grid-cols-2">
                  <label v-for="tag in tagStore.items" :key="tag.id"
                    class="tag-pill flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
                    <input v-model="form.tag_ids" type="checkbox" :value="tag.id" />
                    <span class="truncate">{{ tag.name }}</span>
                  </label>
                </div>
              </div>

              <BaseTextarea v-model="form.notes" label="Notes" placeholder="Write your trade note..." />
            </div>

            <!-- STATS -->
            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div class="surface-soft rounded-2xl p-4">
                <p class="page-subtitle text-sm">Account Equity</p>
                <p class="page-title mt-2 text-lg font-semibold">
                  {{ selectedAccountEquityDisplay }}
                </p>
              </div>

              <div class="surface-soft rounded-2xl p-4">
                <p class="page-subtitle text-sm">Available Cash</p>
                <p class="page-title mt-2 text-lg font-semibold">
                  {{ availableCashDisplay }}
                </p>
              </div>

              <div class="surface-soft rounded-2xl p-4">
                <p class="page-subtitle text-sm">Required Cash</p>
                <p class="page-title mt-2 text-lg font-semibold">
                  {{ requiredCashDisplay }}
                </p>
              </div>

              <div class="surface-soft rounded-2xl p-4">
                <p class="page-subtitle text-sm">Position Value</p>
                <p class="page-title mt-2 text-lg font-semibold">
                  {{ positionValueDisplay }}
                </p>
              </div>
            </div>

            <!-- RESULT -->
            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div class="surface-soft rounded-2xl p-4">
                <p class="page-subtitle text-sm">Risk Amount</p>
                <p class="page-title mt-2 text-lg font-semibold">
                  {{ riskAmountDisplay }}
                </p>
              </div>

              <div class="surface-soft rounded-2xl p-4">
                <p class="page-subtitle text-sm">PnL Preview</p>
                <p class="mt-2 text-lg font-semibold" :class="pnlPreview >= 0 ? 'text-green-400' : 'text-red-400'">
                  {{ pnlPreviewDisplay }}
                </p>
              </div>

              <div class="surface-soft rounded-2xl p-4">
                <p class="page-subtitle text-sm">R Multiple</p>
                <p class="page-title mt-2 text-lg font-semibold">
                  {{ rPreviewDisplay }}
                </p>
              </div>
            </div>

            <!-- ERROR -->
            <div v-if="insufficientCash" class="alert-error rounded-2xl px-4 py-3 text-sm">
              Insufficient balance.
            </div>

            <!-- ACTION -->
            <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <BaseButton variant="secondary" class="w-full sm:w-auto" @click="$emit('close')">
                Cancel
              </BaseButton>

              <BaseButton type="submit" class="w-full sm:w-auto" :loading="loading">
                {{ isEdit ? 'Update Trade' : 'Save Trade' }}
              </BaseButton>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import SearchSelect from '@/components/common/SearchSelect.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'
import { useTradeStore } from '@/stores/trade.store'
import { useAccountStore } from '@/stores/account.store'
import { useAssetStore } from '@/stores/asset.store'
import { useStrategyStore } from '@/stores/strategy.store'
import { useTagStore } from '@/stores/tag.store'
import { toastService } from '@/utils/toast'
import { formatCurrency } from '@/utils/formatters'
import { fetchAccountAvailableBalance } from '@/api/account.api'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  trade: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'saved'])

const router = useRouter()
const tradeStore = useTradeStore()
const accountStore = useAccountStore()
const assetStore = useAssetStore()
const strategyStore = useStrategyStore()
const tagStore = useTagStore()

const loading = ref(false)
const accountBalanceInfo = ref(null)

const isEdit = computed(() => !!props.trade?.id)
const isInvestment = computed(() => form.position_type === 'investment')
const isClosedTrade = computed(() => props.trade?.status === 'closed')

const form = reactive({
  account_id: '',
  asset_id: '',
  strategy_id: '',
  position_type: '',
  entry_price: '',
  exit_price: '',
  quantity: '',
  partial_close: '',
  stop_loss: '',
  take_profit: '',
  fees: '',
  entry_date: '',
  exit_date: '',
  notes: '',
  tag_ids: [],
})

const errors = reactive({
  account_id: '',
  asset_id: '',
  strategy_id: '',
  position_type: '',
  entry_price: '',
  exit_price: '',
  quantity: '',
  partial_close: '',
  stop_loss: '',
  take_profit: '',
  fees: '',
  entry_date: '',
  exit_date: '',
  notes: '',
})

const positionTypeOptions = [
  { value: 'scalping', label: 'Scalping' },
  { value: 'intra_day', label: 'Intra Day' },
  { value: 'swing', label: 'Swing' },
  { value: 'investment', label: 'Investment' },
]

const accountOptions = computed(() =>
  accountStore.items.map((item) => ({
    value: item.id,
    label: `${item.name} (${item.currency})`,
  }))
)

const assetOptions = computed(() =>
  assetStore.items.map((item) => ({
    value: item.id,
    label: `${item.symbol} - ${item.name}`,
  }))
)

const strategyOptions = computed(() =>
  strategyStore.items.map((item) => ({
    value: item.id,
    label: item.name,
  }))
)

const selectedAccount = computed(() =>
  accountStore.items.find((item) => String(item.id) === String(form.account_id))
)

const selectedAccountEquity = computed(() =>
  Number(selectedAccount.value?.initial_balance || 0)
)

const selectedAccountCurrency = computed(() =>
  selectedAccount.value?.currency || 'USD'
)

const entryPriceNum = computed(() => Number(form.entry_price || 0))
const exitPriceNum = computed(() => Number(form.exit_price || 0))
const quantityNum = computed(() => Number(form.quantity || 0))
const partialCloseNum = computed(() => Number(form.partial_close || 0))
const stopLossNum = computed(() => Number(form.stop_loss || 0))
const feesNum = computed(() => Number(form.fees || 0))
const existingClosedQuantityNum = computed(() => Number(props.trade?.closed_quantity || 0))

const currentRemainingQuantity = computed(() => {
  return Math.max(0, quantityNum.value - existingClosedQuantityNum.value)
})

const positionValue = computed(() => {
  const baseFees = isInvestment.value ? 0 : feesNum.value
  if (!entryPriceNum.value || !quantityNum.value) return 0
  return (entryPriceNum.value * quantityNum.value) + baseFees
})

const requiredCash = computed(() => {
  const baseFees = isInvestment.value ? 0 : feesNum.value
  if (!entryPriceNum.value || !quantityNum.value) return 0
  return (entryPriceNum.value * quantityNum.value) + baseFees
})

const positionValueExceedsEquity = computed(() => {
  return positionValue.value > selectedAccountEquity.value
})

const previewCloseQuantity = computed(() => {
  if (isInvestment.value) {
    return quantityNum.value
  }

  if (!isEdit.value) {
    return partialCloseNum.value > 0 ? partialCloseNum.value : quantityNum.value
  }

  return partialCloseNum.value > 0 ? partialCloseNum.value : 0
})

const riskAmount = computed(() => {
  if (isInvestment.value) return 0
  if (!entryPriceNum.value || !stopLossNum.value || !previewCloseQuantity.value) return 0

  const risk = (entryPriceNum.value - stopLossNum.value) * previewCloseQuantity.value
  return risk > 0 ? risk : 0
})

const pnlPreview = computed(() => {
  if (isInvestment.value) return 0
  if (!entryPriceNum.value || !exitPriceNum.value || !previewCloseQuantity.value) return 0

  return ((exitPriceNum.value - entryPriceNum.value) * previewCloseQuantity.value) - feesNum.value
})

const rPreview = computed(() => {
  if (isInvestment.value) return 0
  if (!riskAmount.value) return 0
  return pnlPreview.value / riskAmount.value
})

const selectedAccountEquityDisplay = computed(() =>
  formatCurrency(selectedAccountEquity.value, selectedAccountCurrency.value)
)

const availableCashDisplay = computed(() =>
  formatCurrency(accountBalanceInfo.value?.available_balance || 0, selectedAccountCurrency.value)
)

const requiredCashDisplay = computed(() =>
  formatCurrency(requiredCash.value, selectedAccountCurrency.value)
)

const positionValueDisplay = computed(() =>
  formatCurrency(positionValue.value, selectedAccountCurrency.value)
)

const riskAmountDisplay = computed(() =>
  formatCurrency(riskAmount.value, selectedAccountCurrency.value)
)

const pnlPreviewDisplay = computed(() =>
  formatCurrency(pnlPreview.value, selectedAccountCurrency.value)
)

const rPreviewDisplay = computed(() =>
  Number.isFinite(rPreview.value) ? rPreview.value.toFixed(2) : '0.00'
)

const insufficientCash = computed(() => {
  if (!form.account_id) return false
  if (!accountBalanceInfo.value) return false
  if (!isInvestment.value && form.exit_date) return false

  return requiredCash.value > Number(accountBalanceInfo.value?.available_balance || 0)
})

const selectedAsset = computed(() =>
  assetStore.items.find((item) => String(item.id) === String(form.asset_id))
)

const selectedAssetCategory = computed(() =>
  selectedAsset.value?.category || ''
)

onMounted(async () => {
  if (!accountStore.items.length) await accountStore.getAll()
  if (!assetStore.items.length) await assetStore.getAll()
  if (!strategyStore.items.length) await strategyStore.getAll()
  if (!tagStore.items.length) await tagStore.getAll()
})

watch(
  () => props.trade,
  () => {
    resetForm()
    resetErrors()
  },
  { immediate: true }
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm()
      resetErrors()
    }
  }
)

watch(
  () => form.position_type,
  (value) => {
    if (value === 'investment') {
      form.strategy_id = ''
      form.exit_price = ''
      form.partial_close = ''
      form.fees = ''
      form.stop_loss = ''
      form.take_profit = ''
      form.exit_date = ''
      form.notes = 'Investment Entry'
      form.tag_ids = []
    }
  }
)

watch(
  () => [form.account_id, props.trade?.id],
  async ([accountId, tradeId]) => {
    if (!accountId) {
      accountBalanceInfo.value = null
      return
    }

    try {
      const params = {}

      if (tradeId) {
        params.exclude_trade_id = tradeId
      }

      const res = await fetchAccountAvailableBalance(accountId, params)
      accountBalanceInfo.value = res.data?.data ?? null
    } catch {
      accountBalanceInfo.value = null
    }
  },
  { immediate: true }
)

function resetForm() {
  form.account_id = props.trade?.account_id ?? ''
  form.asset_id = props.trade?.asset_id ?? ''
  form.strategy_id = props.trade?.strategy_id ?? ''
  form.position_type = props.trade?.position_type ?? ''
  form.entry_price = formatNumberForInput(props.trade?.entry_price)
  form.exit_price = formatNumberForInput(props.trade?.exit_price)
  form.quantity = formatNumberForInput(props.trade?.quantity)
  form.stop_loss = formatNumberForInput(props.trade?.stop_loss)
  form.take_profit = formatNumberForInput(props.trade?.take_profit)
  form.fees = formatNumberForInput(props.trade?.fees)
  form.entry_date = toDateTimeLocal(props.trade?.entry_date)
  form.exit_date = toDateTimeLocal(props.trade?.exit_date)
  form.notes = props.trade?.notes ?? ''
  form.tag_ids = props.trade?.tags?.map((tag) => tag.id) ?? []
  form.partial_close = ''

  if (form.position_type === 'investment' && !form.notes) {
    form.notes = 'Investment Entry'
  }
}

function resetErrors() {
  errors.account_id = ''
  errors.asset_id = ''
  errors.strategy_id = ''
  errors.position_type = ''
  errors.entry_price = ''
  errors.exit_price = ''
  errors.quantity = ''
  errors.partial_close = ''
  errors.stop_loss = ''
  errors.take_profit = ''
  errors.fees = ''
  errors.entry_date = ''
  errors.exit_date = ''
  errors.notes = ''
}

function handleUpgradeRequired(error) {
  const response = error.response?.data

  if (response?.upgrade_required) {
    toastService.error(
      response.message?.id || 'Upgrade ke Pro diperlukan untuk menambah trade.'
    )

    emit('close')
    router.push({ name: 'payment', query: { plan: 'monthly' } })
    return true
  }

  return false
}

async function handleSubmit() {
  resetErrors()

  if (!form.account_id) errors.account_id = 'Account is required.'
  if (!form.asset_id) errors.asset_id = 'Asset is required.'
  if (!form.position_type) errors.position_type = 'Position type is required.'
  if (!form.entry_price) errors.entry_price = 'Entry price is required.'
  if (!form.quantity) errors.quantity = 'Quantity is required.'
  if (!form.entry_date) errors.entry_date = 'Entry date is required.'

  if (!isInvestment.value && partialCloseNum.value > currentRemainingQuantity.value) {
    errors.partial_close = 'Partial close cannot be greater than remaining quantity.'
  }

  if (!isInvestment.value && partialCloseNum.value > 0) {
    if (!form.exit_price) errors.exit_price = 'Exit price is required for partial close.'
    if (!form.exit_date) errors.exit_date = 'Exit date is required for partial close.'
  }

  if (!isInvestment.value && form.exit_date && form.entry_date && new Date(form.exit_date) < new Date(form.entry_date)) {
    errors.exit_date = 'Exit date must be after or equal to entry date.'
  }

  if (positionValueExceedsEquity.value) {
    errors.quantity = 'Position value exceeds account equity.'
  }

  if (insufficientCash.value) {
    toastService.error('Account cash is insufficient.')
    return
  }

  if (
    errors.account_id ||
    errors.asset_id ||
    errors.position_type ||
    errors.entry_price ||
    errors.quantity ||
    errors.partial_close ||
    errors.exit_price ||
    errors.entry_date ||
    errors.exit_date
  ) {
    toastService.error('Please complete the form correctly.')
    return
  }

  loading.value = true
  const toastId = toastService.loading(isEdit.value ? 'Updating trade...' : 'Saving trade...')

  const payload = {
    account_id: Number(form.account_id),
    asset_id: Number(form.asset_id),
    strategy_id: isInvestment.value || !form.strategy_id ? null : Number(form.strategy_id),
    position_type: form.position_type,
    entry_price: Number(form.entry_price),
    exit_price: isInvestment.value || form.exit_price === '' ? null : Number(form.exit_price),
    quantity: Number(form.quantity),
    closed_quantity: isInvestment.value ? 0 : (form.partial_close === '' ? 0 : Number(form.partial_close)),
    stop_loss: isInvestment.value || form.stop_loss === '' ? null : Number(form.stop_loss),
    take_profit: isInvestment.value || form.take_profit === '' ? null : Number(form.take_profit),
    fees: isInvestment.value || form.fees === '' ? 0 : Number(form.fees),
    entry_date: formatForBackend(form.entry_date),
    exit_date: isInvestment.value || !form.exit_date ? null : formatForBackend(form.exit_date),
    notes: isInvestment.value ? 'Investment Entry' : (form.notes || null),
    tag_ids: isInvestment.value ? [] : (Array.isArray(form.tag_ids) ? form.tag_ids : []),
  }

  try {
    if (isEdit.value) {
      await tradeStore.update(props.trade.id, payload)
      toastService.dismiss(toastId)
      toastService.success('Trade updated successfully.')
    } else {
      await tradeStore.create(payload)
      toastService.dismiss(toastId)
      toastService.success('Trade created successfully.')
    }

    emit('saved')
  } catch (error) {
    toastService.dismiss(toastId)

    if (handleUpgradeRequired(error)) {
      return
    }

    const response = error.response?.data

    if (response?.errors) {
      errors.account_id = response.errors.account_id?.[0] || ''
      errors.asset_id = response.errors.asset_id?.[0] || ''
      errors.strategy_id = response.errors.strategy_id?.[0] || ''
      errors.position_type = response.errors.position_type?.[0] || ''
      errors.entry_price = response.errors.entry_price?.[0] || ''
      errors.exit_price = response.errors.exit_price?.[0] || ''
      errors.quantity = response.errors.quantity?.[0] || ''
      errors.partial_close = response.errors.closed_quantity?.[0] || response.errors.partial_close?.[0] || ''
      errors.stop_loss = response.errors.stop_loss?.[0] || ''
      errors.take_profit = response.errors.take_profit?.[0] || ''
      errors.fees = response.errors.fees?.[0] || ''
      errors.entry_date = response.errors.entry_date?.[0] || ''
      errors.exit_date = response.errors.exit_date?.[0] || ''
      errors.notes = response.errors.notes?.[0] || ''
    }

    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to save trade.'
    )
  } finally {
    loading.value = false
  }
}

function toDateTimeLocal(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

function formatForBackend(value) {
  if (!value) return null
  return value.replace('T', ' ') + ':00'
}

function formatNumberForInput(value) {
  if (value === null || value === undefined || value === '') return ''
  return Number(value)
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

.modal-body {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.surface-soft {
  border: 1px solid var(--surface-soft-border);
  background: var(--surface-soft-bg);
}

.tag-pill {
  border: 1px solid var(--surface-card-border);
  background: var(--surface-card-bg);
  color: var(--text-body);
}

.page-title {
  color: var(--text-title);
}

.page-subtitle {
  color: var(--text-muted);
}

.alert-warning {
  border: 1px solid rgba(251, 191, 36, 0.3);
  background: rgba(251, 191, 36, 0.1);
  color: #facc15;
}

.alert-error {
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
}

.field-helper {
  display: block;
  color: var(--text-muted);
  line-height: 1.5;
}
</style>