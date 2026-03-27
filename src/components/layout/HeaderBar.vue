<template>
  <header class="header-bar px-4 py-3 md:px-6">
    <div class="flex items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-3">
        <button type="button"
          class="header-icon-btn inline-flex h-10 w-10 items-center justify-center rounded-xl transition md:hidden"
          @click="ui.toggleMobileSidebar">
          <Menu class="h-5 w-5" />
        </button>

        <div class="min-w-0">
          <h2 class="truncate text-base font-semibold header-title sm:text-lg">
            {{ pageTitle }}
          </h2>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div class="hidden md:flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium" :class="auth.isPremium
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          : 'header-plan-badge'">
          <span class="font-semibold">
            {{ auth.isPremium ? 'PRO' : 'FREE' }}
          </span>

          <template v-if="auth.isPremium && auth.user?.premium_expires_at">
            <span class="header-meta-text">• {{ formatShortDate(auth.user.premium_expires_at) }}</span>
          </template>

          <template v-else-if="!auth.isPremium && auth.planStatus">
            <span class="header-meta-text">• {{ auth.accountLimitUsed }}/{{ auth.accountLimitMax }} acc</span>
            <span class="header-meta-text">• {{ auth.tradeLimitUsed }}/{{ auth.tradeLimitMax }} trades</span>
          </template>
        </div>

        <RouterLink v-if="!auth.isPremium" :to="{ name: 'payment', query: { plan: 'monthly' } }"
          class="hidden md:inline-flex items-center justify-center rounded-xl bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400">
          Upgrade
        </RouterLink>

        <button type="button" @click="handleToggleTheme"
          class="header-icon-btn inline-flex h-10 w-10 items-center justify-center rounded-xl transition"
          :title="currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
          <Sun v-if="currentTheme === 'dark'" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5" />
        </button>

        <button type="button" @click="logout"
          class="header-action-btn rounded-xl px-3 py-2 text-sm font-medium transition">
          Logout
        </button>
      </div>
    </div>

    <div class="mt-3 flex items-center justify-between gap-2 md:hidden">
      <div class="min-w-0 flex-1 rounded-xl border px-3 py-2 text-[11px]" :class="auth.isPremium
        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
        : 'header-plan-badge'">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span class="font-semibold">
            {{ auth.isPremium ? 'PRO' : 'FREE' }}
          </span>

          <template v-if="auth.isPremium && auth.user?.premium_expires_at">
            <span class="header-meta-text">• Exp {{ formatShortDate(auth.user.premium_expires_at) }}</span>
          </template>

          <template v-else-if="!auth.isPremium && auth.planStatus">
            <span class="header-meta-text">• Acc {{ auth.accountLimitUsed }}/{{ auth.accountLimitMax }}</span>
            <span class="header-meta-text">• Trades {{ auth.tradeLimitUsed }}/{{ auth.tradeLimitMax }}</span>
          </template>
        </div>
      </div>

      <RouterLink v-if="!auth.isPremium" :to="{ name: 'payment', query: { plan: 'monthly' } }"
        class="shrink-0 inline-flex items-center justify-center rounded-xl bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400">
        Upgrade
      </RouterLink>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Menu, Moon, Sun } from 'lucide-vue-next'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { toastService } from '@/utils/toast'
import { getStoredTheme, toggleTheme } from '@/utils/theme'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const currentTheme = ref(getStoredTheme())
const pageTitle = computed(() => route.meta.title || 'Dashboard')

onMounted(async () => {
  if (auth.token && !auth.planStatus) {
    try {
      await auth.fetchPlanStatus()
    } catch {
      toastService.error('Server error. Please check your connection or try again later.')
    }
  }
})

function handleToggleTheme() {
  currentTheme.value = toggleTheme()
}

function formatShortDate(value) {
  if (!value) return ''

  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

async function logout() {
  const toastId = toastService.loading('Signing out...')

  try {
    await auth.logout()
    toastService.dismiss(toastId)
    toastService.success('Logout successful')
    router.push('/login')
  } catch {
    toastService.dismiss(toastId)
    toastService.error('Failed to logout.')
  }
}
</script>

<style scoped>
.header-bar {
  border-bottom: 1px solid var(--header-border);
  background: var(--header-bg);
}

.header-title {
  color: var(--header-title);
}

.header-icon-btn,
.header-action-btn {
  border: 1px solid var(--header-btn-border);
  background: var(--header-btn-bg);
  color: var(--header-btn-text);
}

.header-icon-btn:hover,
.header-action-btn:hover {
  border-color: var(--header-btn-border-hover);
  color: var(--header-btn-text-hover);
}

.header-plan-badge {
  border-color: var(--header-badge-border);
  background: var(--header-badge-bg);
  color: var(--header-badge-text);
}

.header-meta-text {
  color: var(--header-meta);
}
</style>