<template>
    <div class="space-y-4">
        <div class="surface-card hidden rounded-2xl p-4 shadow-xl md:block">
            <div class="grid grid-cols-1 gap-4 xl:grid-cols-4">
                <BaseSelect v-model="filters.account_id" label="Account" :options="allOptions.accounts" />
                <SearchSelect v-model="filters.asset_id" label="Asset" :options="allOptions.assets" />
                <SearchSelect v-model="filters.strategy_id" label="Strategy" :options="allOptions.strategies" />
                <BaseSelect v-model="filters.tag_id" label="Tag" :options="allOptions.tags" />
                <BaseSelect v-model="filters.position_type" label="Position Type" :options="allOptions.positions" />
                <BaseSelect v-model="filters.category" label="Category" :options="allOptions.categories" />
                <BaseInput v-model="filters.date_from" label="From" type="date" />
                <BaseInput v-model="filters.date_to" label="To" type="date" />
            </div>

            <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <BaseButton variant="secondary" class="w-full sm:w-auto" @click="resetFilters">
                    Reset
                </BaseButton>

                <BaseButton class="w-full sm:w-auto" @click="applyFilters">
                    Apply Filters
                </BaseButton>
            </div>
        </div>

        <div class="space-y-3 md:hidden">
            <div class="grid grid-cols-2 gap-2">
                <BaseButton variant="secondary" class="w-full" @click="showMobileModal = true">
                    More Filters
                </BaseButton>

                <BaseButton class="w-full" @click="applyFilters">
                    Apply
                </BaseButton>
            </div>

            <div v-if="showMobileModal" class="fixed inset-0 z-50 bg-black/60 px-4 py-4 sm:px-6">
                <div class="flex min-h-full items-center justify-center">
                    <div
                        class="modal-panel flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl shadow-2xl">
                        <div class="modal-header flex items-center justify-between px-5 py-4 sm:px-6">
                            <h3 class="modal-title text-lg font-semibold sm:text-xl">Dashboard Filters</h3>

                            <button type="button" class="modal-close rounded-xl px-3 py-2 text-sm transition"
                                @click="showMobileModal = false">
                                ✕
                            </button>
                        </div>

                        <div class="overflow-y-auto px-5 py-5 sm:px-6">
                            <div class="space-y-4">
                                <BaseSelect v-model="filters.account_id" label="Account"
                                    :options="allOptions.accounts" />
                                <SearchSelect v-model="filters.asset_id" label="Asset" :options="allOptions.assets" />
                                <SearchSelect v-model="filters.strategy_id" label="Strategy"
                                    :options="allOptions.strategies" />
                                <BaseSelect v-model="filters.tag_id" label="Tag" :options="allOptions.tags" />
                                <BaseSelect v-model="filters.position_type" label="Position Type"
                                    :options="allOptions.positions" />
                                <BaseSelect v-model="filters.category" label="Category"
                                    :options="allOptions.categories" />

                                <div class="grid grid-cols-2 gap-3">
                                    <BaseInput v-model="filters.date_from" label="From" type="date" />
                                    <BaseInput v-model="filters.date_to" label="To" type="date" />
                                </div>
                            </div>

                            <div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <BaseButton variant="secondary" class="w-full sm:w-auto" @click="resetFilters">
                                    Reset
                                </BaseButton>

                                <BaseButton class="w-full sm:w-auto" @click="handleMobileApply">
                                    Apply Filters
                                </BaseButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="activeBadges.length" class="flex flex-wrap gap-2">
                <span v-for="badge in activeBadges" :key="badge.key"
                    class="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                    {{ badge.label }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import SearchSelect from '@/components/common/SearchSelect.vue'
import { useAccountStore } from '@/stores/account.store'
import { useAssetStore } from '@/stores/asset.store'
import { useStrategyStore } from '@/stores/strategy.store'
import { useTagStore } from '@/stores/tag.store'

const emit = defineEmits(['apply', 'reset'])

const showMobileModal = ref(false)

const accountStore = useAccountStore()
const assetStore = useAssetStore()
const strategyStore = useStrategyStore()
const tagStore = useTagStore()

const filters = reactive({
    account_id: '',
    asset_id: '',
    strategy_id: '',
    tag_id: '',
    position_type: '',
    category: '',
    date_from: '',
    date_to: '',
})

const allOptions = computed(() => {
    const categories = [...new Set(assetStore.items.map((item) => item.category).filter(Boolean))]

    return {
        accounts: accountStore.items.map((item) => ({
            value: item.id,
            label: item.name,
        })),
        assets: assetStore.items.map((item) => ({
            value: item.id,
            label: `${item.symbol} - ${item.name}`,
        })),
        strategies: strategyStore.items.map((item) => ({
            value: item.id,
            label: item.name,
        })),
        tags: tagStore.items.map((item) => ({
            value: item.id,
            label: item.name,
        })),
        positions: [
            { value: 'scalping', label: 'Scalping' },
            { value: 'intra_day', label: 'Intra Day' },
            { value: 'swing', label: 'Swing' },
            { value: 'investment', label: 'Investment' },
            { value: 'no_investment', label: 'No Investment' },
        ],
        categories: categories.map((item) => ({
            value: item,
            label: formatLabel(item),
        })),
    }
})

const activeBadges = computed(() => {
    const badges = []

    if (filters.account_id) {
        const found = allOptions.value.accounts.find((item) => String(item.value) === String(filters.account_id))
        badges.push({ key: 'account_id', label: `Account: ${found?.label || filters.account_id}` })
    }

    if (filters.asset_id) {
        const found = allOptions.value.assets.find((item) => String(item.value) === String(filters.asset_id))
        badges.push({ key: 'asset_id', label: `Asset: ${found?.label || filters.asset_id}` })
    }

    if (filters.strategy_id) {
        const found = allOptions.value.strategies.find((item) => String(item.value) === String(filters.strategy_id))
        badges.push({ key: 'strategy_id', label: `Strategy: ${found?.label || filters.strategy_id}` })
    }

    if (filters.tag_id) {
        const found = allOptions.value.tags.find((item) => String(item.value) === String(filters.tag_id))
        badges.push({ key: 'tag_id', label: `Tag: ${found?.label || filters.tag_id}` })
    }

    if (filters.position_type) {
        badges.push({ key: 'position_type', label: `Position: ${formatLabel(filters.position_type)}` })
    }

    if (filters.category) {
        badges.push({ key: 'category', label: `Category: ${formatLabel(filters.category)}` })
    }

    if (filters.date_from) {
        badges.push({ key: 'date_from', label: `From: ${filters.date_from}` })
    }

    if (filters.date_to) {
        badges.push({ key: 'date_to', label: `To: ${filters.date_to}` })
    }

    return badges
})

onMounted(async () => {
    if (!accountStore.items.length) await accountStore.getAll()
    if (!assetStore.items.length) await assetStore.getAll()
    if (!strategyStore.items.length) await strategyStore.getAll()
    if (!tagStore.items.length) await tagStore.getAll()
})

function applyFilters() {
    emit('apply', { ...filters })
}

function handleMobileApply() {
    applyFilters()
    showMobileModal.value = false
}

function resetFilters() {
    filters.account_id = ''
    filters.asset_id = ''
    filters.strategy_id = ''
    filters.tag_id = ''
    filters.position_type = ''
    filters.category = ''
    filters.date_from = ''
    filters.date_to = ''

    emit('reset')
    showMobileModal.value = false
}

function formatLabel(value) {
    return String(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}
</script>

<style scoped>
.surface-card {
    border: 1px solid var(--surface-card-border);
    background: var(--surface-card-bg);
}

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
</style>