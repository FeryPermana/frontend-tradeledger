<template>
    <div class="grid gap-4 lg:grid-cols-2">
        <!-- ASSET -->
        <div class="card">
            <div class="mb-4">
                <h3 class="title">Allocation by Asset</h3>
                <p class="subtitle">Current portfolio distribution per asset.</p>
            </div>

            <div v-if="allocation?.by_asset?.length" class="space-y-3">
                <div v-for="item in allocation.by_asset" :key="item.label">
                    <div class="row">
                        <span class="label">{{ item.label }}</span>
                        <span class="percentage">{{ item.percentage }}%</span>
                    </div>

                    <div class="progress-bg">
                        <div class="progress-bar" :style="{ width: `${item.percentage}%` }" />
                    </div>

                    <p class="value">
                        {{ formatMoney(item.value, allocation.display_currency) }}
                    </p>
                </div>
            </div>

            <p v-else class="empty">No allocation data.</p>
        </div>

        <!-- CATEGORY -->
        <div class="card">
            <div class="mb-4">
                <h3 class="title">Allocation by Category</h3>
                <p class="subtitle">Current portfolio distribution per category.</p>
            </div>

            <div v-if="allocation?.by_category?.length" class="space-y-3">
                <div v-for="item in allocation.by_category" :key="item.label">
                    <div class="row">
                        <span class="label">{{ formatCategory(item.label) }}</span>
                        <span class="percentage">{{ item.percentage }}%</span>
                    </div>

                    <div class="progress-bg">
                        <div class="progress-bar" :style="{ width: `${item.percentage}%` }" />
                    </div>

                    <p class="value">
                        {{ formatMoney(item.value, allocation.display_currency) }}
                    </p>
                </div>
            </div>

            <p v-else class="empty">No allocation data.</p>
        </div>
    </div>
</template>

<script setup>
defineProps({
    allocation: {
        type: Object,
        default: null,
    },
})

function formatMoney(value, currency = 'IDR') {
    if (!value) return '-'

    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'id-ID', {
        style: 'currency',
        currency,
        maximumFractionDigits: currency === 'IDR' ? 0 : 2,
    }).format(Number(value))
}

function formatCategory(value) {
    if (!value) return '-'
    if (value === 'crypto') return 'Crypto'
    if (value === 'stock') return 'Stock'
    if (value === 'commodity') return 'Commodity'
    return value
}
</script>

<style scoped>
.card {
    border: 1px solid var(--card-border);
    background: var(--card-bg);
    border-radius: 16px;
    padding: 16px;
}

.title {
    color: var(--text-primary);
    font-weight: 600;
    font-size: 16px;
}

.subtitle {
    color: var(--text-secondary);
    font-size: 13px;
}

.row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}

.label {
    color: var(--text-primary);
}

.percentage {
    color: var(--text-secondary);
}

.progress-bg {
    height: 6px;
    border-radius: 999px;
    background: var(--progress-bg);
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    border-radius: 999px;
    background: var(--progress-fill);
}

.value {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 4px;
}

.empty {
    color: var(--text-muted);
    font-size: 14px;
}
</style>