<template>
    <form class="flex flex-col gap-3 sm:flex-row sm:items-end" @submit.prevent="handleSubmit">
        <div class="flex-1">
            <BaseInput v-model="name" label="Add Tag" placeholder="A+, FOMO, Overtrade" :error="error" />
        </div>

        <BaseButton type="submit" class="w-full sm:w-auto" :loading="loading">
            Add Tag
        </BaseButton>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { toastService } from '@/utils/toast'

defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['submit'])

const name = ref('')
const error = ref('')

function handleSubmit() {
    error.value = ''

    const value = name.value.trim()

    if (!value) {
        error.value = 'Tag name is required.'
        toastService.error('Please complete the form correctly.')
        return
    }

    emit('submit', {
        name: value,
    })

    name.value = ''
}
</script>