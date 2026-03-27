<template>
    <div class="surface-card rounded-2xl p-4 shadow-xl">
        <div v-if="items.length" class="flex flex-wrap gap-2 sm:gap-3">
            <div v-for="item in items" :key="item.id"
                class="tag-pill flex items-center gap-2 rounded-full px-3 py-2 sm:px-4">
                <span class="page-body text-sm">
                    {{ item.name }}
                </span>

                <button
                    class="flex h-5 w-5 items-center justify-center rounded-full text-xs text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                    @click="$emit('delete', item.id)">
                    ✕
                </button>
            </div>
        </div>

        <div v-else class="page-subtitle py-4 text-center text-sm">
            No tags found.
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

defineEmits(['delete'])
</script>

<style scoped>
.surface-card {
    border: 1px solid var(--surface-card-border);
    background: var(--surface-card-bg);
}

.tag-pill {
    border: 1px solid var(--surface-soft-border);
    background: var(--surface-soft-bg);
}

.page-body {
    color: var(--text-body);
}

.page-subtitle {
    color: var(--text-muted);
}
</style>