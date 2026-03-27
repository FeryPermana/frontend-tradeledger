<template>
    <div class="space-y-2">
        <label v-if="label" :for="id" class="block text-sm font-medium base-select-label">
            {{ label }}
        </label>

        <div class="relative">
            <select :id="id" :value="modelValue"
                class="base-select w-full rounded-xl px-4 py-3 pr-10 text-sm outline-none transition appearance-none"
                @change="$emit('update:modelValue', $event.target.value)">
                <option value="">
                    {{ placeholder || 'Select option' }}
                </option>

                <option v-for="option in options" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>

            <!-- custom arrow -->
            <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs base-select-arrow">
                ▼
            </div>
        </div>

        <p v-if="error" class="text-sm text-red-400">
            {{ error }}
        </p>
    </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type: [String, Number],
        default: '',
    },
    label: {
        type: String,
        default: '',
    },
    id: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: '',
    },
    options: {
        type: Array,
        default: () => [],
    },
    error: {
        type: String,
        default: '',
    },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.base-select-label {
    color: var(--input-label);
}

.base-select {
    border: 1px solid var(--input-border);
    background: var(--input-bg);
    color: var(--input-text);
}

/* arrow */
.base-select-arrow {
    color: var(--input-placeholder);
}

/* focus */
.base-select:focus {
    border-color: var(--input-focus-border);
    box-shadow: 0 0 0 2px var(--input-focus-ring);
}

/* FIX dropdown option warna (important untuk dark mode) */
select option {
    background: var(--input-bg);
    color: var(--input-text);
}
</style>