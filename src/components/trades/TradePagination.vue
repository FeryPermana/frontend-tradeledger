<template>
    <div class="mt-4 flex items-center justify-between">
        <div class="page-subtitle text-sm">
            Page {{ pagination.current_page }} of {{ pagination.last_page }}
        </div>

        <div class="flex gap-2">
            <button :disabled="pagination.current_page <= 1" @click="$emit('change', pagination.current_page - 1)"
                class="btn-soft rounded-lg px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50">
                Prev
            </button>

            <button :disabled="pagination.current_page >= pagination.last_page"
                @click="$emit('change', pagination.current_page + 1)"
                class="btn-soft rounded-lg px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50">
                Next
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    pagination: Object,
})
</script>

<style scoped>
.page-subtitle {
    color: var(--text-muted);
}

.btn-soft {
    background: var(--button-soft-bg);
    color: var(--button-soft-text);
}

.btn-soft:hover:not(:disabled) {
    background: var(--button-soft-hover);
}
</style>