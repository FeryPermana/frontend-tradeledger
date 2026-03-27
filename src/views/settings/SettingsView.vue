<template>
    <div class="space-y-6">
        <div class="min-w-0">
            <h1 class="page-title text-2xl font-bold">Settings</h1>
            <p class="page-subtitle mt-1 text-sm">
                Manage your profile, base currency, and account security.
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
})

const profileErrors = reactive({
    name: '',
    base_currency: '',
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
    profileForm.name = store.profile?.name ?? ''
    profileForm.email = store.profile?.email ?? ''
    profileForm.base_currency = store.profile?.base_currency ?? 'IDR'
}

function resetProfileErrors() {
    profileErrors.name = ''
    profileErrors.base_currency = ''
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

    if (profileErrors.name || profileErrors.base_currency) {
        toastService.error('Please complete the profile form correctly.')
        return
    }

    const toastId = toastService.loading('Saving profile...')

    try {
        await store.saveProfile({
            name: profileForm.name,
            base_currency: profileForm.base_currency,
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
</style>