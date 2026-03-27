<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
    <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
      <div class="mb-8 flex flex-col items-center">
        <div class="w-full flex justify-center pt-5 pb-2">
          <RouterLink to="/">
            <img src="/src/assets/logo.png" alt="TradeLedger Logo"
              class="mb-4 h-10 cursor-pointer object-contain drop-shadow-2xl" />
          </RouterLink>
        </div>

        <span class="text-center text-sm text-slate-400">
          Login to your trading and investing intelligence dashboard.
        </span>
      </div>

      <form class="space-y-5" @submit.prevent="handleLogin">
        <BaseInput id="email" v-model="form.email" label="Email" type="email" placeholder="you@example.com"
          autocomplete="email" :error="errors.email" />

        <BaseInput id="password" v-model="form.password" label="Password" type="password"
          placeholder="Enter your password" autocomplete="current-password" :error="errors.password" />

        <div class="flex justify-end">
          <RouterLink to="/forgot-password" class="text-sm font-medium text-blue-400 hover:text-blue-300">
            Forgot password?
          </RouterLink>
        </div>

        <p v-if="errors.general" class="text-sm text-red-400">
          {{ errors.general }}
        </p>

        <BaseButton type="submit" :loading="authStore.loading" block>
          Login
        </BaseButton>
      </form>

      <p class="mt-6 text-center text-sm text-slate-400">
        Don’t have an account?
        <RouterLink class="font-medium text-blue-400 hover:text-blue-300" to="/register">
          Register
        </RouterLink>
      </p>
    </div>
  </div>
  <FloatingWhatsApp />
</template>

<script setup>
import { reactive } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp.vue'
import { useAuthStore } from '@/stores/auth.store'
import { toastService } from '../../utils/toast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const validPlans = ['3_months', '8_months', '12_months']

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
  general: '',
})

function resetErrors() {
  errors.email = ''
  errors.password = ''
  errors.general = ''
}

async function handleLogin() {
  resetErrors()
  const toastId = toastService.loading('Signing in...')

  try {
    await authStore.login({ ...form })
    await authStore.fetchMe()

    const selectedPlan = String(route.query.plan || '')

    toastService.dismiss(toastId)
    toastService.success('Login successful')

    if (validPlans.includes(selectedPlan)) {
      await router.push(`/payment?plan=${selectedPlan}`)
      return
    }

    await router.push('/dash/dashboard')
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data

    if (response?.errors) {
      errors.email = response.errors.email?.[0] || ''
      errors.password = response.errors.password?.[0] || ''
    }

    errors.general =
      response?.message?.id ||
      response?.message?.en ||
      'Login failed.'

    toastService.error(errors.general)
  }
}
</script>