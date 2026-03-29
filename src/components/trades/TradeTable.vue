<template>
    <div class="surface-table overflow-hidden rounded-2xl shadow-xl">
        <div class="overflow-x-auto">
            <table class="w-full min-w-[1180px] text-sm">
                <thead class="surface-table-head">
                    <tr>
                        <th class="p-4 text-left">
                            <button type="button" class="sort-button inline-flex items-center gap-2 font-medium"
                                @click="$emit('sort', 'entry_date')">
                                <span>Date</span>
                                <span class="text-xs">{{ getSortIcon('entry_date') }}</span>
                            </button>
                        </th>

                        <th class="p-4 text-left">Asset</th>
                        <th class="p-4 text-left">Account</th>
                        <th class="p-4 text-left">Strategy</th>
                        <th class="p-4 text-left">Position</th>
                        <th class="p-4 text-left">Entry</th>
                        <th class="p-4 text-left">Qty</th>
                        <th class="p-4 text-left">Status</th>

                        <th class="p-4 text-left">
                            <button type="button" class="sort-button inline-flex items-center gap-2 font-medium"
                                @click="$emit('sort', 'exit_date')">
                                <span>Exit</span>
                                <span class="text-xs">{{ getSortIcon('exit_date') }}</span>
                            </button>
                        </th>

                        <th class="p-4 text-left">
                            <button type="button" class="sort-button inline-flex items-center gap-2 font-medium"
                                @click="$emit('sort', 'profit_loss')">
                                <span>PnL</span>
                                <span class="text-xs">{{ getSortIcon('profit_loss') }}</span>
                            </button>
                        </th>

                        <th class="p-4 text-left">R</th>
                        <th class="p-4 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in items" :key="item.id" class="surface-table-row">
                        <td class="p-4 page-body">
                            {{ formatDate(item.entry_date) }}
                        </td>

                        <td class="p-4">
                            <div class="flex items-center gap-2">
                                <span class="page-title font-medium">
                                    {{ item.asset?.symbol || '-' }}
                                </span>

                                <span v-if="item.position_type === 'investment'"
                                    class="rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300">
                                    INVEST
                                </span>

                                <span v-if="isGeneratedPartial(item)"
                                    class="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">
                                    PARTIAL EXIT
                                </span>

                                <span v-if="isInvestmentCloseRecord(item)"
                                    class="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300">
                                    INVESTMENT SELL
                                </span>
                            </div>
                        </td>

                        <td class="p-4 page-body">
                            {{ item.account?.name || '-' }}
                        </td>

                        <td class="p-4 page-body">
                            {{ item.strategy?.name || '-' }}
                        </td>

                        <td class="p-4 page-body">
                            {{ formatPosition(item.position_type) }}
                        </td>

                        <td class="p-4 page-body">
                            {{ formatNumber(item.entry_price) }}
                        </td>

                        <td class="p-4">
                            <div class="space-y-1 text-xs">
                                <template v-if="isInvestmentCloseRecord(item)">
                                    <div class="page-body font-medium">
                                        Sold: {{ formatQty(getTotalQty(item)) }}
                                    </div>
                                </template>

                                <template v-else-if="item.position_type === 'investment'">
                                    <div class="page-body font-medium">
                                        Total: {{ formatQty(getTotalQty(item)) }}
                                    </div>
                                </template>

                                <template v-else>
                                    <div class="page-body font-medium">
                                        Total: {{ formatQty(getTotalQty(item)) }}
                                    </div>

                                    <div v-if="showClosedInfo(item)" class="text-amber-300">
                                        Closed: {{ formatQty(getClosedQty(item)) }}
                                    </div>

                                    <div v-if="showRemainingInfo(item)" class="text-emerald-300">
                                        Remaining: {{ formatQty(getRemainingQty(item)) }}
                                    </div>
                                </template>
                            </div>
                        </td>

                        <td class="p-4">
                            <span class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium"
                                :class="statusBadgeClass(getDisplayStatus(item))">
                                {{ formatStatus(getDisplayStatus(item)) }}
                            </span>
                        </td>

                        <td class="p-4 page-body">
                            {{ item.exit_date ? formatDate(item.exit_date) : '-' }}
                        </td>

                        <td class="p-4 font-medium" :class="pnlClass(item)">
                            {{ pnlDisplay(item) }}
                        </td>

                        <td class="p-4 page-body">
                            {{ rDisplay(item) }}
                        </td>

                        <td class="p-4">
                            <div class="flex justify-end gap-2">
                                <button class="btn-soft rounded-xl px-3 py-2 text-sm font-medium"
                                    @click="$emit('view', item.id)">
                                    View
                                </button>

                                <button v-if="canEdit(item)"
                                    class="btn-outline rounded-xl px-3 py-1.5 text-sm font-medium transition"
                                    @click="$emit('edit', item.id)">
                                    Manage
                                </button>

                                <button
                                    class="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                                    @click="$emit('delete', item.id)">
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="!items.length">
                        <td colspan="12" class="p-8 text-center page-subtitle">
                            No trades found.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    items: {
        type: Array,
        default: () => [],
    },
    sortBy: {
        type: String,
        default: 'entry_date',
    },
    sortDirection: {
        type: String,
        default: 'desc',
    },
})

