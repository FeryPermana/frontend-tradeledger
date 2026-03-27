<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/60 px-4 py-4 sm:px-6">
    <div class="flex min-h-full items-center justify-center">
      <div class="modal-panel flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl shadow-2xl">
        <div class="modal-header flex items-center justify-between px-5 py-4 sm:px-6">
          <h3 class="modal-title text-lg font-semibold sm:text-xl">
            {{ isEdit ? 'Edit Strategy' : 'Create Strategy' }}
          </h3>

          <button type="button" class="modal-close rounded-xl px-3 py-2 text-sm transition" @click="$emit('close')">
            ✕
          </button>
        </div>

        <div class="overflow-y-auto px-5 py-5 sm:px-6">
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <BaseInput v-model="form.name" label="Name" placeholder="Breakout" :error="errors.name" />

            <BaseTextarea v-model="form.description" label="Strategy Description"
              placeholder="Contoh: Breakout resistance dengan volume konfirmasi..." :error="errors.description" />

            <BaseSelect v-model="form.timeframe" label="Timeframe" placeholder="Select timeframe"
              :options="STRATEGY_TIMEFRAMES" :error="errors.timeframe" />

            <BaseSelect v-model="form.setup_type" label="Setup Type" placeholder="Select setup type"
              :options="STRATEGY_SETUP_TYPES" :error="errors.setup_type" />

            <BaseSelect v-model="form.risk_model" label="Risk Model" placeholder="Select risk model"
              :options="STRATEGY_RISK_MODELS" :error="errors.risk_model" />

            <div class="modal-preview rounded-xl px-4 py-3 text-sm">
              <p class="modal-preview-label text-xs uppercase tracking-wide">
                Preview
              </p>

              <div class="mt-2 flex flex-wrap items-center gap-2">
                <span class="modal-preview-value font-semibold">
                  {{ form.name || 'Unnamed Strategy' }}
                </span>

                <span v-if="form.timeframe" class="badge-neutral rounded-full border px-2 py-0.5 text-xs">
                  {{ form.timeframe }}
                </span>

                <span v-if="form.setup_type" class="badge-neutral rounded-full border px-2 py-0.5 text-xs">
                  {{ formatLabel(form.setup_type) }}
                </span>
              </div>
            </div>

            <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <BaseButton type="button" variant="secondary" class="w-full sm:w-auto" @click="$emit('close')">
                Cancel
              </BaseButton>

              <BaseButton type="submit" class="w-full sm:w-auto" :loading="loading">
                {{ isEdit ? 'Update Strategy' : 'Create Strategy' }}
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
import BaseTextarea from '@/components/common/BaseTextarea.vue'
import {
  STRATEGY_RISK_MODELS,
  STRATEGY_SETUP_TYPES,
  STRATEGY_TIMEFRAMES,
} from '@/constants/strategy'
import { toastService } from '@/utils/toast'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  strategy: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'submit'])

const isEdit = computed(() => !!props.strategy?.id)

const form = reactive({
  name: '',
  description: '',
  timeframe: '',
  setup_type: '',
  risk_model: '',
})

const errors = reactive({
  name: '',
  description: '',
  timeframe: '',
  setup_type: '',
  risk_model: '',
})

function resetForm() {
  form.name = props.strategy?.name || ''
  form.description = props.strategy?.description || ''
  form.timeframe = props.strategy?.timeframe || ''
  form.setup_type = props.strategy?.setup_type || ''
  form.risk_model = props.strategy?.risk_model || ''
}

function resetErrors() {
  errors.name = ''
  errors.description = ''
  errors.timeframe = ''
  errors.setup_type = ''
  errors.risk_model = ''
}

watch(
  () => props.strategy,
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

  if (errors.name) {
    toastService.error('Please complete the form correctly.')
    return
  }

  emit('submit', {
    name: form.name,
    description: form.description || null,
    timeframe: form.timeframe || null,
    setup_type: form.setup_type || null,
    risk_model: form.risk_model || null,
  })
}

function formatLabel(value) {
  if (!value) return ''
  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
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

.badge-neutral {
  border-color: var(--badge-neutral-border);
  background: var(--badge-neutral-bg);
  color: var(--badge-neutral-text);
}
</style>