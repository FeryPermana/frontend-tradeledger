<template>
    <div class="relative w-full" v-click-outside="closeDropdown">
        <label v-if="label" class="search-select-label mb-1.5 ml-1 block text-sm font-medium">
            {{ label }}
        </label>

        <div @click="isOpen = !isOpen"
            class="search-select-trigger flex cursor-pointer items-center justify-between rounded-xl px-4 py-2.5 transition-all"
            :class="{ 'search-select-trigger-open': isOpen }">
            <span :class="modelValue ? 'search-select-value' : 'search-select-placeholder'">
                {{ selectedLabel || placeholder || 'Select option...' }}
            </span>

            <svg class="search-select-arrow h-5 w-5 transition-transform duration-200" :class="{ 'rotate-180': isOpen }"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>

        <Transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isOpen" class="search-select-panel absolute z-50 mt-2 w-full rounded-xl p-2 shadow-2xl">
                <input v-model="search" ref="searchInput" type="text" placeholder="Search..."
                    class="search-select-input mb-2 w-full rounded-lg px-3 py-2 text-sm" @click.stop />

                <div class="max-h-48 overflow-y-auto">
                    <button type="button"
                        class="search-select-clear block w-full rounded-md px-3 py-2 text-left text-sm"
                        @click="selectOption('')">
                        {{ emptyLabel || 'Clear selection' }}
                    </button>

                    <button v-for="option in filteredOptions" :key="option.value" type="button"
                        class="search-select-option block w-full rounded-md px-3 py-2 text-left text-sm transition-colors"
                        :class="String(modelValue) === String(option.value) ? 'search-select-option-active' : 'search-select-option-idle'"
                        @click="selectOption(option.value)">
                        {{ option.label }}
                    </button>

                    <div v-if="!filteredOptions.length" class="search-select-empty px-3 py-4 text-center text-sm">
                        No results found.
                    </div>
                </div>
            </div>
        </Transition>

        <p v-if="error" class="mt-1 text-sm text-red-400">
            {{ error }}
        </p>
    </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'

const props = defineProps({
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    emptyLabel: String,
    options: { type: Array, default: () => [] },
    error: String,
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const search = ref('')
const searchInput = ref(null)

const selectedLabel = computed(() => {
    const selected = props.options.find((opt) => String(opt.value) === String(props.modelValue))
    return selected ? selected.label : ''
})

const filteredOptions = computed(() => {
    const keyword = search.value.trim().toLowerCase()
    return props.options.filter((opt) =>
        String(opt.label).toLowerCase().includes(keyword)
    )
})

const selectOption = (value) => {
    emit('update:modelValue', value)
    isOpen.value = false
    search.value = ''
}

const closeDropdown = () => {
    isOpen.value = false
}

watch(isOpen, (newVal) => {
    if (newVal) {
        nextTick(() => searchInput.value?.focus())
    }
})

const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value()
            }
        }
        document.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
    },
}
</script>

<style scoped>
.search-select-label {
    color: var(--input-label);
}

.search-select-trigger {
    border: 1px solid var(--input-border);
    background: var(--input-bg);
}

.search-select-trigger:hover {
    border-color: var(--input-focus-border);
}

.search-select-trigger-open {
    border-color: var(--input-focus-border);
    box-shadow: 0 0 0 2px var(--input-focus-ring);
}

.search-select-value {
    color: var(--input-text);
}

.search-select-placeholder {
    color: var(--input-placeholder);
}

.search-select-arrow {
    color: var(--input-placeholder);
}

.search-select-panel {
    border: 1px solid var(--surface-card-border);
    background: var(--surface-card-bg);
}

.search-select-input {
    border: 1px solid var(--input-border);
    background: var(--input-bg);
    color: var(--input-text);
}

.search-select-input::placeholder {
    color: var(--input-placeholder);
}

.search-select-input:focus {
    outline: none;
    border-color: var(--input-focus-border);
    box-shadow: 0 0 0 1px var(--input-focus-ring);
}

.search-select-clear {
    color: #f87171;
}

.search-select-clear:hover {
    background: var(--surface-soft-bg);
}

.search-select-option-idle {
    color: var(--text-body);
}

.search-select-option-idle:hover {
    background: var(--surface-soft-bg);
}

.search-select-option-active {
    background: rgba(34, 211, 238, 0.14);
    color: var(--text-title);
}

.search-select-empty {
    color: var(--text-muted);
}
</style>