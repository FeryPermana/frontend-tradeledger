<template>
    <div v-if="open" class="fixed inset-0 z-50 bg-black/60 px-4 py-4 sm:px-6">
        <div class="flex min-h-full items-center justify-center">
            <div class="modal-panel flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl shadow-2xl">
                <div class="modal-header flex items-center justify-between px-5 py-4 sm:px-6">
                    <h3 class="modal-title text-lg font-semibold sm:text-xl">
                        {{ modalTitle }}
                    </h3>

                    <button type="button" class="modal-close rounded-xl px-3 py-2 text-sm transition"
                        @click="$emit('close')">
                        ✕
                    </button>
                </div>

                <div class="modal-body overflow-y-auto px-5 py-5 sm:px-6">
                    <div v-if="isTradeSync" class="alert-info mb-4 rounded-2xl px-4 py-3 text-sm">
                        This investment position is synced from trades.
                        Core values like quantity, average price, asset, account, and fees are locked.
                        Use Portfolio → Partial Close to reduce the position.
                    </div>

                    <form class="space-y-4" @submit.prevent="handleSubmit">
                        <template v-if="!isTradeSync">
                            <BaseSelect v-model="form.account_id" label="Account *" placeholder="Select account"
                                :options="accountOptions" :error="errors.account_id" />

                            <SearchSelect v-model="form.asset_id" label="Asset *" placeholder="Search asset"
                                empty-label="Clear selection" :options="assetOptions" :disabled="isEdit"
                                :error="errors.asset_id" />

                            <BaseInput v-model="form.quantity" label="Quantity *" type="number" placeholder="1234.56"
                                :error="errors.quantity" />

                            <BaseInput v-model="form.avg_price" label="Average Price *" type="number" placeholder="1234.56"
                                :error="errors.avg_price" />

                            <BaseInput v-model="form.total_fees" label="Total Fees" type="number" placeholder="1234.56"
                                :error="errors.total_fees" />
                        </template>

                        <template v-else>
                            <div class="grid gap-3 sm:grid-cols-2">
                                <div class="surface-soft rounded-2xl p-4">
                                    <p class="page-subtitle text-sm">Account</p>
                                    <p class="page-title mt-2 break-words text-lg font-semibold">
                                        {{ props.position?.account?.name || '-' }}
                                    </p>
                                </div>

                                <div class="surface-soft rounded-2xl p-4">
                                    <p class="page-subtitle text-sm">Asset</p>
                                    <p class="page-title mt-2 break-words text-lg font-semibold">
                                        {{ assetLabel }}
                                    </p>
                                </div>
                            </div>

                            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                <div class="surface-soft rounded-2xl p-4">
                                    <p class="page-subtitle text-sm">Quantity</p>
                                    <p class="page-title mt-2 text-lg font-semibold">
                                        {{ formatQty(props.position?.quantity) }}
                                    </p>
                                </div>

                                <div class="surface-soft rounded-2xl p-4">
                                    <p class="page-subtitle text-sm">Average Price</p>
                                    <p class="page-title mt-2 break-words text-lg font-semibold">
                                        {{ formatMoney(props.position?.avg_price, props.position?.account?.currency ||
                                            'IDR') }}
                                    </p>
                                </div>

                                <div class="surface-soft rounded-2xl p-4 sm:col-span-2 xl:col-span-1">
                                    <p class="page-subtitle text-sm">Total Fees</p>
                                    <p class="page-title mt-2 break-words text-lg font-semibold">
                                        {{ formatMoney(props.position?.total_fees, props.position?.account?.currency ||
                                            'IDR') }}
                                    </p>
                                </div>
                            </div>
                        </template>

                        <BaseInput v-model="form.target_price" label="Target Price" type="number" placeholder="1234.56"
                            :error="errors.target_price" />

                        <BaseSelect v-model="form.horizon" label="Horizon" placeholder="Select horizon"
                            :options="horizonOptions" :error="errors.horizon" />

                        <BaseSelect v-model="form.conviction_level" label="Conviction" placeholder="Select conviction"
                            :options="convictionOptions" :error="errors.conviction_level" />

                        <BaseTextarea v-model="form.thesis" label="Thesis"
                            placeholder="Why are you holding this position?" :error="errors.thesis" />

                        <BaseTextarea v-model="form.notes" label="Notes" placeholder="Additional notes..."
                            :error="errors.notes" />

                        <template v-if="showCashSection">
                            <div class="grid gap-3 sm:grid-cols-2">
                                <div class="surface-soft rounded-2xl p-4">
                                    <p class="page-subtitle text-sm">Available Cash</p>
                                    <p class="page-title mt-2 break-words text-lg font-semibold">
                                        {{ availableCashDisplay }}
                                    </p>
                                </div>

                                <div class="surface-soft rounded-2xl p-4">
                                    <p class="page-subtitle text-sm">Required Cash</p>
                                    <p class="page-title mt-2 break-words text-lg font-semibold">
                                        {{ requiredCashDisplay }}
                                    </p>
                                </div>
                            </div>

                            <div v-if="insufficientCash" class="alert-error rounded-2xl px-4 py-3 text-sm">
                                Account cash is insufficient for this portfolio position.
                            </div>
                        </template>

                        <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                            <BaseButton type="button" variant="secondary" class="w-full sm:w-auto"
                                @click="$emit('close')">
                                Cancel
                            </BaseButton>

                            <BaseButton type="submit" class="w-full sm:w-auto" :loading="loading">
                                {{ submitLabel }}
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
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import SearchSelect from '@/components/common/SearchSelect.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'
import { useAssetStore } from '@/stores/asset.store'
import { useAccountStore } from '@/stores/account.store'
import { toastService } from '@/utils/toast'
import { formatCurrency } from '@/utils/formatters'
import { fetchAccountAvailableBalance } from '@/api/account.api'

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

