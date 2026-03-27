<template>
    <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer"
        class="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-3 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition hover:bg-emerald-400"
        aria-label="Chat admin if you have any issue">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="h-5 w-5 fill-current">
            <path
                d="M19.11 17.27c-.27-.14-1.58-.78-1.82-.87-.24-.09-.42-.14-.6.14-.18.27-.69.87-.85 1.05-.16.18-.31.2-.58.07-.27-.14-1.13-.42-2.16-1.34-.8-.71-1.34-1.58-1.49-1.85-.16-.27-.02-.41.12-.55.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.14-.6-1.45-.82-1.98-.22-.53-.44-.45-.6-.46-.16-.01-.34-.01-.53-.01-.18 0-.47.07-.71.34-.24.27-.93.91-.93 2.22 0 1.31.96 2.58 1.09 2.76.13.18 1.88 2.87 4.55 4.03.64.28 1.14.45 1.53.58.64.2 1.22.17 1.68.1.51-.08 1.58-.64 1.8-1.25.22-.62.22-1.15.16-1.25-.07-.11-.24-.18-.51-.32z" />
            <path
                d="M16.01 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.59 4.47 1.72 6.42L3.2 28.8l6.54-1.7a12.76 12.76 0 0 0 6.27 1.64h.01c7.07 0 12.8-5.73 12.8-12.8S23.08 3.2 16.01 3.2zm0 23.36h-.01a10.57 10.57 0 0 1-5.39-1.47l-.39-.23-3.88 1.01 1.03-3.79-.25-.39a10.58 10.58 0 1 1 8.89 4.87z" />
        </svg>

        <span class="hidden sm:inline">Chat admin if you have any issue</span>
    </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    phone: {
        type: String,
        default: '6285921939896',
    },
    text: {
        type: String,
        default: 'Hai, saya mau tanya tentang TradeLedger.',
    },
})

const whatsappUrl = computed(() => {
    return `https://wa.me/${props.phone}?text=${encodeURIComponent(props.text)}`
})
</script>