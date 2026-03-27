<template>
    <div class="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
        <div class="mx-auto max-w-5xl">
            <div class="mb-8">
                <h1 class="text-3xl font-bold">Upgrade to Pro</h1>
                <p class="mt-2 text-sm text-slate-400">
                    Transfer ke SeaBank, lalu upload bukti pembayaran untuk aktivasi.
                </p>
            </div>

            <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div class="space-y-6">
                    <div class="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <h2 class="text-lg font-semibold">1. Pilih paket</h2>

                        <div class="mt-4 grid gap-4 sm:grid-cols-3">
                            <button type="button"
                                class="relative rounded-2xl border p-5 text-left transition-all duration-200" :class="form.plan === '3_months'
                                    ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/40'
                                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'"
                                @click="form.plan = '3_months'">
                                <div class="flex items-center justify-between">
                                    <div class="text-sm text-slate-400">Pro 3 Bulan</div>
                                    <span class="text-[10px] font-semibold text-emerald-400">Starter</span>
                                </div>
                                <div class="mt-2 text-2xl font-bold text-white">Rp 60.000</div>
                                <div class="text-sm text-slate-500">3 bulan akses</div>
                            </button>

                            <button type="button"
                                class="relative rounded-2xl border p-5 text-left transition-all duration-200" :class="form.plan === '8_months'
                                    ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/40'
                                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'"
                                @click="form.plan = '8_months'">
                                <div class="flex items-center justify-between">
                                    <div class="text-sm text-slate-400">Pro 8 Bulan</div>
                                    <span
                                        class="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                                        Smart Choice
                                    </span>
                                </div>

                                <div class="mt-2 text-2xl font-bold text-white">Rp 150.000</div>
                                <div class="text-sm text-slate-500">8 bulan akses</div>
                            </button>

                            <button type="button"
                                class="relative rounded-2xl border p-5 text-left transition-all duration-200" :class="form.plan === '12_months'
                                    ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/40'
                                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'"
                                @click="form.plan = '12_months'">
                                <div class="flex items-center justify-between">
                                    <div class="text-sm text-slate-400">Pro 1 Tahun</div>
                                    <span class="text-[10px] font-semibold text-emerald-400">Best Value</span>
                                </div>
                                <div class="mt-2 text-2xl font-bold text-white">Rp 250.000</div>
                                <div class="text-sm text-slate-500">12 bulan akses</div>
                            </button>
                        </div>
                    </div>

                    <div class="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <h2 class="text-lg font-semibold">2. Transfer ke SeaBank</h2>

                        <div class="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                            <div class="text-sm text-slate-400">Bank</div>
                            <div class="mt-1 text-lg font-semibold">SeaBank</div>

                            <div class="mt-4 text-sm text-slate-400">No Rekening</div>
                            <div class="mt-1 text-xl font-bold">901207452843</div>

                            <div class="mt-4 text-sm text-slate-400">Atas Nama</div>
                            <div class="mt-1 text-lg font-semibold">Muhammad Pandi Ferry Permana</div>
                        </div>
                    </div>

                    <div class="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                        <h2 class="text-lg font-semibold">3. Upload bukti</h2>

                        <input type="file" class="mt-4 w-full text-sm" @change="handleFile" />

                        <p v-if="error" class="mt-2 text-sm text-red-400">
                            {{ error }}
                        </p>

                        <button type="button"
                            class="mt-4 w-full rounded-xl bg-cyan-500 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
                            @click="submit" :disabled="loading">
                            {{ loading ? 'Mengirim...' : 'Kirim Bukti' }}
                        </button>
                    </div>
                </div>

                <div class="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                    <h2 class="text-lg font-semibold">Status pembayaran</h2>

                    <div v-if="payments.length" class="mt-4 space-y-3">
                        <div v-for="p in payments" :key="p.id" class="rounded-xl border border-slate-800 p-4">
                            <div class="flex justify-between gap-4">
                                <div>
                                    <div class="font-medium">
                                        {{ formatPlan(p.plan) }}
                                    </div>
                                    <div class="text-sm text-slate-400">
                                        Rp {{ formatNumber(p.amount) }}
                                    </div>
                                </div>

                                <span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
                                    :class="statusClass(p.status)">
                                    {{ formatStatus(p.status) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <p v-else class="mt-4 text-sm text-slate-400">
                        Belum ada pembayaran
                    </p>
                </div>
            </div>
        </div>

        <FloatingWhatsApp text="Hai, saya mau tanya tentang pembayaran TradeLedger." />
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import paymentApi from '@/api/payment.api'
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp.vue'

const route = useRoute()

const validPlans = ['3_months', '8_months', '12_months']

const form = reactive({
    plan: '8_months',
    file: null,
})

const payments = ref([])
const loading = ref(false)
const error = ref('')

function handleFile(e) {
    form.file = e.target.files?.[0] || null
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString('id-ID')
}

function formatPlan(plan) {
    if (plan === '3_months') return 'Pro 3 Bulan'
    if (plan === '8_months') return 'Pro 8 Bulan'
    if (plan === '12_months') return 'Pro 1 Tahun'
    return plan
}

function formatStatus(status) {
    if (status === 'pending') return 'Pending'
    if (status === 'approved') return 'Approved'
    if (status === 'rejected') return 'Rejected'
    return status
}

function statusClass(status) {
    if (status === 'approved') {
        return 'bg-emerald-500/10 text-emerald-400'
    }

    if (status === 'rejected') {
        return 'bg-red-500/10 text-red-400'
    }

    return 'bg-amber-500/10 text-amber-400'
}

async function fetchPayments() {
    const res = await paymentApi.getMyPayments()
    payments.value = res.data
}

async function submit() {
    error.value = ''

    if (!form.file) {
        error.value = 'Upload bukti dulu'
        return
    }

    loading.value = true

    try {
        const fd = new FormData()
        fd.append('plan', form.plan)
        fd.append('proof_image', form.file)

        await paymentApi.submitPayment(fd)

        await fetchPayments()
        form.file = null
    } catch (e) {
        error.value = 'Gagal kirim'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    const queryPlan = String(route.query.plan || '')

    if (validPlans.includes(queryPlan)) {
        form.plan = queryPlan
    } else {
        form.plan = '8_months'
    }

    fetchPayments()
})
</script>