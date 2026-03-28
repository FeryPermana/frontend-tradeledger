<template>
    <div class="space-y-3">
        <div v-for="item in items" :key="item.id" class="surface-card rounded-2xl p-4 shadow-xl">
            <div class="space-y-3">
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                            <p class="page-title text-base font-semibold">
                                {{ item.asset?.symbol || '-' }}
                            </p>

                            <span v-if="item.position_type === 'investment'" class="badge-purple">
                                INVEST
                            </span>

                            <span v-if="isGeneratedPartial(item)" class="badge-amber">
                                PARTIAL EXIT
                            </span>

                            <span v-if="isInvestmentCloseRecord(item)" class="badge-cyan">
                                INVESTMENT SELL
                            </span>
                        </div>

                        <p class="page-body mt-1 text-sm">
                            {{ item.strategy?.name || '-' }} • {{ formatPosition(item.position_type) }}
                        </p>

                        <p class="page-subtitle mt-1 text-sm">
                            {{ formatDate(item.entry_date) }}
                        </p>
                    </div>

                    <div class="text-right">
                        <p class="text-sm font-semibold" :class="pnlClass(item)">
                            {{ pnlDisplay(item) }}
                        </p>

                        <div class="mt-2">
                            <span class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium"
                                :class="statusBadgeClass(getDisplayStatus(item))">
                                {{ formatStatus(getDisplayStatus(item)) }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="surface-soft rounded-xl p-3">
                        <p class="page-caption text-xs">Entry</p>
                        <p class="page-title mt-1 text-sm font-medium">
                            {{ formatNumber(item.entry_price) }}
                        </p>
                    </div>

                    <div class="surface-soft rounded-xl p-3">
                        <p class="page-caption text-xs">Exit</p>
                        <p class="page-title mt-1 text-sm font-medium">
                            {{ item.exit_price ? formatNumber(item.exit_price) : '-' }}
                        </p>
                    </div>

                    <div class="surface-soft rounded-xl p-3">
                        <p class="page-caption text-xs">Account</p>
                        <p class="page-title mt-1 text-sm font-medium">
                            {{ item.account?.name || '-' }}
                        </p>
                    </div>

                    <div class="surface-soft rounded-xl p-3">
                        <p class="page-caption text-xs">R</p>
                        <p class="page-title mt-1 text-sm font-medium">
                            {{ rDisplay(item) }}
                        </p>
                    </div>
                </div>

                <div v-if="isInvestmentCloseRecord(item)" class="grid grid-cols-1 gap-3">
                    <div class="surface-soft rounded-xl p-3">
                        <p class="page-caption text-xs">Sold</p>
                        <p class="page-title mt-1 text-sm font-medium">
                            {{ formatQty(getTotalQty(item)) }}
                        </p>
                    </div>
                </div>

                <div v-else-if="item.position_type === 'investment'" class="grid grid-cols-1 gap-3">
                    <div class="surface-soft rounded-xl p-3">
                        <p class="page-caption text-xs">Total</p>
                        <p class="page-title mt-1 text-sm font-medium">
                            {{ formatQty(getTotalQty(item)) }}
                        </p>
                    </div>
                </div>

                <div v-else class="grid grid-cols-3 gap-3">
                    <div class="surface-soft rounded-xl p-3">
                        <p class="page-caption text-xs">Total</p>
                        <p class="page-title mt-1 text-sm font-medium">
                            {{ formatQty(getTotalQty(item)) }}
                        </p>
                    </div>

                    <div class="surface-soft rounded-xl p-3">
                        <p class="page-caption text-xs">Closed</p>
                        <p class="mt-1 text-sm font-medium text-amber-300">
                            {{ formatQty(getClosedQty(item)) }}
                        </p>
                    </div>

                    <div class="surface-soft rounded-xl p-3">
                        <p class="page-caption text-xs">Remaining</p>
                        <p class="mt-1 text-sm font-medium text-emerald-300">
                            {{ formatQty(getRemainingQty(item)) }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-4 grid gap-2" :class="item.position_type === 'investment' ? 'grid-cols-2' : 'grid-cols-3'">
                <button class="btn-soft rounded-xl px-3 py-2 text-sm font-medium" @click="$emit('view', item.id)">
                    View
                </button>

                <button v-if="canEdit(item)" class="btn-outline rounded-xl px-3 py-2 text-sm font-medium"
                    @click="$emit('edit', item.id)">
                    Manage
                </button>

                <button class="btn-danger rounded-xl px-3 py-2 text-sm font-medium" @click="$emit('delete', item.id)">
                    Delete
                </button>
            </div>

            <div v-if="item.position_type === 'investment' && !isInvestmentCloseRecord(item)"
                class="surface-soft page-subtitle mt-3 rounded-xl px-3 py-2 text-xs">
                Investment positions are managed from Portfolio.
            </div>

            <div v-if="isInvestmentCloseRecord(item)"
                class="surface-soft page-subtitle mt-3 rounded-xl px-3 py-2 text-xs">
                This is a realized sell record from Portfolio.
            </div>
        </div>

        <div v-if="!items.length" class="surface-card rounded-2xl p-6 text-center page-subtitle">
            No trades found.
        </div>
    </div>
</template>

<script setup>
defineProps({
    items: {
        type: Array,
        default: () => [],
    },
})

defineEmits(['view', 'edit', 'delete'])

function formatDate(value) {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('id-ID')
}

function formatNumber(value) {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value || 0))
}

