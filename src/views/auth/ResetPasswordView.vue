<template>
    <div class="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            <div class="mb-8 text-center">
                <h1 class="text-2xl font-bold">Reset Password</h1>
                <p class="mt-2 text-sm text-slate-400">
                    Enter your new password below.
                </p>
            </div>

            <form class="space-y-5" @submit.prevent="handleSubmit">
                <BaseInput id="email" v-model="form.email" label="Email" type="email" placeholder="you@example.com"
                    autocomplete="email" :error="errors.email" />

                <BaseInput id="password" v-model="form.password" label="New Password"
                    :type="showPassword ? 'text' : 'password'" placeholder="Minimum 8 characters"
                    :error="errors.password">
                    <template #suffix>
                        <button type="button" @click="showPassword = !showPassword"
                            class="text-slate-400 hover:text-slate-200 focus:outline-none">
                            <EyeOff v-if="showPassword" :size="18" />
                            <Eye v-else :size="18" />
                        </button>
                    </template>
                </BaseInput>

                <BaseInput id="password_confirmation" v-model="form.password_confirmation" label="Confirm New Password"
                    :type="showConfirmPassword ? 'text' : 'password'" placeholder="Repeat your new password"
                    :error="errors.password_confirmation">
                    <template #suffix>
                        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                            class="text-slate-400 hover:text-slate-200 focus:outline-none">
                            <EyeOff v-if="showConfirmPassword" :size="18" />
                            <Eye v-else :size="18" />
                        </button>
                    </template>
                </BaseInput>

                <p v-if="errors.general" class="text-sm text-red-400">
                    {{ errors.general }}
                </p>

                <BaseButton type="submit" :loading="loading" block>
                    Reset Password
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
import { onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import api from '@/api/axios'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { toastService } from '@/utils/toast'
import { Eye, EyeOff } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
    token: '',
    email: '',
    password: '',
    password_confirmation: '',
})

const errors = reactive({
    email: '',
    password: '',
    password_confirmation: '',
    general: '',
})

function resetErrors() {
    errors.email = ''
    errors.password = ''
    errors.password_confirmation = ''
    errors.general = ''
}

async function handleSubmit() {
    resetErrors()
    loading.value = true

    const toastId = toastService.loading('Resetting password...')

    try {
        await api.post('/auth/reset-password', {
            token: form.token,
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation,
        })

        toastService.dismiss(toastId)
        toastService.success('Password reset successfully.')
        await router.push('/login')
    } catch (error) {
        toastService.dismiss(toastId)

        const response = error.response?.data

        if (response?.errors) {
            errors.email = response.errors.email?.[0] || ''
            errors.password = response.errors.password?.[0] || ''
            errors.password_confirmation = response.errors.password_confirmation?.[0] || ''
            errors.general = response.errors.token?.[0] || ''
        }

        if (!errors.general) {
            errors.general =
                response?.message?.id ||
                response?.message?.en ||
                'Failed to reset password.'
        }

        toastService.error(errors.general)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    form.token = String(route.query.token || '')
    form.email = String(route.query.email || '')

    if (!form.token || !form.email) {
        errors.general = 'Invalid or expired reset link.'
    }
})
</script>