<template>
    <div class="surface-table overflow-hidden rounded-2xl shadow-xl">
        <div class="overflow-x-auto">
            <table class="w-full min-w-[1100px] text-sm">
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
                            <span class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium"
                                :class="statusBadgeClass(item.status)">
                                {{ formatStatus(item.status) }}
                            </span>
                        </td>

                        <td class="p-4 page-body">
                            {{ item.exit_date ? formatDate(item.exit_date) : '-' }}
                        </td>

                        <td class="p-4 font-medium"
                            :class="Number(item.profit_loss || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'">
                            {{
                                item.profit_loss !== null
                                    ? displayMoney(
                                        item.profit_loss,
                                        item.account?.currency || item.display_currency || 'IDR'
                                    )
                            : '-'
                            }}
                        </td>

                        <td class="p-4 page-body">
                            {{ item.r_multiple !== null ? item.r_multiple : '-' }}
                        </td>

                        <td class="p-4">
                            <div class="flex justify-end gap-2">
                                <button class="btn-soft rounded-xl px-3 py-2 text-sm font-medium"
                                    @click="$emit('view', item.id)">
                                    View
                                </button>

                                <button v-if="item.position_type !== 'investment'"
                                    class="btn-outline rounded-xl px-3 py-1.5 text-sm font-medium transition"
                                    @click="$emit('edit', item.id)">
                                    Edit
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
                        <td colspan="11" class="p-8 text-center page-subtitle">
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
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value || 0))
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