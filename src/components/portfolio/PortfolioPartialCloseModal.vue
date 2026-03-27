<template>
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div
            class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div class="mb-6 flex items-center justify-between">
                <h3 class="text-xl font-semibold text-white">Partial Close Position</h3>

                <button class="text-slate-400 hover:text-white" @click="$emit('close')">
                    ✕
                </button>
            </div>

            <div class="mb-4 rounded-2xl border border-amber-700 bg-amber-950/30 px-4 py-3 text-sm text-amber-300">
                This action will reduce your investment position.
                Exit fee will be deducted from realized PnL.
            </div>

            <div v-if="position" class="mb-4 grid gap-3">
                <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p class="text-sm text-slate-400">Asset</p>
                    <p class="mt-2 text-lg font-semibold text-white">
                        {{ assetLabel }}
                    </p>
                </div>

                <div class="grid gap-3 md:grid-cols-2">
                    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <p class="text-sm text-slate-400">Current Quantity</p>
                        <p class="mt-2 text-lg font-semibold text-white">
                            {{ formatQty(position.quantity) }}
                        </p>
                    </div>

                    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <p class="text-sm text-slate-400">Average Price</p>
                        <p class="mt-2 text-lg font-semibold text-white">
                            {{ formatMoney(position.avg_price, position.account?.currency || 'IDR') }}
                        </p>
                    </div>
                </div>
            </div>

            <form class="space-y-4" @submit.prevent="handleSubmit">
                <BaseInput v-model="form.quantity" label="Quantity to Close *" type="number" placeholder="Use dot (.) for decimals. Do not use thousand separators."
                    :error="errors.quantity" />

                <BaseInput v-model="form.exit_price" label="Exit Price *" type="number" placeholder="Use dot (.) for decimals. Do not use thousand separators."
                    :error="errors.exit_price" />

                <BaseInput v-model="form.exit_fee" label="Exit Fee" type="number" placeholder="Use dot (.) for decimals. Do not use thousand separators."
                    :error="errors.exit_fee" />

                <BaseInput v-model="form.exit_date" label="Exit Date *" type="datetime-local"
                    :error="errors.exit_date" />

                <div class="grid gap-3 md:grid-cols-2">
                    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <p class="text-sm text-slate-400">Estimated Proceeds</p>
                        <p class="mt-2 text-lg font-semibold text-white">
                            {{ estimatedProceedsDisplay }}
                        </p>
                    </div>

                    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <p class="text-sm text-slate-400">Estimated Realized PnL</p>
                        <p class="mt-2 text-lg font-semibold"
                            :class="estimatedPnl >= 0 ? 'text-green-400' : 'text-red-400'">
                            {{ estimatedPnlDisplay }}
                        </p>
                    </div>
                </div>

                <div v-if="quantityExceeded"
                    class="rounded-2xl border border-red-700 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                    Quantity to close exceeds current position.
                </div>

                <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                    <BaseButton type="button" variant="secondary" class="w-full sm:w-auto" @click="$emit('close')">
                        Cancel
                    </BaseButton>

                    <BaseButton type="submit" class="w-full sm:w-auto" :loading="loading">
                        Confirm Partial Close
                    </BaseButton>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { toastService } from '@/utils/toast'

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    position: {
        type: Object,
        default: null,
    },
    loading: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
    quantity: '',
    exit_price: '',
    exit_fee: '',
    exit_date: '',
})

const errors = reactive({
    quantity: '',
    exit_price: '',
    exit_fee: '',
    exit_date: '',
})

const quantityNum = computed(() => Number(form.quantity || 0))
const exitPriceNum = computed(() => Number(form.exit_price || 0))
const exitFeeNum = computed(() => Number(form.exit_fee || 0))
const currentQtyNum = computed(() => Number(props.position?.quantity || 0))
const avgPriceNum = computed(() => Number(props.position?.avg_price || 0))

const assetLabel = computed(() => {
    const symbol = props.position?.asset?.symbol || '-'
    const name = props.position?.asset?.name || ''
    return name ? `${symbol} - ${name}` : symbol
})

const quantityExceeded = computed(() => {
    if (!quantityNum.value) return false
    return quantityNum.value > currentQtyNum.value
})

const estimatedProceeds = computed(() => {
    if (!quantityNum.value || !exitPriceNum.value) return 0
    return (quantityNum.value * exitPriceNum.value) - exitFeeNum.value
})

const estimatedPnl = computed(() => {
    if (!quantityNum.value || !exitPriceNum.value) return 0
    return ((exitPriceNum.value - avgPriceNum.value) * quantityNum.value) - exitFeeNum.value
})

const estimatedProceedsDisplay = computed(() =>
    formatMoney(estimatedProceeds.value, props.position?.account?.currency || 'IDR')
)

const estimatedPnlDisplay = computed(() =>
    formatMoney(estimatedPnl.value, props.position?.account?.currency || 'IDR')
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
    () => props.position,
    () => {
        resetForm()
        resetErrors()
    }
)

function resetForm() {
    form.quantity = ''
    form.exit_price = ''
    form.exit_fee = ''
    form.exit_date = toDateTimeLocal(new Date())
}

function resetErrors() {
    errors.quantity = ''
    errors.exit_price = ''
    errors.exit_fee = ''
    errors.exit_date = ''
}

function handleSubmit() {
    resetErrors()

    if (!form.quantity) errors.quantity = 'Quantity is required.'
    if (!form.exit_price) errors.exit_price = 'Exit price is required.'
    if (!form.exit_date) errors.exit_date = 'Exit date is required.'

    if (quantityNum.value <= 0) {
        errors.quantity = 'Quantity must be greater than zero.'
    }

    if (exitPriceNum.value <= 0) {
        errors.exit_price = 'Exit price must be greater than zero.'
    }

    if (exitFeeNum.value < 0) {
        errors.exit_fee = 'Exit fee cannot be negative.'
    }

    if (quantityExceeded.value) {
        errors.quantity = 'Quantity exceeds active position.'
    }

    if (
        errors.quantity ||
        errors.exit_price ||
        errors.exit_fee ||
        errors.exit_date
    ) {
        toastService.error('Please complete the form correctly.')
        return
    }

    emit('submit', {
        quantity: Number(form.quantity),
        exit_price: Number(form.exit_price),
        exit_fee: form.exit_fee === '' ? 0 : Number(form.exit_fee),
        exit_date: formatForBackend(form.exit_date),
    })
}

function formatMoney(value, currency = 'IDR') {
    if (value === null || value === undefined || value === '') return '-'

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
    }).format(Number(value))
}

function formatQty(value) {
    if (value === null || value === undefined || value === '') return '-'

    return new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 8,
    }).format(Number(value))
}

function toDateTimeLocal(value) {
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
</script>