function formatQty(value) {
    if (value === null || value === undefined || value === '') return '-'
    return Number(value)
}

function displayMoney(value, currency = 'IDR') {
    if (value === null || value === undefined || value === '') return '-'

    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'id-ID', {
        style: 'currency',
        currency,
        maximumFractionDigits: currency === 'IDR' ? 0 : 2,
    }).format(Number(value))
}

function formatPosition(value) {
    if (value === 'intra_day') return 'Intra Day'
    if (!value) return '-'
    return value.charAt(0).toUpperCase() + value.slice(1)
}

function formatStatus(value) {
    if (value === 'open') return 'Open'
    if (value === 'partial') return 'Partial'
    if (value === 'closed') return 'Closed'
    return value || 'Open'
}

function statusBadgeClass(value) {
    if (value === 'open') return 'badge-green'
    if (value === 'partial') return 'badge-amber'
    if (value === 'closed') return 'badge-neutral'
    return 'badge-neutral'
}

function getTotalQty(item) {
    return Number(item.quantity || 0)
}

function getClosedQty(item) {
    return Number(item.closed_quantity || 0)
}

function getRemainingQty(item) {
    if (isInvestmentCloseRecord(item)) {
        return 0
    }

    if (item.remaining_quantity !== undefined && item.remaining_quantity !== null) {
        return Number(item.remaining_quantity)
    }

    return Math.max(0, getTotalQty(item) - getClosedQty(item))
}

function getDisplayStatus(item) {
    if (isInvestmentCloseRecord(item)) return 'closed'
    if (item.status === 'closed') return 'closed'

    if (getClosedQty(item) > 0 && getRemainingQty(item) > 0) {
        return 'partial'
    }

    if (getClosedQty(item) >= getTotalQty(item) && getTotalQty(item) > 0) {
        return 'closed'
    }

    return item.status || 'open'
}

function pnlDisplay(item) {
    if (item.profit_loss === null || item.profit_loss === undefined) return '-'

    return displayMoney(
        item.profit_loss,
        item.account?.currency || item.display_currency || 'IDR'
    )
}

function pnlClass(item) {
    if (item.profit_loss === null || item.profit_loss === undefined) return 'page-subtitle'

    return Number(item.profit_loss) >= 0
        ? 'text-emerald-400'
        : 'text-red-400'
}

function rDisplay(item) {
    if (item.r_multiple === null || item.r_multiple === undefined) return '-'
    return item.r_multiple
}

function isGeneratedPartial(item) {
    return (
        item.position_type !== 'investment' &&
        item.status === 'closed' &&
        typeof item.notes === 'string' &&
        item.notes.startsWith('Generated from partial close')
    )
}

function isInvestmentCloseRecord(item) {
    return item?.position_type === 'investment' && item?.status === 'closed'
}

function canEdit(item) {
    return item.position_type !== 'investment'
}
</script>

<style scoped>
.surface-card {
    border: 1px solid var(--surface-card-border);
    background: var(--surface-card-bg);
}

.surface-soft {
    border: 1px solid var(--surface-soft-border);
    background: var(--surface-soft-bg);
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

.badge-green {
    border: 1px solid rgba(16, 185, 129, 0.3);
    background: rgba(16, 185, 129, 0.1);
    color: #6ee7b7;
}

.badge-amber {
    border: 1px solid rgba(251, 191, 36, 0.3);
    background: rgba(251, 191, 36, 0.1);
    color: #fcd34d;
}

.badge-purple {
    border: 1px solid rgba(168, 85, 247, 0.3);
    background: rgba(168, 85, 247, 0.1);
    color: #d8b4fe;
}

.badge-cyan {
    border: 1px solid rgba(34, 211, 238, 0.3);
    background: rgba(34, 211, 238, 0.1);
    color: #67e8f9;
}

.badge-neutral {
    border: 1px solid var(--badge-neutral-border);
    background: var(--badge-neutral-bg);
    color: var(--badge-neutral-text);
}

.btn-soft {
    background: var(--button-soft-bg);
    color: var(--button-soft-text);
}

.btn-soft:hover {
    background: var(--button-soft-hover);
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

.btn-danger {
    border: 1px solid rgba(239, 68, 68, 0.3);
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
}

.btn-danger:hover {
    background: rgba(239, 68, 68, 0.2);
}
</style>