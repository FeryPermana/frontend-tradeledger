<template>
    <button :type="type" :disabled="disabled || loading"
        class="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
        :class="buttonClass">
        <span v-if="loading">Loading...</span>
        <span v-else>
            <slot />
        </span>
    </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    type: {
        type: String,
        default: 'button',
    },
    variant: {
        type: String,
        default: 'primary',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    block: {
        type: Boolean,
        default: false,
    },
})

const buttonClass = computed(() => {
    const base = props.block ? 'w-full' : ''

    if (props.variant === 'secondary') {
        return `${base} base-button-secondary`
    }

    return `${base} base-button-primary`
})
</script>

<style scoped>
.base-button-primary {
    background: var(--button-primary-bg);
    color: var(--button-primary-text);
}

.base-button-primary:hover {
    background: var(--button-primary-hover);
}

.base-button-secondary {
    border: 1px solid var(--button-secondary-border);
    background: var(--button-secondary-bg);
    color: var(--button-secondary-text);
}

.base-button-secondary:hover {
    background: var(--button-secondary-hover);
}
</style>