const assetStore = useAssetStore()
const accountStore = useAccountStore()
const accountBalanceInfo = ref(null)

const isEdit = computed(() => !!props.position?.id)
const isTradeSync = computed(() => props.position?.source_type === 'trade_sync')

const modalTitle = computed(() => {
    if (isTradeSync.value) return 'Edit Investment Metadata'
    return isEdit.value ? 'Edit Position' : 'Add Position'
})

const submitLabel = computed(() => {
    if (isTradeSync.value) return 'Save Metadata'
    return isEdit.value ? 'Update Position' : 'Save Position'
})

const assetLabel = computed(() => {
    const symbol = props.position?.asset?.symbol || '-'
    const name = props.position?.asset?.name || ''
    return name ? `${symbol} - ${name}` : symbol
})

const showCashSection = computed(() => !isTradeSync.value && !isEdit.value)

const form = reactive({
    account_id: '',
    asset_id: '',
    quantity: '',
    avg_price: '',
    total_fees: '',
    target_price: '',
    horizon: '',
    conviction_level: '',
    thesis: '',
    notes: '',
})

const errors = reactive({
    account_id: '',
    asset_id: '',
    quantity: '',
    avg_price: '',
    total_fees: '',
    target_price: '',
    horizon: '',
    conviction_level: '',
    thesis: '',
    notes: '',
})

const assetOptions = computed(() =>
    assetStore.items.map((item) => ({
        value: item.id,
        label: `${item.symbol} - ${item.name}`,
    }))
)

const accountOptions = computed(() =>
    accountStore.items.map((item) => ({
        value: item.id,
        label: `${item.name} (${item.currency})`,
    }))
)

const selectedAccount = computed(() =>
    accountStore.items.find((item) => String(item.id) === String(form.account_id))
)

const selectedAccountCurrency = computed(() =>
    selectedAccount.value?.currency || props.position?.account?.currency || 'IDR'
)

const quantityNum = computed(() => Number(form.quantity || 0))
const avgPriceNum = computed(() => Number(form.avg_price || 0))
const totalFeesNum = computed(() => Number(form.total_fees || 0))

const requiredCash = computed(() => {
    if (!quantityNum.value || !avgPriceNum.value) return 0
    return (quantityNum.value * avgPriceNum.value) + totalFeesNum.value
})

