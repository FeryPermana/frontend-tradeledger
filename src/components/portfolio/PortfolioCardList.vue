<template>
    <div class="space-y-3">
        <div v-for="item in items" :key="item.id" class="surface-card rounded-2xl p-4 shadow-xl">
            <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                        <p class="page-title text-base font-semibold">
                            {{ item.asset_symbol || '-' }}
                        </p>
                    </div>

                    <p class="page-subtitle mt-1 break-words text-sm">
                        {{ item.asset_name || '-' }}
                    </p>

                    <p class="page-caption mt-1 text-xs">
                        {{ item.account_name || '-' }}
                    </p>

                    <p class="mt-1 text-xs text-indigo-400">
                        Manual position
                    </p>
                </div>

                <span class="shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium"
                    :class="convictionBadgeClass(item.conviction_level)">
                    {{ formatConviction(item.conviction_level) }}
                </span>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div class="surface-soft rounded-xl p-3">
                    <p class="page-subtitle text-sm">Quantity</p>
                    <p class="page-title mt-1 font-medium">
                        {{ formatNumber(item.quantity) }}
                    </p>
                </div>

                <div class="surface-soft rounded-xl p-3">
                    <p class="page-subtitle text-sm">Avg Price</p>
                    <p class="page-title mt-1 break-words font-medium">
                        {{ displayMoney(item.avg_price, item.account_currency || item.display_currency || 'IDR') }}
                    </p>
                </div>

                <div class="surface-soft rounded-xl p-3">
                    <p class="page-subtitle text-sm">Current Price</p>
                    <p class="page-title mt-1 break-words font-medium">
                        {{ displayMoney(item.current_price, item.display_currency) }}
                    </p>
                    <p class="page-caption mt-1 text-xs">
                        {{
                            item.current_price_source === 'manual_asset_price'
                                ? 'Manual asset price'
                                : 'Fallback avg price'
                        }}
                    </p>
                </div>

                <div class="surface-soft rounded-xl p-3">
                    <p class="page-subtitle text-sm">Fees</p>
                    <p class="page-title mt-1 break-words font-medium">
                        {{ displayMoney(item.total_fees, item.account_currency || item.display_currency) }}
                    </p>
                </div>

                <div class="surface-soft rounded-xl p-3">
                    <p class="page-subtitle text-sm">Value</p>
                    <p class="page-title mt-1 break-words font-medium">
                        {{ displayMoney(item.current_value, item.display_currency) }}
                    </p>
                </div>

                <div class="surface-soft rounded-xl p-3">
                    <p class="page-subtitle text-sm">PnL</p>
                    <p class="mt-1 break-words font-medium"
                        :class="Number(item.unrealized_pnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'">
                        {{ displayMoney(item.unrealized_pnl, item.display_currency) }}
                    </p>
                    <p class="page-caption mt-1 text-xs">
                        {{ Number(item.unrealized_pnl_percent || 0).toFixed(2) }}%
                    </p>
                </div>
            </div>

            <div v-if="item.thesis" class="surface-soft mt-4 rounded-xl p-3">
                <p class="page-caption text-xs uppercase tracking-wide">Thesis</p>
                <p class="page-body mt-1 whitespace-pre-wrap text-sm">
                    {{ item.thesis }}
                </p>
            </div>

            <div v-if="item.notes" class="surface-soft mt-4 rounded-xl p-3">
                <p class="page-caption text-xs uppercase tracking-wide">Notes</p>
                <p class="page-body mt-1 whitespace-pre-wrap text-sm">
                    {{ item.notes }}
                </p>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-2">
                <button class="btn-soft rounded-xl px-3 py-2 text-sm font-medium" @click="$emit('manage', item)">
                    Manage
                </button>

                <button class="btn-outline rounded-xl px-3 py-2 text-sm font-medium transition"
                    @click="$emit('edit', item.id)">
                    Edit
                </button>

                <button
                    class="col-span-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/30"
                    @click="$emit('delete', item.id)">
                    Delete
                </button>
            </div>
        </div>

        <div v-if="!items.length" class="surface-card rounded-2xl p-6 text-center page-subtitle">
            No portfolio found.
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

    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'id-ID', {
        style: 'currency',
        currency,
        maximumFractionDigits: currency === 'IDR' ? 0 : 2,
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
    if (value === 'high') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
    if (value === 'medium') return 'border-amber-500/30 bg-amber-500/10 text-amber-300'
    if (value === 'low') return 'border-red-500/30 bg-red-500/10 text-red-300'
    return 'badge-neutral'
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