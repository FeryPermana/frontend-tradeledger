<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="block text-sm font-medium base-textarea-label">
      {{ label }}
    </label>

    <div class="base-textarea-wrapper group flex flex-col overflow-hidden rounded-xl transition"
      :class="{ 'base-textarea-error': error }">
      <div class="base-textarea-toolbar flex items-center gap-1 border-b px-2 py-1.5">
        <button type="button" class="base-textarea-tool-btn rounded p-1.5 transition" @click="applyStyle('bold')">
          <Bold class="h-4 w-4" />
        </button>

        <button type="button" class="base-textarea-tool-btn rounded p-1.5 transition" @click="applyStyle('italic')">
          <Italic class="h-4 w-4" />
        </button>

        <div class="base-textarea-divider mx-1 h-4 w-px"></div>

        <button type="button" class="base-textarea-tool-btn rounded p-1.5 transition" @click="applyStyle('list')">
          <List class="h-4 w-4" />
        </button>

        <span class="ml-auto pr-2 text-[10px] font-mono uppercase tracking-widest base-textarea-meta text-right">
          Editor
        </span>
      </div>

      <textarea :id="id" :value="modelValue" :placeholder="placeholder" :rows="rows"
        class="base-textarea-field w-full resize-none px-4 py-3 text-sm outline-none"
        @input="$emit('update:modelValue', $event.target.value)"></textarea>

      <div class="base-textarea-footer flex justify-between px-4 py-1.5 text-[10px]">
        <span>Markdown Supported</span>
        <span>{{ modelValue?.length || 0 }} Chars</span>
      </div>
    </div>

    <p v-if="error" class="text-sm text-red-400">{{ error }}</p>
  </div>
</template>

<script setup>
import { Bold, Italic, List } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  id: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  rows: { type: Number, default: 5 },
  error: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const applyStyle = (type) => {
  let text = props.modelValue

  if (type === 'bold') text += '**teks**'
  if (type === 'italic') text += '_teks_'
  if (type === 'list') text += '\n- Item'

  emit('update:modelValue', text)
}
</script>

<style scoped>
.base-textarea-label {
  color: var(--input-label);
}

.base-textarea-wrapper {
  border: 1px solid var(--textarea-border);
  background: var(--textarea-bg);
}

.base-textarea-wrapper:focus-within {
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 2px var(--input-focus-ring);
}

.base-textarea-error {
  border-color: #ef4444;
}

.base-textarea-toolbar {
  border-color: var(--textarea-divider);
  background: var(--textarea-toolbar-bg);
}

.base-textarea-tool-btn {
  color: var(--textarea-tool-color);
}

.base-textarea-tool-btn:hover {
  background: var(--textarea-tool-hover-bg);
  color: var(--textarea-tool-hover-color);
}

.base-textarea-divider {
  background: var(--textarea-divider);
}

.base-textarea-meta {
  color: var(--textarea-meta);
}

.base-textarea-field {
  background: transparent;
  color: var(--input-text);
}

.base-textarea-field::placeholder {
  color: var(--input-placeholder);
}

.base-textarea-footer {
  background: var(--textarea-footer-bg);
  color: var(--textarea-meta);
}

textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-thumb {
  background: var(--textarea-scrollbar);
  border-radius: 10px;
}
</style>