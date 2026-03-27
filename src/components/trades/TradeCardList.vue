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

                            <span v-if="item.position_type === 'investment'"
                                class="rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300">
                                INVEST
                            </span>
                        </div>

                        <p class="page-body mt-1 break-words text-sm">
                            {{ item.strategy?.name || '-' }} • {{ formatPosition(item.position_type) }}
                        </p>

                        <p class="page-subtitle mt-1 text-sm">
                            {{ formatDate(item.entry_date) }}
                        </p>
                    </div>

                    <div class="shrink-0 text-right">
                        <p class="text-sm font-semibold"
                            :class="Number(item.profit_loss || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'">
                            {{
                                item.profit_loss !== null
                                    ? displayMoney(
                                        item.profit_loss,
                                        item.account?.currency || item.display_currency || 'IDR'
                                    )
                            : '-'
                            }}
                        </p>

                        <div class="mt-2">
                            <span class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium"
                                :class="statusBadgeClass(item.status)">
                                {{ formatStatus(item.status) }}
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
                        <p class="page-title mt-1 break-words text-sm font-medium">
                            {{ item.account?.name || '-' }}
                        </p>
                    </div>

                    <div class="surface-soft rounded-xl p-3">
                        <p class="page-caption text-xs">R</p>
                        <p class="page-title mt-1 text-sm font-medium">
                            {{ item.r_multiple !== null ? item.r_multiple : '-' }}
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="surface-soft rounded-xl p-3">
                        <p class="page-caption text-xs">Closed Qty</p>
                        <p class="page-title mt-1 text-sm font-medium">
                            {{ formatQty(item.closed_quantity ?? 0) }}
                        </p>
                    </div>

                    <div class="surface-soft rounded-xl p-3">
                        <p class="page-caption text-xs">Remaining Qty</p>
                        <p class="page-title mt-1 text-sm font-medium">
                            {{ formatQty(item.remaining_quantity ?? 0) }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-4 grid gap-2" :class="item.position_type === 'investment' ? 'grid-cols-2' : 'grid-cols-3'">
                <button class="btn-soft rounded-xl px-3 py-2 text-sm font-medium" @click="$emit('view', item.id)">
                    View
                </button>

                <button v-if="item.position_type !== 'investment'"
                    class="btn-outline rounded-xl px-3 py-2 text-sm font-medium transition"
                    @click="$emit('edit', item.id)">
                    Edit
                </button>

                <button
                    class="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                    @click="$emit('delete', item.id)">
                    Delete
                </button>
            </div>

            <div v-if="item.position_type === 'investment'"
                class="surface-soft page-subtitle mt-3 rounded-xl px-3 py-2 text-xs">
                Investment positions are managed from Portfolio.
            </div>
        </div>

        <div v-if="!items.length" class="surface-card rounded-2xl p-6 text-center text-sm page-subtitle">
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

function displayMoney(value, currency = 'IDR') {
    if (value === null || value === undefined || value === '') return '-'

    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'id-ID', {
        style: 'currency',
        currency,
        maximumFractionDigits: currency === 'IDR' ? 0 : 2,
    }).format(Number(value))
}

function formatQty(value) {
    return new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 8,
    }).format(Number(value || 0))
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