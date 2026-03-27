<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
    <div class="my-6 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
      <div class="mb-8 text-center">
        <h1 class="text-center text-2xl font-bold">Register</h1>
        <p class="mt-2 text-center text-sm text-slate-400">
          Start building your trading and investment record.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleRegister">
        <BaseInput id="name" v-model="form.name" label="Name" placeholder="Your name" autocomplete="name"
          :error="errors.name" />

        <BaseInput id="email" v-model="form.email" label="Email" placeholder="Your email" autocomplete="email"
          :error="errors.email" />

        <BaseSelect v-model="form.base_currency" label="Base Currency" placeholder="Select base currency"
          :options="ACCOUNT_CURRENCIES" :error="errors.base_currency" />

        <BaseInput id="password" v-model="form.password" label="Password" :type="showPassword ? 'text' : 'password'"
          placeholder="Minimum 8 characters" :error="errors.password">
          <template #suffix>
            <button type="button" @click="showPassword = !showPassword"
              class="text-slate-400 hover:text-slate-200 focus:outline-none">
              <EyeOff v-if="showPassword" :size="18" />
              <Eye v-else :size="18" />
            </button>
          </template>
        </BaseInput>

        <BaseInput id="password_confirmation" v-model="form.password_confirmation" label="Confirm Password"
          :type="showConfirmPassword ? 'text' : 'password'" placeholder="Repeat your password"
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

        <BaseButton type="submit" :loading="authStore.loading" block>
          Register
        </BaseButton>
      </form>

      <p class="mt-6 text-center text-sm text-slate-400">
        Already have an account?
        <RouterLink class="font-medium text-blue-400 hover:text-blue-300"
          :to="route.query.plan ? `/login?plan=${route.query.plan}` : '/login'">
          Login
        </RouterLink>
      </p>
    </div>
  </div>
    <FloatingWhatsApp/>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp.vue'
import { useAuthStore } from '@/stores/auth.store'
import { toastService } from '@/utils/toast'
import { Eye, EyeOff } from 'lucide-vue-next'
import { ACCOUNT_CURRENCIES } from '@/constants/account'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const validPlans = ['3_months', '8_months', '12_months']

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  base_currency: '',
  password: '',
  password_confirmation: '',
})

const errors = reactive({
  name: '',
  email: '',
  base_currency: '',
  password: '',
  password_confirmation: '',
  general: '',
})

function resetErrors() {
  errors.name = ''
  errors.email = ''
  errors.base_currency = ''
  errors.password = ''
  errors.password_confirmation = ''
  errors.general = ''
}

async function handleRegister() {
  resetErrors()

  const toastId = toastService.loading('Creating account...')

  try {
    await authStore.register({ ...form })
    await authStore.fetchMe()

    const selectedPlan = String(route.query.plan || '')

    toastService.dismiss(toastId)
    toastService.success('Account created successfully')

    if (validPlans.includes(selectedPlan)) {
      await router.push({
        name: 'payment',
        query: { plan: selectedPlan },
      })
      return
    }

    await router.push({ name: 'accounts' })
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data

    if (response?.errors) {
      errors.name = response.errors.name?.[0] || ''
      errors.email = response.errors.email?.[0] || ''
      errors.base_currency = response.errors.base_currency?.[0] || ''
      errors.password = response.errors.password?.[0] || ''
      errors.password_confirmation = response.errors.password_confirmation?.[0] || ''
    }

    if (response?.message) {
      errors.general = response.message.id || response.message.en || 'Register failed.'
    } else {
      errors.general = 'Register failed.'
    }

    if (!response?.errors) {
      toastService.error(errors.general)
    }
  }
}
</script>