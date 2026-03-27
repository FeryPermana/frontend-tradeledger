<template>
    <div class="space-y-4">
        <div class="grid gap-3 md:grid-cols-3">
            <BaseInput v-model="form.search" label="Search" placeholder="Search asset..." @keyup.enter="emitSearch" />

            <BaseSelect v-model="form.conviction_level" label="Conviction" placeholder="All convictions"
                :options="convictionOptions" />

            <BaseSelect v-model="form.horizon" label="Horizon" placeholder="All horizons" :options="horizonOptions" />
        </div>

        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <BaseButton type="button" variant="secondary" class="w-full sm:w-auto" @click="resetSearch">
                Reset
            </BaseButton>

            <BaseButton type="button" class="w-full sm:w-auto" @click="emitSearch">
                Apply Filter
            </BaseButton>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const emit = defineEmits(['search'])

const form = reactive({
    search: '',
    conviction_level: '',
    horizon: '',
})

const convictionOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
]

const horizonOptions = [
    { value: 'short_term', label: 'Short Term' },
    { value: 'medium_term', label: 'Medium Term' },
    { value: 'long_term', label: 'Long Term' },
]

function emitSearch() {
    emit('search', { ...form })
}

function resetSearch() {
    form.search = ''
    form.conviction_level = ''
    form.horizon = ''
    emit('search', { ...form })
}
</script>