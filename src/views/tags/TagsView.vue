<template>
    <div class="space-y-6">
        <div class="min-w-0">
            <h1 class="page-title text-2xl font-bold">Tags</h1>
            <p class="page-subtitle mt-1 text-sm">
                Manage your trade review and psychology tags.
            </p>
        </div>

        <BaseCard>
            <TagCreateForm :loading="formLoading" @submit="saveTag" />
        </BaseCard>

        <BaseCard>
            <TagSearch @search="handleSearch" />
        </BaseCard>

        <div v-if="store.loading" class="surface-soft rounded-2xl p-6 page-subtitle">
            Loading tags...
        </div>

        <template v-else>
            <TagList v-if="store.items.length" :items="store.items" @delete="deleteTag" />

            <div v-else class="surface-soft rounded-2xl p-6 text-center page-subtitle">
                No tags found.
            </div>
        </template>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useTagStore } from '@/stores/tag.store'
import TagCreateForm from '@/components/tags/TagCreateForm.vue'
import TagList from '@/components/tags/TagList.vue'
import TagSearch from '@/components/tags/TagSearch.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import { toastService } from '@/utils/toast'

const store = useTagStore()
const formLoading = ref(false)

onMounted(async () => {
    store.reset()

    try {
        await store.getAll()
    } catch (error) {
        const response = error.response?.data
        toastService.error(
            response?.message?.id ||
            response?.message?.en ||
            'Failed to load tags.'
        )
    }
})

async function handleSearch(keyword) {
    const search = keyword?.trim() || ''

    try {
        if (!search) {
            await store.getAll()
            return
        }

        await store.getAll({ search })
    } catch (error) {
        const response = error.response?.data
        toastService.error(
            response?.message?.id ||
            response?.message?.en ||
            'Failed to search tags.'
        )
    }
}

async function saveTag(data) {
    formLoading.value = true
    const toastId = toastService.loading('Creating tag...')

    try {
        await store.create(data)
        toastService.dismiss(toastId)
        toastService.success('Tag created successfully.')
        await store.getAll()
    } catch (error) {
        toastService.dismiss(toastId)

        const response = error.response?.data
        toastService.error(
            response?.message?.id ||
            response?.message?.en ||
            'Failed to create tag.'
        )
    } finally {
        formLoading.value = false
    }
}

async function deleteTag(id) {
    const toastId = toastService.loading('Deleting tag...')

    try {
        await store.remove(id)
        await store.getAll()
        toastService.dismiss(toastId)
        toastService.success('Tag deleted successfully.')
    } catch (error) {
        toastService.dismiss(toastId)

        const response = error.response?.data
        toastService.error(
            response?.message?.id ||
            response?.message?.en ||
            'Failed to delete tag.'
        )
    }
}
</script>

<style scoped>
.page-title {
    color: var(--text-title);
}

.page-subtitle {
    color: var(--text-muted);
}

.surface-soft {
    border: 1px solid var(--surface-soft-border);
    background: var(--surface-soft-bg);
}
</style>