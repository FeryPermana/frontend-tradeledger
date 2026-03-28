<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/60 px-4 py-4 backdrop-blur-sm sm:px-6">
    <div class="flex min-h-full items-center justify-center">
      <div class="modal-panel flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl shadow-2xl">
        <div class="modal-header flex items-center justify-between px-5 py-4 sm:px-6">
          <h3 class="modal-title text-lg font-semibold sm:text-xl">Trade Detail</h3>

          <button type="button" class="modal-close rounded-xl px-3 py-2 text-sm transition" @click="$emit('close')">
            ✕
          </button>
        </div>

        <div class="overflow-y-auto px-5 py-5 sm:px-6">
          <div class="space-y-6">
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Account</label>
                <div class="field-box page-title break-words rounded-xl px-4 py-2.5">
                  {{ trade?.account?.name || '-' }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Asset</label>
                <div class="field-box page-title break-words rounded-xl px-4 py-2.5">
                  {{ assetDisplay }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Strategy</label>
                <div class="field-box page-title break-words rounded-xl px-4 py-2.5">
                  {{ trade?.strategy?.name || '-' }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Position Type</label>
                <div class="field-box page-title rounded-xl px-4 py-2.5 capitalize">
                  {{ positionTypeDisplay }}
                </div>
              </div>
            </div>

            <div v-if="isInvestmentCloseRecord" class="surface-soft rounded-2xl px-4 py-3 text-sm">
              <p class="font-medium text-cyan-300">Investment Sell Record</p>
              <p class="page-subtitle mt-1">
                This record was generated from Portfolio as a realized investment sell transaction.
              </p>
            </div>

            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Entry Price</label>
                <div class="field-box break-words rounded-xl px-4 py-2.5 font-medium text-cyan-400">
                  {{ displayMoney(trade?.entry_price) }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Exit Price</label>
                <div class="field-box break-words rounded-xl px-4 py-2.5 font-medium text-amber-400">
                  {{ nullableMoney(trade?.exit_price) }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Fees</label>
                <div class="field-box page-title break-words rounded-xl px-4 py-2.5">
                  {{ displayMoney(trade?.fees) }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Status</label>
                <div class="field-box rounded-xl px-4 py-2.5">
                  <span class="inline-flex rounded-full px-3 py-1 text-xs font-medium" :class="statusBadgeClass">
                    {{ statusLabel }}
                  </span>
                </div>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Stop Loss</label>
                <div class="field-box break-words rounded-xl px-4 py-2.5 text-red-400">
                  {{ nullableMoney(trade?.stop_loss) }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Take Profit</label>
                <div class="field-box break-words rounded-xl px-4 py-2.5 text-green-400">
                  {{ nullableMoney(trade?.take_profit) }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Entry Date</label>
                <div class="field-box page-title rounded-xl px-4 py-2.5">
                  {{ formatDate(trade?.entry_date) }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Exit Date</label>
                <div class="field-box page-title rounded-xl px-4 py-2.5">
                  {{ formatDate(trade?.exit_date) }}
                </div>
              </div>
            </div>

            <div v-if="isInvestmentCloseRecord" class="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
              <div class="surface-soft rounded-2xl p-4 text-center">
                <p class="page-subtitle text-xs uppercase tracking-wider">Sold Quantity</p>
                <p class="page-title mt-2 break-words text-xl font-bold">
                  {{ quantityDisplay }}
                </p>
              </div>

              <div class="surface-soft rounded-2xl p-4 text-center">
                <p class="page-subtitle text-xs uppercase tracking-wider">Position State</p>
                <p class="mt-2 text-xl font-bold text-red-400">
                  Realized Sell
                </p>
              </div>
            </div>

            <div v-else class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div class="surface-soft rounded-2xl p-4 text-center">
                <p class="page-subtitle text-xs uppercase tracking-wider">Total Quantity</p>
                <p class="page-title mt-2 break-words text-xl font-bold">
                  {{ quantityDisplay }}
                </p>
              </div>

              <div class="surface-soft rounded-2xl p-4 text-center">
                <p class="page-subtitle text-xs uppercase tracking-wider">Closed Quantity</p>
                <p class="page-title mt-2 break-words text-xl font-bold">
                  {{ closedQuantityDisplay }}
                </p>
              </div>

              <div class="surface-soft rounded-2xl p-4 text-center">
                <p class="page-subtitle text-xs uppercase tracking-wider">Remaining Quantity</p>
                <p class="page-title mt-2 break-words text-xl font-bold">
                  {{ remainingQuantityDisplay }}
                </p>
              </div>

              <div class="surface-soft rounded-2xl p-4 text-center">
                <p class="page-subtitle text-xs uppercase tracking-wider">Position State</p>
                <p class="mt-2 text-xl font-bold" :class="positionStateClass">
                  {{ positionStateLabel }}
                </p>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div class="surface-soft rounded-2xl p-4 text-center">
                <p class="page-subtitle text-xs uppercase tracking-wider">PnL Result</p>
                <p class="mt-2 break-words text-xl font-bold" :class="profitLossClass">
                  {{ profitLossDisplay }}
                </p>
              </div>

              <div class="surface-soft rounded-2xl p-4 text-center">
                <p class="page-subtitle text-xs uppercase tracking-wider">R Multiple</p>
                <p class="page-title mt-2 text-xl font-bold">
                  {{ rMultipleDisplay }}
                </p>
              </div>

              <div class="surface-soft rounded-2xl p-4 text-center sm:col-span-2 xl:col-span-1">
                <p class="page-subtitle text-xs uppercase tracking-wider">Risk Amount</p>
                <p class="page-body mt-2 break-words text-xl font-bold">
                  {{ riskAmountDisplay }}
                </p>
              </div>
            </div>

            <div class="grid gap-4 xl:grid-cols-2">
              <div>
                <label class="page-subtitle mb-2 ml-1 block text-sm font-medium">Tags</label>
                <div class="field-box flex min-h-[52px] flex-wrap gap-2 rounded-xl p-3">
                  <span v-for="tag in trade?.tags || []" :key="tag.id" class="tag-pill rounded-lg px-3 py-1 text-sm">
                    {{ tag.name }}
                  </span>

                  <p v-if="!trade?.tags?.length" class="page-caption text-sm italic">
                    No tags
                  </p>
                </div>
              </div>

              <div>
                <label class="page-subtitle mb-2 ml-1 block text-sm font-medium">Notes</label>
                <div class="field-box page-body min-h-[52px] whitespace-pre-wrap rounded-xl p-3 text-sm">
                  {{ trade?.notes || 'No notes available.' }}
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button type="button"
                class="btn-soft w-full rounded-xl px-8 py-2.5 text-sm font-medium transition sm:w-auto"
                @click="$emit('close')">
                Close Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/formatters'

const props = defineProps({
  open: { type: Boolean, default: false },
  trade: { type: Object, default: null },
})

defineEmits(['close'])

const tradeCurrency = computed(() => props.trade?.account?.currency || 'USD')

const isInvestmentCloseRecord = computed(() => {
  return props.trade?.position_type === 'investment' && props.trade?.status === 'closed'
})

const assetDisplay = computed(() => {
  const symbol = props.trade?.asset?.symbol
  const name = props.trade?.asset?.name

  if (symbol && name) return `${symbol} - ${name}`
  if (symbol) return symbol
  if (name) return name
  return '-'
})

const positionTypeDisplay = computed(() => {
  const value = props.trade?.position_type
  if (!value) return '-'
  if (value === 'intra_day') return 'Intra Day'
  return value.charAt(0).toUpperCase() + value.slice(1)
})

const quantityValue = computed(() => Number(props.trade?.quantity || 0))
const closedQuantityValue = computed(() => Number(props.trade?.closed_quantity || 0))
const remainingQuantityValue = computed(() => {
  if (isInvestmentCloseRecord.value) return 0

  if (props.trade?.remaining_quantity !== undefined && props.trade?.remaining_quantity !== null) {
    return Number(props.trade.remaining_quantity || 0)
  }

  const remaining = quantityValue.value - closedQuantityValue.value
  return remaining > 0 ? remaining : 0
})

const quantityDisplay = computed(() => formatNumber(quantityValue.value))
const closedQuantityDisplay = computed(() => formatNumber(closedQuantityValue.value))
const remainingQuantityDisplay = computed(() => formatNumber(remainingQuantityValue.value))

const statusLabel = computed(() => {
  if (isInvestmentCloseRecord.value) return 'Closed'
  if (props.trade?.status === 'closed') return 'Closed'
  if (closedQuantityValue.value > 0 && remainingQuantityValue.value > 0) return 'Partial'
  return props.trade?.status ? capitalize(props.trade.status) : '-'
})

const statusBadgeClass = computed(() => {
  if (isInvestmentCloseRecord.value) return 'bg-red-500/10 text-red-400'
  if (props.trade?.status === 'closed') return 'bg-red-500/10 text-red-400'
  if (closedQuantityValue.value > 0 && remainingQuantityValue.value > 0) return 'bg-amber-500/10 text-amber-400'
  return 'bg-emerald-500/10 text-emerald-400'
})

const positionStateLabel = computed(() => {
  if (props.trade?.status === 'closed') return 'Fully Closed'
  if (closedQuantityValue.value > 0 && remainingQuantityValue.value > 0) return 'Partially Closed'
  return 'Still Open'
})

const positionStateClass = computed(() => {
  if (props.trade?.status === 'closed') return 'text-red-400'
  if (closedQuantityValue.value > 0 && remainingQuantityValue.value > 0) return 'text-amber-400'
  return 'text-green-400'
})

const riskAmount = computed(() => {
  if (!props.trade) return 0

  const entry = Number(props.trade.entry_price || 0)
  const stopLoss = Number(props.trade.stop_loss || 0)
  const quantity = Number(props.trade.quantity || 0)

  if (!entry || !stopLoss || !quantity) return 0

  const risk = (entry - stopLoss) * quantity
  return risk > 0 ? risk : 0
})

const profitLossValue = computed(() => Number(props.trade?.profit_loss || 0))

const profitLossDisplay = computed(() => {
  if (props.trade?.profit_loss === null || props.trade?.profit_loss === undefined) {
    return '-'
  }

  return formatCurrency(props.trade.profit_loss, tradeCurrency.value)
})

const profitLossClass = computed(() => {
  if (props.trade?.profit_loss === null || props.trade?.profit_loss === undefined) {
    return 'page-body'
  }

  return profitLossValue.value >= 0 ? 'text-green-400' : 'text-red-400'
})

const rMultipleDisplay = computed(() => {
  if (props.trade?.r_multiple === null || props.trade?.r_multiple === undefined) {
    return '-'
  }

  return props.trade.r_multiple
})

const riskAmountDisplay = computed(() => {
  return formatCurrency(riskAmount.value, tradeCurrency.value)
})

function displayMoney(value) {
  return formatCurrency(value || 0, tradeCurrency.value)
}

function nullableMoney(value) {
  if (value === null || value === undefined || value === '') return '-'
  return formatCurrency(value, tradeCurrency.value)
}

function formatDate(dateString) {
  if (!dateString) return '-'

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function formatNumber(value) {
  if (value === null || value === undefined || value === '') return '-'
  return Number(value)
}

function capitalize(value) {
  if (!value) return '-'
  return value.charAt(0).toUpperCase() + value.slice(1)
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

.field-box {
  border: 1px solid var(--surface-soft-border);
  background: var(--surface-soft-bg);
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

.btn-soft {
  background: var(--button-soft-bg);
  color: var(--button-soft-text);
}

.btn-soft:hover {
  background: var(--button-soft-hover);
}

.page-title {
  color: var(--text-title);
}

.page-body {
  color: var(--text-body);
}

.page-subtitle {
  color: var(--text-muted);
}

.page-caption {
  color: var(--text-caption);
}
</style>