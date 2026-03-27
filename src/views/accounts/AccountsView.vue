<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="min-w-0">
        <h1 class="page-title text-2xl font-bold">Accounts</h1>
        <p class="page-subtitle mt-1 text-sm">
          Your account is your starting capital. All performance is tracked through trades - not by changing account
          balances.
        </p>
      </div>

      <BaseButton class="w-full sm:w-auto" @click="openCreateModal">
        Create Account
      </BaseButton>
    </div>

    <BaseCard v-if="accountStore.detail">
      <h2 class="section-title mb-4 text-lg font-semibold">Account Detail</h2>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div class="surface-soft rounded-xl p-4">
          <p class="page-subtitle text-sm">Name</p>
          <p class="page-title mt-1 break-words text-sm font-medium">
            {{ accountStore.detail.name }}
          </p>
        </div>

        <div class="surface-soft rounded-xl p-4">
          <p class="page-subtitle text-sm">Type</p>
          <p class="page-title mt-1 text-sm font-medium">
            {{ formatType(accountStore.detail.type) }}
          </p>
        </div>

        <div class="surface-soft rounded-xl p-4">
          <p class="page-subtitle text-sm">Currency</p>
          <p class="page-title mt-1 text-sm font-medium">
            {{ accountStore.detail.currency }}
          </p>
        </div>

        <div class="surface-soft rounded-xl p-4">
          <p class="page-subtitle text-sm">Initial Balance</p>
          <p class="page-title mt-1 break-words text-sm font-medium">
            {{ formatCurrency(accountStore.detail.initial_balance, accountStore.detail.currency) }}
          </p>
        </div>
      </div>
    </BaseCard>

    <div v-if="accountStore.loading" class="surface-soft rounded-2xl p-6 page-subtitle">
      Loading accounts...
    </div>

    <template v-else>
      <div v-if="accountStore.items.length" class="hidden md:block">
        <AccountTable :items="accountStore.items" @view="handleView" @edit="handleEdit" @delete="handleDelete" />
      </div>

      <div v-if="accountStore.items.length" class="md:hidden">
        <AccountCardList :items="accountStore.items" @view="handleView" @edit="handleEdit" @delete="handleDelete" />
      </div>

      <div v-if="!accountStore.items.length" class="surface-soft rounded-2xl p-6 text-center page-subtitle">
        No accounts found.
      </div>
    </template>

    <AccountFormModal :open="modalOpen" :account="selectedAccount" :loading="formLoading" @close="closeModal"
      @submit="handleSubmit" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AccountFormModal from '@/components/accounts/AccountFormModal.vue'
import AccountTable from '@/components/accounts/AccountTable.vue'
import AccountCardList from '@/components/accounts/AccountCardList.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import { useAccountStore } from '@/stores/account.store'
import { useAuthStore } from '@/stores/auth.store'
import { toastService } from '@/utils/toast'
import { formatCurrency } from '@/utils/formatters'

const router = useRouter()
const accountStore = useAccountStore()
const authStore = useAuthStore()

const modalOpen = ref(false)
const formLoading = ref(false)
const selectedAccount = ref(null)

onMounted(async () => {
  accountStore.reset()

  try {
    await accountStore.getAll()
  } catch (error) {
    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to load accounts.'
    )
  }
})

function openCreateModal() {
  selectedAccount.value = null
  modalOpen.value = true
}

function formatType(type) {
  if (type === 'intra_day') return 'Intra Day'
  if (!type) return '-'
  return type.charAt(0).toUpperCase() + type.slice(1)
}

function handleUpgradeRequired(error) {
  const response = error.response?.data

  if (response?.upgrade_required) {
    toastService.error(
      response.message?.id || 'Upgrade ke Pro diperlukan untuk melanjutkan.'
    )
    router.push({ name: 'payment', query: { plan: 'monthly' } })
    return true
  }

  return false
}

async function handleView(id) {
  const toastId = toastService.loading('Loading account detail...')

  try {
    await accountStore.getOne(id)
    toastService.dismiss(toastId)
    toastService.success('Account detail loaded successfully.')
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to load account detail.'
    )
  }
}

async function handleEdit(id) {
  const toastId = toastService.loading('Loading account for editing...')

  try {
    const res = await accountStore.getOne(id)
    selectedAccount.value = res.data.data
    modalOpen.value = true
    toastService.dismiss(toastId)
  } catch (error) {
    toastService.dismiss(toastId)

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to load account.'
    )
  }
}

async function handleDelete(id) {
  const toastId = toastService.loading('Deleting account...')

  try {
    await accountStore.remove(id)
    await accountStore.getAll()
    await authStore.fetchPlanStatus()

    if (accountStore.detail?.id === id) {
      accountStore.detail = null
    }

    toastService.dismiss(toastId)
    toastService.success('Account deleted successfully.')
  } catch (error) {
    toastService.dismiss(toastId)

    if (handleUpgradeRequired(error)) {
      return
    }

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to delete account.'
    )
  }
}

async function handleSubmit(payload) {
  formLoading.value = true

  const toastId = toastService.loading(
    selectedAccount.value?.id ? 'Updating account...' : 'Creating account...'
  )

  try {
    if (selectedAccount.value?.id) {
      await accountStore.update(selectedAccount.value.id, payload)
      toastService.dismiss(toastId)
      toastService.success('Account updated successfully.')
    } else {
      await accountStore.create(payload)
      toastService.dismiss(toastId)
      toastService.success('Account created successfully.')
    }

    await accountStore.getAll()
    await authStore.fetchPlanStatus()

    if (selectedAccount.value?.id) {
      await accountStore.getOne(selectedAccount.value.id)
    }

    closeModal()
  } catch (error) {
    toastService.dismiss(toastId)

    if (handleUpgradeRequired(error)) {
      return
    }

    const response = error.response?.data
    toastService.error(
      response?.message?.id ||
      response?.message?.en ||
      'Failed to save account.'
    )
  } finally {
    formLoading.value = false
  }
}

function closeModal() {
  modalOpen.value = false
  selectedAccount.value = null
}
</script>

<style scoped>
.page-title {
  color: var(--text-title);
}

.section-title {
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