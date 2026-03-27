<template>
    <div class="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            <div class="mb-8 text-center">
                <h1 class="text-2xl font-bold">Forgot Password</h1>
                <p class="mt-2 text-sm text-slate-400">
                    Enter your email and we will send you a reset link.
                </p>
            </div>

            <form class="space-y-5" @submit.prevent="handleSubmit">
                <BaseInput id="email" v-model="form.email" label="Email" type="email" placeholder="you@example.com"
                    autocomplete="email" :error="errors.email" />

                <p v-if="errors.general" class="text-sm text-red-400">
                    {{ errors.general }}
                </p>

                <p v-if="successMessage" class="text-sm text-emerald-400">
                    {{ successMessage }}
                </p>

                <BaseButton type="submit" :loading="loading" block>
                    Send Reset Link
                </BaseButton>
            </form>

            <p class="mt-6 text-center text-sm text-slate-400">
                Back to
                <RouterLink class="font-medium text-blue-400 hover:text-blue-300" to="/login">
                    Login
                </RouterLink>
            </p>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import api from '@/api/axios'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { toastService } from '@/utils/toast'

const loading = ref(false)
const successMessage = ref('')

const form = reactive({
    email: '',
})

const errors = reactive({
    email: '',
    general: '',
})

function resetState() {
    errors.email = ''
    errors.general = ''
    successMessage.value = ''
}

async function handleSubmit() {
    resetState()
    loading.value = true

    const toastId = toastService.loading('Sending reset link...')

    try {
        await api.post('/auth/forgot-password', {
            email: form.email,
        })

        successMessage.value = 'Password reset link has been sent to your email.'
        toastService.dismiss(toastId)
        toastService.success('Reset link sent successfully.')
    } catch (error) {
        toastService.dismiss(toastId)

        const response = error.response?.data

        if (response?.errors) {
            errors.email = response.errors.email?.[0] || ''
        }

        errors.general =
            response?.message?.id ||
            response?.message?.en ||
            'Failed to send reset link.'

        toastService.error(errors.general)
    } finally {
        loading.value = false
    }
}
</script>