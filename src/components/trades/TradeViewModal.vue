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
                <label class="page-subtitle ml-1 text-sm font-medium">Quantity</label>
                <div class="field-box page-title break-words rounded-xl px-4 py-2.5">
                  {{ trade?.quantity ?? '-' }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Fees</label>
                <div class="field-box page-title break-words rounded-xl px-4 py-2.5">
                  {{ displayMoney(trade?.fees) }}
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

            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Status</label>
                <div class="field-box page-title rounded-xl px-4 py-2.5 capitalize">
                  {{ trade?.status || '-' }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Quantity</label>
                <div class="field-box page-title rounded-xl px-4 py-2.5">
                  {{ trade?.quantity ?? '-' }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Closed Quantity</label>
                <div class="field-box page-title rounded-xl px-4 py-2.5">
                  {{ trade?.closed_quantity ?? 0 }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="page-subtitle ml-1 text-sm font-medium">Remaining Quantity</label>
                <div class="field-box page-title rounded-xl px-4 py-2.5">
                  {{ trade?.remaining_quantity ?? tradeRemainingQuantity }}
                </div>
              </div>
            </div>

            <div v-if="tradeImages.length" class="space-y-3">
              <label class="page-subtitle ml-1 block text-sm font-medium">Images</label>

              <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <button v-for="image in tradeImages" :key="image.id" type="button"
                  class="image-card overflow-hidden rounded-2xl text-left transition" @click="openZoom(image)">
                  <img :src="getImageSrc(image)" alt="Trade image" class="h-44 w-full object-cover" />

                  <div class="space-y-1 p-3">
                    <p class="page-caption text-xs">
                      {{ formatImageType(image.type) }}
                    </p>
                    <p class="image-card-text line-clamp-2 text-sm">
                      {{ image.caption || 'No caption' }}
                    </p>
                  </div>
                </button>
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

      <div v-if="zoomImage" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
        @click="closeZoom">
        <div class="relative flex max-h-[90vh] w-full max-w-6xl flex-col items-center" @click.stop>
          <div class="mb-3 flex flex-wrap items-center gap-2 self-end">
            <button type="button" class="zoom-btn rounded-lg px-3 py-2 text-sm" @click="zoomOut">
              −
            </button>

            <button type="button" class="zoom-btn rounded-lg px-3 py-2 text-sm" @click="resetZoom">
              Reset
            </button>

            <button type="button" class="zoom-btn rounded-lg px-3 py-2 text-sm" @click="zoomIn">
              +
            </button>

            <button type="button" class="zoom-close-btn rounded-lg px-3 py-2 text-sm" @click="closeZoom">
              ✕
            </button>
          </div>

          <div ref="panzoomWrapperRef"
            class="flex h-[75vh] w-full items-center justify-center overflow-hidden rounded-2xl bg-black/40 p-4 touch-none">
            <img ref="panzoomImageRef" :src="getImageSrc(zoomImage)" alt="Zoomed trade image"
              class="max-h-[70vh] max-w-full rounded-2xl object-contain select-none" draggable="false" />
          </div>

          <div class="zoom-caption mt-3 rounded-xl p-3">
            <div class="page-subtitle mb-1 text-xs">
              {{ formatImageType(zoomImage.type) }}
            </div>
            <div class="zoom-caption-text text-sm">
              {{ zoomImage.caption || 'No caption' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, nextTick, onBeforeUnmount } from 'vue'
import Panzoom from '@panzoom/panzoom'
import { formatCurrency } from '@/utils/formatters'

const zoomImage = ref(null)
const panzoomImageRef = ref(null)
const panzoomWrapperRef = ref(null)

let panzoomInstance = null

const props = defineProps({
  open: { type: Boolean, default: false },
  trade: { type: Object, default: null },
})

defineEmits(['close'])

const tradeCurrency = computed(() => props.trade?.account?.currency || 'USD')
const tradeImages = computed(() => props.trade?.images || [])

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

const tradeRemainingQuantity = computed(() => {
  const quantity = Number(props.trade?.quantity || 0)
  const closed = Number(props.trade?.closed_quantity || 0)
  const remaining = quantity - closed
  return remaining > 0 ? remaining : 0
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

function getImageSrc(image) {
  return image.image_url || image.image_path
}

function formatImageType(type) {
  if (!type) return 'General'

  const map = {
    entry: 'Entry',
    exit: 'Exit',
    setup: 'Setup',
  }

  return map[type] || type
}

async function openZoom(image) {
  zoomImage.value = image

  await nextTick()

  if (panzoomInstance) {
    panzoomInstance.destroy()
    panzoomInstance = null
  }

  if (panzoomImageRef.value && panzoomWrapperRef.value) {
    panzoomInstance = Panzoom(panzoomImageRef.value, {
      maxScale: 4,
      minScale: 1,
      contain: 'outside',
      cursor: 'grab',
    })

    panzoomWrapperRef.value.addEventListener(
      'wheel',
      panzoomInstance.zoomWithWheel,
      { passive: false }
    )
  }
}

function closeZoom() {
  if (panzoomInstance && panzoomWrapperRef.value) {
    panzoomWrapperRef.value.removeEventListener(
      'wheel',
      panzoomInstance.zoomWithWheel
    )
    panzoomInstance.destroy()
    panzoomInstance = null
  }

  zoomImage.value = null
}

function zoomIn() {
  if (panzoomInstance) {
    panzoomInstance.zoomIn()
  }
}

function zoomOut() {
  if (panzoomInstance) {
    panzoomInstance.zoomOut()
  }
}

function resetZoom() {
  if (panzoomInstance) {
    panzoomInstance.reset()
  }
}

onBeforeUnmount(() => {
  if (panzoomInstance && panzoomWrapperRef.value) {
    panzoomWrapperRef.value.removeEventListener(
      'wheel',
      panzoomInstance.zoomWithWheel
    )
    panzoomInstance.destroy()
    panzoomInstance = null
  }
})
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

.image-card {
  border: 1px solid var(--surface-card-border);
  background: var(--surface-card-bg);
}

.image-card:hover {
  border-color: var(--header-btn-border-hover);
}

.image-card-text {
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

.zoom-btn {
  background: var(--button-soft-bg);
  color: var(--button-soft-text);
}

.zoom-btn:hover {
  background: var(--button-soft-hover);
}

.zoom-close-btn {
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
}

.zoom-close-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.zoom-caption {
  background: rgba(15, 23, 42, 0.9);
}

.zoom-caption-text {
  color: #e2e8f0;
}
</style>