<template>
    <div class="space-y-2">
        <label v-if="label" :for="id" class="block text-sm font-medium base-input-label">
            {{ label }}
        </label>

        <div class="relative flex items-center">
            <input :id="id" :type="type" :value="modelValue" :readonly="readonly" :placeholder="placeholder" :autocomplete="autocomplete"
                :min="type === 'number' ? '0' : null" :step="type === 'number' ? 'any' : null"
                class="base-input w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                :class="{ 'pr-12': $slots.suffix }" @input="handleInput" @keydown="handleKeyDown" />

            <div v-if="$slots.suffix" class="absolute right-4 flex items-center">
                <slot name="suffix" />
            </div>
        </div>

        <p v-if="error" class="text-sm text-red-400">
            {{ error }}
        </p>
    </div>
</template>

<script setup>
const props = defineProps({
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
    type: {
        type: String,
        default: 'text',
    },
    placeholder: {
        type: String,
        default: '',
    },
    autocomplete: {
        type: String,
        default: 'off',
    },
    error: {
        type: String,
        default: '',
    },
    readonly: { 
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue'])

const handleKeyDown = (event) => {
    if (props.type === 'number') {
        if (event.key === '-') {
            event.preventDefault()
        }
    }
}

const handleInput = (event) => {
    let value = event.target.value

    if (props.type === 'number' && value < -1) {
        value = Math.abs(value)
        event.target.value = value
    }

    emit('update:modelValue', value)
}
</script>

<style scoped>
.base-input-label {
    color: var(--input-label);
}

.base-input {
    border: 1px solid var(--input-border);
    background: var(--input-bg);
    color: var(--input-text);
}

.base-input::placeholder {
    color: var(--input-placeholder);
}

.base-input:focus {
    border-color: var(--input-focus-border);
    box-shadow: 0 0 0 2px var(--input-focus-ring);
}
</style>