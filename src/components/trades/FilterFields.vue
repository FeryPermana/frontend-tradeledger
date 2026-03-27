<template>
    <div class="grid gap-4" :class="isMobile ? 'grid-cols-1' : 'md:grid-cols-2 xl:grid-cols-4'">
        <BaseInput v-model="filters.search" label="Search" placeholder="BTC, breakout..." />

        <BaseSelect v-model="filters.account_id" label="Account" placeholder="All accounts"
            :options="options.accounts" />

        <SearchSelect v-model="filters.asset_id" label="Asset" placeholder="All assets" :options="options.assets" />

        <SearchSelect v-model="filters.strategy_id" label="Strategy" placeholder="All strategies"
            :options="options.strategies" />

        <BaseSelect v-model="filters.position_type" label="Position Type" placeholder="All positions"
            :options="options.positions" />

        <BaseInput v-model="filters.date_from" label="Date From" type="date" />

        <BaseInput v-model="filters.date_to" label="Date To" type="date" />
    </div>

    <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <BaseButton class="w-full sm:w-auto" variant="secondary" @click="$emit('reset')">
            Reset
        </BaseButton>

        <BaseButton class="w-full sm:w-auto" @click="$emit('apply')">
            Apply Filters
        </BaseButton>
    </div>
</template>

<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import SearchSelect from '@/components/common/SearchSelect.vue'

defineProps({
    filters: Object,
    options: Object,
    isMobile: Boolean,
})

defineEmits(['apply', 'reset'])
</script>