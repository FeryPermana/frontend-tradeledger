<template>
    <div class="surface-table overflow-hidden rounded-2xl shadow-xl">
        <div class="overflow-x-auto">
            <table class="w-full min-w-[1100px] text-sm">
                <thead class="surface-table-head">
                    <tr>
                        <th class="p-4 text-left">Asset</th>
                        <th class="p-4 text-left">Account</th>
                        <th class="p-4 text-left">Qty</th>
                        <th class="p-4 text-left">Avg Price</th>
                        <th class="p-4 text-left">Current Price</th>
                        <th class="p-4 text-left">Fees</th>
                        <th class="p-4 text-left">Current Value</th>
                        <th class="p-4 text-left">PnL</th>
                        <th class="p-4 text-left">Conviction</th>
                        <th class="p-4 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in items" :key="item.id" class="surface-table-row">
                        <td class="p-4">
                            <div class="flex flex-col">
                                <div class="flex items-center gap-2">
                                    <span class="page-title font-semibold">
                                        {{ item.asset?.symbol || '-' }}
                                    </span>

                                    <span v-if="item.asset?.is_watchlist" class="text-yellow-400">★</span>
                                </div>

                                <span class="page-subtitle">
                                    {{ item.asset?.name || '-' }}
                                </span>
                            </div>
                        </td>

                        <td class="p-4 page-body">
                            {{ item.account?.name || '-' }}
                        </td>

                        <td class="p-4 page-body">
                            {{ formatNumber(item.quantity) }}
                        </td>

                        <td class="p-4 page-body">
                            {{ displayMoney(item.avg_price, item.account?.currency || item.display_currency) }}
                        </td>

                        <td class="p-4 page-body">
                            <div>
                                {{ displayMoney(item.current_price, item.display_currency) }}
                            </div>
                            <div class="page-caption text-xs">
                                {{
                                    item.current_price_source === 'manual_asset_price'
                                        ? 'Manual price'
                                        : 'Fallback avg'
                                }}
                            </div>
                        </td>

                        <td class="p-4 page-body">
                            {{ displayMoney(item.total_fees, item.account?.currency || item.display_currency) }}
                        </td>

                        <td class="p-4 page-body">
                            {{ displayMoney(item.current_value, item.display_currency) }}
                        </td>

                        <td class="p-4">
                            <div class="font-medium"
                                :class="Number(item.unrealized_pnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'">
                                {{ displayMoney(item.unrealized_pnl, item.display_currency) }}
                            </div>

                            <div class="page-subtitle text-xs">
                                {{ Number(item.unrealized_pnl_percent || 0).toFixed(2) }}%
                            </div>
                        </td>

                        <td class="p-4">
                            <span class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium"
                                :class="convictionBadgeClass(item.conviction_level)">
                                {{ formatConviction(item.conviction_level) }}
                            </span>
                        </td>

                        <td class="p-4">
                            <div class="flex justify-end gap-2">
                                <button class="btn-soft rounded-xl px-3 py-2 text-sm font-medium"
                                    @click="$emit('manage', item)">
                                    Manage
                                </button>

                                <button class="btn-outline rounded-xl px-3 py-2 text-sm font-medium transition"
                                    @click="$emit('edit', item.id)">
                                    Edit
                                </button>

                                <button
                                    class="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/30"
                                    @click="$emit('delete', item.id)">
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="!items.length">
                        <td colspan="10" class="p-8 text-center page-subtitle">
                            No portfolio found.
                        </td>
                    </tr>
                </tbody>
            </table>
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

defineEmits(['edit', 'delete', 'manage'])

function formatNumber(value) {
    if (value === null || value === undefined || value === '') return '-'

    return Number(value).toLocaleString('id-ID', {
        maximumFractionDigits: 8,
    })
}

function displayMoney(value, currency = 'IDR') {
    if (value === null || value === undefined || value === '') return '-'

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
    }).format(Number(value))
}

function formatConviction(value) {
    if (!value) return 'No Conviction'
    if (value === 'low') return 'Low'
    if (value === 'medium') return 'Medium'
    if (value === 'high') return 'High'
    return value
}

function convictionBadgeClass(value) {
    if (value === 'high') {
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
    }

    if (value === 'medium') {
        return 'border-amber-500/30 bg-amber-500/10 text-amber-300'
    }

    if (value === 'low') {
        return 'border-red-500/30 bg-red-500/10 text-red-300'
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