const availableCashDisplay = computed(() =>
    formatCurrency(accountBalanceInfo.value?.available_balance || 0, selectedAccountCurrency.value)
)

const requiredCashDisplay = computed(() =>
    formatCurrency(requiredCash.value, selectedAccountCurrency.value)
)

const insufficientCash = computed(() => {
    if (!showCashSection.value) return false
    return requiredCash.value > Number(accountBalanceInfo.value?.available_balance || 0)
})

const horizonOptions = [
    { value: 'short_term', label: 'Short Term' },
    { value: 'medium_term', label: 'Medium Term' },
    { value: 'long_term', label: 'Long Term' },
]

const convictionOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
]

onMounted(async () => {
    if (!assetStore.items.length) {
        await assetStore.getAll()
    }

    if (!accountStore.items.length) {
        await accountStore.getAll()
    }
})

watch(
    () => props.position,
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
    () => form.account_id,
    async (accountId) => {
        if (!accountId || !showCashSection.value) {
            accountBalanceInfo.value = null
            return
        }

        try {
            const res = await fetchAccountAvailableBalance(accountId)
            accountBalanceInfo.value = res.data?.data ?? null
        } catch {
            accountBalanceInfo.value = null
        }
    },
    { immediate: true }
)

function resetForm() {
    form.account_id = props.position?.account_id ?? ''
    form.asset_id = props.position?.asset_id ?? ''
    form.quantity = props.position?.quantity ?? ''
    form.avg_price = props.position?.avg_price ?? ''
    form.total_fees = props.position?.total_fees ?? ''
    form.target_price = props.position?.target_price ?? ''
    form.horizon = props.position?.horizon ?? ''
    form.conviction_level = props.position?.conviction_level ?? ''
    form.thesis = props.position?.thesis ?? ''
    form.notes = props.position?.notes ?? ''
}

function resetErrors() {
    errors.account_id = ''
    errors.asset_id = ''
    errors.quantity = ''
    errors.avg_price = ''
    errors.total_fees = ''
    errors.target_price = ''
    errors.horizon = ''
    errors.conviction_level = ''
    errors.thesis = ''
    errors.notes = ''
}

function handleSubmit() {
    resetErrors()

    if (!isTradeSync.value) {
        if (!form.account_id) errors.account_id = 'Account is required.'
        if (!form.asset_id && !isEdit.value) errors.asset_id = 'Asset is required.'
        if (!form.quantity) errors.quantity = 'Quantity is required.'
        if (!form.avg_price) errors.avg_price = 'Average price is required.'

        if (showCashSection.value && insufficientCash.value) {
            toastService.error('Account cash is insufficient.')
            return
        }

        if (errors.account_id || errors.asset_id || errors.quantity || errors.avg_price) {
            toastService.error('Please complete the form correctly.')
            return
        }

        emit('submit', {
            account_id: Number(form.account_id),
            asset_id: isEdit.value ? props.position.asset_id : Number(form.asset_id),
            quantity: Number(form.quantity),
            avg_price: Number(form.avg_price),
            total_fees: form.total_fees === '' ? 0 : Number(form.total_fees),
            target_price: form.target_price === '' ? null : Number(form.target_price),
            horizon: form.horizon || null,
            conviction_level: form.conviction_level || null,
            thesis: form.thesis || null,
            notes: form.notes || null,
        })

        return
    }

    emit('submit', {
        target_price: form.target_price === '' ? null : Number(form.target_price),
        horizon: form.horizon || null,
        conviction_level: form.conviction_level || null,
        thesis: form.thesis || null,
        notes: form.notes || null,
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
</script>

<style scoped>
.modal-panel {
    border: 1px solid var(--modal-border);
    background: var(--modal-bg);
}

.modal-header {
    border-bottom: 1px solid var(--modal-border);
    flex-shrink: 0;
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

.page-title {
    color: var(--text-title);
}

.page-subtitle {
    color: var(--text-muted);
}

.alert-info {
    border: 1px solid var(--alert-info-border);
    background: var(--alert-info-bg);
    color: var(--alert-info-text);
}

.alert-error {
    border: 1px solid rgba(239, 68, 68, 0.3);
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
}
</style>