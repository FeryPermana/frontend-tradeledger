<template>
    <div v-if="modelValue" class="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4"
        @click.self="handleClose">
        <div class="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-slate-900 p-6 shadow-2xl">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <div
                        class="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        Limited Offer
                    </div>

                    <h2 class="mt-4 text-2xl font-bold text-white">
                        Free PRO 3 Bulan
                    </h2>

                    <p class="mt-3 text-sm leading-6 text-slate-300">
                        Untuk <span class="font-semibold text-white">10 user pertama</span>.
                        Langsung chat admin untuk cek apakah slot gratis masih tersedia.
                    </p>
                </div>

                <button type="button"
                    class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    @click="handleClose">
                    ✕
                </button>
            </div>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row">
                <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer"
                    class="inline-flex flex-1 items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                    Claim Sekarang
                </a>

                <button type="button"
                    class="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
                    @click="handleClose">
                    Tutup
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        default: '6285921939896',
    },
    text: {
        type: String,
        default: 'Hai, apakah slot free TradeLedger masih ada?',
    },
})

const emit = defineEmits(['update:modelValue', 'close'])

const whatsappUrl = computed(() => {
    return `https://wa.me/${props.phone}?text=${encodeURIComponent(props.text)}`
})

function handleClose() {
    emit('update:modelValue', false)
    emit('close')
}
</script>