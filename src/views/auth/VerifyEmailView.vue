<template>
    <div class="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            <h1 class="text-2xl font-bold">Verify Your Email</h1>
            <p class="mt-3 text-sm text-slate-400">
                We’ve sent a verification link to your email address.
                Please verify your email before continuing.
            </p>

            <p v-if="successMessage" class="mt-4 text-sm text-emerald-400">
                {{ successMessage }}
            </p>

            <p v-if="errorMessage" class="mt-4 text-sm text-red-400">
                {{ errorMessage }}
            </p>

            <div class="mt-6 space-y-3">
                <BaseButton :loading="loading" block @click="handleResend">
                    Resend Verification Email
                </BaseButton>

                <BaseButton variant="secondary" block @click="handleRefresh">
                    I’ve Verified My Email
                </BaseButton>
            </div>
        </div>
    </div>
    <FloatingWhatsApp/>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAuthStore } from '@/stores/auth.store'
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp.vue'
import authApi from '@/api/auth.api'
import { toastService } from '@/utils/toast'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

async function handleResend() {
    loading.value = true
    successMessage.value = ''
    errorMessage.value = ''

    try {
        const response = await authApi.resendVerificationEmail()
        successMessage.value =
            response.data?.message?.en ||
            response.data?.message?.id ||
            'Verification link sent.'
        toastService.success(successMessage.value)
    } catch (error) {
        const response = error.response?.data
        errorMessage.value =
            response?.message?.id ||
            response?.message?.en ||
            'Failed to resend verification email.'
        toastService.error(errorMessage.value)
    } finally {
        loading.value = false
    }
}

async function handleRefresh() {
    try {
        await authStore.fetchMe()

        if (authStore.isEmailVerified) {
            toastService.success('Email verified successfully')
            router.push('/dash/dashboard')
            return
        }

        toastService.error('Your email is not verified yet')
    } catch {
        toastService.error('Failed to refresh user data')
    }
}
</script>