defineEmits(['view', 'edit', 'delete', 'sort'])

const EPSILON = 0.00000001

function getSortIcon(column) {
    if (props.sortBy !== column) return '~'
    return props.sortDirection === 'asc' ? '^' : 'v'
}

function formatDate(value) {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('id-ID')
}

function formatNumber(value) {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
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
    if (!value) return 'Open'
    if (value === 'open') return 'Open'
    if (value === 'partial') return 'Partial'
    if (value === 'closed') return 'Closed'
    return value
}

function statusBadgeClass(value) {
    if (value === 'open') {
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
    }

    if (value === 'partial') {
        return 'border-amber-500/30 bg-amber-500/10 text-amber-300'
    }

    if (value === 'closed') {
        return 'badge-neutral'
    }

    return 'badge-neutral'
}

function getClosedQty(item) {
    return Number(item?.closed_quantity || 0)
}

function getTotalQty(item) {
    return Number(item?.quantity || 0)
}

function isInvestmentCloseRecord(item) {
    return item?.position_type === 'investment' && item?.status === 'closed'
}

function getRemainingQty(item) {
    if (isInvestmentCloseRecord(item)) {
        return 0
    }

    const totalQty = getTotalQty(item)
    const closedQty = getClosedQty(item)

    const remaining = totalQty - closedQty
    return remaining > EPSILON ? remaining : 0
}

function getDisplayStatus(item) {
    const status = item?.status
    const totalQty = getTotalQty(item)
    const closedQty = getClosedQty(item)

    if (isInvestmentCloseRecord(item)) return 'closed'
    if (status === 'closed') return 'closed'
    if (closedQty >= totalQty - EPSILON && totalQty > 0) return 'closed'
    if (closedQty > EPSILON && closedQty < totalQty - EPSILON) return 'partial'

    return 'open'
}

function isGeneratedPartial(item) {
    const isClosed = getDisplayStatus(item) === 'closed'
    const closedQty = getClosedQty(item)
    const totalQty = getTotalQty(item)
    const hasExit = !!item?.exit_date
    const hasPnl = item?.profit_loss !== null && item?.profit_loss !== undefined

    return (
        item?.position_type !== 'investment' &&
        isClosed &&
        closedQty > 0 &&
        closedQty >= totalQty - EPSILON &&
        hasExit &&
        hasPnl &&
        typeof item?.notes === 'string' &&
        item.notes.startsWith('Generated from partial close')
    )
}

function showClosedInfo(item) {
    if (item?.position_type === 'investment') return false
    return getClosedQty(item) > EPSILON
}

function showRemainingInfo(item) {
    if (item?.position_type === 'investment') return false
    return getDisplayStatus(item) !== 'closed' && getRemainingQty(item) > EPSILON
}

function pnlDisplay(item) {
    const currency = item.account?.currency || item.display_currency || 'IDR'

    if (item.profit_loss === null || item.profit_loss === undefined) {
        return '-'
    }

    return displayMoney(item.profit_loss, currency)
}

function pnlClass(item) {
    if (item.profit_loss === null || item.profit_loss === undefined) {
        return 'page-subtitle'
    }

    return Number(item.profit_loss || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
}

function rDisplay(item) {
    if (item.r_multiple === null || item.r_multiple === undefined) return '-'
    return item.r_multiple
}

function canEdit(item) {
    if (item.position_type === 'investment') return false
    return true
}
</script>

<style scoped>
.surface-table {
    border: 1px solid var(--surface-table-border);
    background: var(--surface-table-bg);
}

.surface-table-head {
    border-bottom: 1px solid var(--surface-table-border);
    background: var(--surface-table-head-bg);
    color: var(--surface-table-head-text);
}

.surface-table-row {
    border-bottom: 1px solid var(--surface-table-row-border);
}

.surface-table-row:hover {
    background: var(--surface-table-row-hover);
}

.sort-button {
    color: inherit;
}

.sort-button:hover {
    color: var(--text-title);
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

.badge-neutral {
    border-color: var(--badge-neutral-border);
    background: var(--badge-neutral-bg);
    color: var(--badge-neutral-text);
}
</style>