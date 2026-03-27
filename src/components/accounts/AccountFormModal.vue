<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/60 px-4 py-4 sm:px-6">
    <div class="flex min-h-full items-center justify-center">
      <div class="modal-panel flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl shadow-2xl">
        <div class="modal-header flex items-center justify-between px-5 py-4 sm:px-6">
          <h3 class="modal-title text-lg font-semibold sm:text-xl">
            {{ isEdit ? 'Edit Account' : 'Create Account' }}
          </h3>

          <button type="button" class="modal-close rounded-xl px-3 py-2 text-sm transition" @click="$emit('close')">
            ✕
          </button>
        </div>

        <div class="overflow-y-auto px-5 py-5 sm:px-6">
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <BaseInput v-model="form.name" label="Name" placeholder="Binance USD" :error="errors.name" />

            <BaseSelect v-model="form.type" label="Type" placeholder="Select account type" :options="ACCOUNT_TYPES"
              :error="errors.type" />

            <BaseSelect v-model="form.currency" label="Currency" placeholder="Select currency"
              :options="ACCOUNT_CURRENCIES" :error="errors.currency" />

            <BaseInput v-model="form.initial_balance" label="Initial Balance" type="number" placeholder="Use dot (.) for decimals. Do not use thousand separators."
              :error="errors.initial_balance" />

            <div class="modal-preview rounded-xl px-4 py-3 text-sm">
              <p class="modal-preview-label text-xs uppercase tracking-wide">Preview</p>
              <p class="modal-preview-value mt-1 break-words text-base font-semibold">
                {{ previewBalance }}
              </p>
            </div>

            <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <BaseButton type="button" variant="secondary" class="w-full sm:w-auto" @click="$emit('close')">
                Cancel
              </BaseButton>

              <BaseButton type="submit" class="w-full sm:w-auto" :loading="loading">
                {{ isEdit ? 'Update Account' : 'Create Account' }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { ACCOUNT_CURRENCIES, ACCOUNT_TYPES } from '@/constants/account'
import { formatCurrency } from '@/utils/formatters'
import { toastService } from '@/utils/toast'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  account: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'submit'])

const isEdit = computed(() => !!props.account?.id)

const form = reactive({
  name: '',
  type: '',
  currency: 'IDR',
  initial_balance: '',
})

const errors = reactive({
  name: '',
  type: '',
  currency: '',
  initial_balance: '',
})

const previewBalance = computed(() => {
  return formatCurrency(form.initial_balance || 0, form.currency || 'IDR')
})

function resetForm() {
  form.name = props.account?.name || ''
  form.type = props.account?.type || ''
  form.currency = props.account?.currency || 'IDR'
  form.initial_balance = props.account?.initial_balance ?? ''
}

function resetErrors() {
  errors.name = ''
  errors.type = ''
  errors.currency = ''
  errors.initial_balance = ''
}

watch(
  () => props.account,
  () => {
    resetForm()
    resetErrors()
  },
  { immediate: true },
)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm()
      resetErrors()
    }
  },
)

function handleSubmit() {
  resetErrors()

  if (!form.name) errors.name = 'Name is required.'
  if (!form.type) errors.type = 'Type is required.'
  if (!form.currency) errors.currency = 'Currency is required.'

  if (form.initial_balance !== '' && Number(form.initial_balance) < 0) {
    errors.initial_balance = 'Initial balance must be 0 or more.'
  }

  if (errors.name || errors.type || errors.currency || errors.initial_balance) {
    toastService.error('Please complete the form correctly.')
    return
  }

  emit('submit', {
    name: form.name,
    type: form.type,
    currency: form.currency,
    initial_balance: form.initial_balance === '' ? 0 : Number(form.initial_balance),
  })
}
</script>

<style scoped>
.modal-panel {
  border: 1px solid var(--modal-border);
  background: var(--modal-bg);
}

.modal-header {
  border-bottom: 1px solid var(--modal-border);
}

.modal-title {
  color: var(--modal-title);
}

.modal-close {
  border: 1px solid var(--modal-close-border);
  background: var(--modal-close-bg);
  color: var(--modal-close-text);
}

.modal-close:hover {
  color: var(--modal-close-hover-text);
}

.modal-preview {
  border: 1px solid var(--modal-preview-border);
  background: var(--modal-preview-bg);
}

.modal-preview-label {
  color: var(--modal-preview-label);
}

.modal-preview-value {
  color: var(--modal-preview-value);
}
</style>