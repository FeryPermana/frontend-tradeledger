<template>
    <div class="space-y-6">
        <div class="min-w-0">
            <h1 class="page-title text-2xl font-bold">Settings</h1>
            <p class="page-subtitle mt-1 text-sm">
                Manage your profile, base currency, account security, and real price sync.
            </p>
        </div>

        <div v-if="store.loading" class="settings-panel rounded-2xl p-6">
            Loading settings...
        </div>

        <template v-else>
            <div class="settings-card rounded-2xl p-5 shadow-xl sm:p-6">
                <div class="mb-6">
                    <h2 class="section-title text-lg font-semibold">Profile</h2>
                    <p class="page-subtitle mt-1 text-sm">
                        Update your basic account information and display currency.
                    </p>
                </div>

                <form class="space-y-4" @submit.prevent="submitProfile">
                    <BaseInput v-model="profileForm.name" label="Name" placeholder="Your name"
                        :error="profileErrors.name" />

                    <div class="space-y-2">
                        <label class="field-label block text-sm font-medium">
                            Email
                        </label>
                        <div class="settings-soft-card rounded-xl px-4 py-3 text-sm break-words">
                            {{ profileForm.email || '-' }}
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="field-label block text-sm font-medium">
                            Email Verification
                        </label>

                        <div class="flex items-center gap-2">
                            <span class="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium" :class="isEmailVerified
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'">
                                {{ isEmailVerified ? 'Verified' : 'Not Verified' }}
                            </span>
                        </div>
                    </div>

                    <BaseSelect v-model="profileForm.base_currency" label="Base Currency" placeholder="Select currency"
                        :options="currencyOptions" :error="profileErrors.base_currency" />

                    <div class="settings-soft-card rounded-2xl p-4 space-y-4">
                        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p class="section-title text-sm font-semibold">Auto Real Price Sync</p>
                                <p class="page-subtitle mt-1 text-sm">
                                    Choose up to 2 daily sync times for portfolio real price updates.
                                </p>
                            </div>

                            <label class="inline-flex items-center gap-2">
                                <input v-model="profileForm.price_sync_enabled" type="checkbox"
                                    class="h-4 w-4 rounded border-slate-600 bg-slate-900" />
                                <span class="field-label text-sm font-medium">Enable</span>
                            </label>
                        </div>

                        <div class="grid gap-4 md:grid-cols-2"
                            :class="{ 'opacity-60 pointer-events-none': !profileForm.price_sync_enabled }">
                            <div>
                                <label class="field-label mb-2 block text-sm font-medium">
                                    Sync Time 1
                                </label>
                                <input v-model="profileForm.price_sync_time_1" type="time" class="form-input" />
                            </div>

                            <div>
                                <label class="field-label mb-2 block text-sm font-medium">
                                    Sync Time 2
                                </label>
                                <input v-model="profileForm.price_sync_time_2" type="time" class="form-input" />
                            </div>
                        </div>

                        <p v-if="profileErrors.price_sync_times" class="text-sm text-red-400">
                            {{ profileErrors.price_sync_times }}
                        </p>

                        <p class="page-subtitle text-xs">
                            Supported markets: crypto, stock_idx, stock_us. Commodity is not supported yet.
                        </p>

                        <p v-if="store.profile?.last_price_sync_at" class="page-subtitle text-xs">
                            Last auto sync: {{ formatDateTime(store.profile.last_price_sync_at) }}
                        </p>
                    </div>

                    <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                        <BaseButton type="submit" class="w-full sm:w-auto" :loading="store.savingProfile">
                            Save Profile
                        </BaseButton>
                    </div>
                </form>
            </div>

            <div class="settings-card rounded-2xl p-5 shadow-xl sm:p-6">
                <div class="mb-6">
                    <h2 class="section-title text-lg font-semibold">Security</h2>
                    <p class="page-subtitle mt-1 text-sm">
                        Change your password securely.
                    </p>
                </div>

                <form class="space-y-4" @submit.prevent="submitPassword">
                    <BaseInput v-model="passwordForm.current_password" label="Current Password" type="password"
                        placeholder="Enter current password" :error="passwordErrors.current_password" />

                    <BaseInput v-model="passwordForm.new_password" label="New Password" type="password"
                        placeholder="Enter new password" :error="passwordErrors.new_password" />

                    <BaseInput v-model="passwordForm.new_password_confirmation" label="Confirm New Password"
                        type="password" placeholder="Repeat new password"
                        :error="passwordErrors.new_password_confirmation" />

                    <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                        <BaseButton type="submit" class="w-full sm:w-auto" :loading="store.savingPassword">
                            Update Password
                        </BaseButton>
                    </div>
                </form>
            </div>
        </template>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useSettingsStore } from '@/stores/settings.store'
import { toastService } from '@/utils/toast'

const store = useSettingsStore()

const profileForm = reactive({
    name: '',
    email: '',
    base_currency: '',
    price_sync_enabled: false,
    price_sync_time_1: '',
    price_sync_time_2: '',
})

const profileErrors = reactive({
    name: '',
    base_currency: '',
    price_sync_times: '',
})

const passwordForm = reactive({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
})

const passwordErrors = reactive({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
})

