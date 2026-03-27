<template>
    <div class="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl text-center">
            <h1 class="text-2xl font-bold">Verification Failed</h1>
            <p class="mt-3 text-sm text-slate-400">
                This verification link is invalid or has expired.
            </p>

            <div class="mt-6">
                <BaseButton block @click="goToVerifyPage">
                    Back to Verification Page
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()

function goToVerifyPage() {
    router.push('/verify-email')
}
</script>