const currencyOptions = [
    { value: 'IDR', label: 'IDR' },
    { value: 'USD', label: 'USD' },
]

const isEmailVerified = computed(() => !!store.profile?.email_verified_at)

onMounted(async () => {
    await store.getProfile()
    syncProfileForm()
})

function syncProfileForm() {
    const times = Array.isArray(store.profile?.price_sync_times)
        ? store.profile.price_sync_times
        : []

    profileForm.name = store.profile?.name ?? ''
    profileForm.email = store.profile?.email ?? ''
    profileForm.base_currency = store.profile?.base_currency ?? 'IDR'
    profileForm.price_sync_enabled = !!store.profile?.price_sync_enabled
    profileForm.price_sync_time_1 = times[0] ?? ''
    profileForm.price_sync_time_2 = times[1] ?? ''
}

function resetProfileErrors() {
    profileErrors.name = ''
    profileErrors.base_currency = ''
    profileErrors.price_sync_times = ''
}

function resetPasswordErrors() {
    passwordErrors.current_password = ''
    passwordErrors.new_password = ''
    passwordErrors.new_password_confirmation = ''
}

async function submitProfile() {
    resetProfileErrors()

    if (!profileForm.name) {
        profileErrors.name = 'Name is required.'
    }

    if (!profileForm.base_currency) {
        profileErrors.base_currency = 'Base currency is required.'
    }

    const syncTimes = [
        profileForm.price_sync_time_1,
        profileForm.price_sync_time_2,
    ].filter(Boolean)

    const uniqueSyncTimes = [...new Set(syncTimes)]

    if (profileForm.price_sync_enabled) {
        if (!uniqueSyncTimes.length) {
            profileErrors.price_sync_times = 'Please select at least 1 sync time.'
        } else if (uniqueSyncTimes.length > 2) {
            profileErrors.price_sync_times = 'Maximum 2 sync times allowed.'
        }
    }

    if (
        profileErrors.name ||
        profileErrors.base_currency ||
        profileErrors.price_sync_times
    ) {
        toastService.error('Please complete the profile form correctly.')
        return
    }

    const toastId = toastService.loading('Saving profile...')

    try {
        await store.saveProfile({
            name: profileForm.name,
            base_currency: profileForm.base_currency,
            price_sync_enabled: profileForm.price_sync_enabled,
            price_sync_times: profileForm.price_sync_enabled ? uniqueSyncTimes : [],
        })

        syncProfileForm()

        toastService.dismiss(toastId)
        toastService.success('Profile updated successfully.')
    } catch (error) {
        toastService.dismiss(toastId)

        const message =
            error?.response?.data?.message?.en ||
            error?.response?.data?.message?.id ||
            'Failed to update profile.'

        toastService.error(message)
    }
}

async function submitPassword() {
    resetPasswordErrors()

    if (!passwordForm.current_password) {
        passwordErrors.current_password = 'Current password is required.'
    }

    if (!passwordForm.new_password) {
        passwordErrors.new_password = 'New password is required.'
    } else if (passwordForm.new_password.length < 8) {
        passwordErrors.new_password = 'New password must be at least 8 characters.'
    }

    if (!passwordForm.new_password_confirmation) {
        passwordErrors.new_password_confirmation = 'Password confirmation is required.'
    } else if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
        passwordErrors.new_password_confirmation = 'Password confirmation does not match.'
    }

    if (
        passwordErrors.current_password ||
        passwordErrors.new_password ||
        passwordErrors.new_password_confirmation
    ) {
        toastService.error('Please complete the password form correctly.')
        return
    }

    const toastId = toastService.loading('Updating password...')

    try {
        await store.savePassword({
            current_password: passwordForm.current_password,
            new_password: passwordForm.new_password,
            new_password_confirmation: passwordForm.new_password_confirmation,
        })

        passwordForm.current_password = ''
        passwordForm.new_password = ''
        passwordForm.new_password_confirmation = ''

        toastService.dismiss(toastId)
        toastService.success('Password updated successfully.')
    } catch (error) {
        toastService.dismiss(toastId)

        const message =
            error?.response?.data?.message?.en ||
            error?.response?.data?.message?.id ||
            'Failed to update password.'

        toastService.error(message)
    }
}

function formatDateTime(value) {
    if (!value) return '-'

    return new Date(value).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
}
</script>

<style scoped>
.page-title,
.section-title {
    color: var(--text-title);
}

.page-subtitle {
    color: var(--text-muted);
}

.field-label {
    color: var(--input-label);
}

.settings-panel,
.settings-card,
.settings-soft-card {
    border: 1px solid var(--surface-card-border);
    background: var(--surface-card-bg);
    color: var(--text-body);
}

.settings-soft-card {
    border-color: var(--surface-soft-border);
    background: var(--surface-soft-bg);
}

.form-input {
    width: 100%;
    border-radius: 1rem;
    border: 1px solid var(--surface-soft-border);
    background: var(--surface-soft-bg);
    color: var(--text-body);
    padding: 0.75rem 1rem;
    outline: none;
}

.form-input:focus {
    border-color: rgb(34 211 238 / 0.6);
    box-shadow: 0 0 0 3px rgb(34 211 238 / 0.12);
}
</style>