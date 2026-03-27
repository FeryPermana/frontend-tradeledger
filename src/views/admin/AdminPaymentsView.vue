<template>
    <div class="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
        <div class="mx-auto max-w-7xl">
            <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 class="text-2xl font-bold">Payment Review</h1>
                    <p class="mt-1 text-sm text-slate-400">
                        Cari, filter, dan review payment dengan lebih cepat.
                    </p>
                </div>
            </div>

            <div class="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                    <div class="xl:col-span-2">
                        <label class="mb-2 block text-sm text-slate-400">Search</label>
                        <input v-model="filters.search" type="text" placeholder="Cari nama atau email..."
                            class="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500"
                            @input="handleFilterChange" />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm text-slate-400">Status</label>
                        <select v-model="filters.status"
                            class="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-500"
                            @change="handleFilterChange">
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label class="mb-2 block text-sm text-slate-400">Plan</label>
                        <select v-model="filters.plan"
                            class="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-500"
                            @change="handleFilterChange">
                            <option value="all">All</option>
                            <option value="3_months">3 Bulan</option>
                            <option value="8_months">8 Bulan</option>
                            <option value="12_months">1 Tahun</option>
                        </select>
                    </div>

                    <div>
                        <label class="mb-2 block text-sm text-slate-400">From</label>
                        <input v-model="filters.date_from" type="date"
                            class="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-500"
                            @change="handleFilterChange" />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm text-slate-400">To</label>
                        <input v-model="filters.date_to" type="date"
                            class="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-500"
                            @change="handleFilterChange" />
                    </div>
                </div>

                <div class="mt-4 flex flex-wrap items-center gap-3">
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-slate-400">Per page</label>
                        <select v-model="filters.per_page"
                            class="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
                            @change="handleFilterChange">
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                        </select>
                    </div>

                    <button type="button"
                        class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                        @click="resetFilters">
                        Reset Filters
                    </button>
                </div>
            </div>

            <div v-if="loading" class="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
                Loading payments...
            </div>

            <div v-else-if="payments.length" class="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-slate-800">
                        <thead class="bg-slate-950/60">
                            <tr>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    User</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Plan</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Amount</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Method</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Status</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Date</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Proof</th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Action</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-slate-800">
                            <tr v-for="p in payments" :key="p.id" class="hover:bg-slate-950/30">
                                <td class="px-4 py-4 align-top">
                                    <div class="font-medium text-white">{{ p.user?.name }}</div>
                                    <div class="text-sm text-slate-400">{{ p.user?.email }}</div>
                                </td>

                                <td class="px-4 py-4 align-top text-sm text-slate-300">
                                    {{ formatPlan(p.plan) }}
                                </td>

                                <td class="px-4 py-4 align-top text-sm text-slate-300">
                                    {{ formatRupiah(p.amount) }}
                                </td>

                                <td class="px-4 py-4 align-top text-sm text-slate-300">
                                    {{ p.method }}
                                </td>

                                <td class="px-4 py-4 align-top">
                                    <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                                        :class="statusClass(p.status)">
                                        {{ formatStatus(p.status) }}
                                    </span>
                                </td>

                                <td class="px-4 py-4 align-top text-sm text-slate-300">
                                    {{ formatDate(p.paid_at || p.created_at) }}
                                </td>

                                <td class="px-4 py-4 align-top">
                                    <button type="button"
                                        class="rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-800"
                                        @click="openProof(p)">
                                        View
                                    </button>
                                </td>

                                <td class="px-4 py-4 align-top">
                                    <div v-if="p.status === 'pending'" class="flex flex-wrap gap-2">
                                        <button
                                            class="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-black transition hover:bg-emerald-400"
                                            @click="approve(p.id)">
                                            Approve
                                        </button>

                                        <button
                                            class="rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-400"
                                            @click="reject(p.id)">
                                            Reject
                                        </button>
                                    </div>

                                    <span v-else class="text-xs text-slate-500">
                                        Reviewed
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-else class="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
                Tidak ada payment yang cocok dengan filter.
            </div>

            <div v-if="pagination.last_page > 1"
                class="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div class="text-sm text-slate-400">
                    Showing {{ pagination.from || 0 }} - {{ pagination.to || 0 }}
                    of {{ pagination.total }} payments
                </div>

                <div class="flex flex-wrap items-center gap-2">
                    <button type="button"
                        class="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="pagination.current_page === 1" @click="changePage(pagination.current_page - 1)">
                        Prev
                    </button>

                    <button v-for="page in visiblePages" :key="page" type="button"
                        class="rounded-xl px-3 py-2 text-sm transition" :class="page === pagination.current_page
                            ? 'bg-cyan-500 font-semibold text-slate-950'
                            : 'border border-slate-700 text-slate-200 hover:bg-slate-800'" @click="changePage(page)">
                        {{ page }}
                    </button>

                    <button type="button"
                        class="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="pagination.current_page === pagination.last_page"
                        @click="changePage(pagination.current_page + 1)">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <div v-if="selectedProof" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            @click.self="selectedProof = null">
            <div class="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-white">Payment Proof</h2>
                    <button type="button"
                        class="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                        @click="selectedProof = null">
                        Close
                    </button>
                </div>

                <img :src="selectedProof" alt="Payment proof preview"
                    class="max-h-[75vh] w-full rounded-xl border border-slate-800 object-contain" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import paymentApi from '@/api/payment.api'
import { toastService } from '@/utils/toast'

const loading = ref(false)
const payments = ref([])
const selectedProof = ref(null)

const filters = reactive({
    search: '',
    status: 'all',
    plan: 'all',
    date_from: '',
    date_to: '',
    per_page: 10,
    page: 1,
})

const pagination = reactive({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0,
})

let searchTimeout = null

const visiblePages = computed(() => {
    const total = pagination.last_page
    const current = pagination.current_page
    const pages = []

    let start = Math.max(1, current - 2)
    let end = Math.min(total, current + 2)

    if (current <= 3) {
        end = Math.min(total, 5)
    }

    if (current >= total - 2) {
        start = Math.max(1, total - 4)
    }

    for (let i = start; i <= end; i += 1) {
        pages.push(i)
    }

    return pages
})

function formatRupiah(val) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(val)
}

function formatDate(value) {
    if (!value) return '-'

    return new Date(value).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
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
    if (status === 'approved') return 'bg-emerald-500/10 text-emerald-300'
    if (status === 'rejected') return 'bg-red-500/10 text-red-300'
    return 'bg-amber-500/10 text-amber-300'
}

function getImageUrl(path) {
    return `${import.meta.env.VITE_APP_URL}/storage/${path}`
}

function openProof(payment) {
    selectedProof.value = getImageUrl(payment.proof_image)
}

async function fetchPayments() {
    loading.value = true

    try {
        const res = await paymentApi.getAdminPayments({
            search: filters.search,
            status: filters.status,
            plan: filters.plan,
            date_from: filters.date_from,
            date_to: filters.date_to,
            per_page: filters.per_page,
            page: filters.page,
        })

        payments.value = res.data.data || []

        pagination.current_page = res.data.current_page
        pagination.last_page = res.data.last_page
        pagination.per_page = res.data.per_page
        pagination.total = res.data.total
        pagination.from = res.data.from
        pagination.to = res.data.to
    } catch {
        toastService.error('Failed to load payments')
    } finally {
        loading.value = false
    }
}

function handleFilterChange() {
    filters.page = 1

    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        fetchPayments()
    }, 300)
}

function resetFilters() {
    filters.search = ''
    filters.status = 'all'
    filters.plan = 'all'
    filters.date_from = ''
    filters.date_to = ''
    filters.per_page = 10
    filters.page = 1
    fetchPayments()
}

function changePage(page) {
    filters.page = page
    fetchPayments()
}

async function approve(id) {
    const toastId = toastService.loading('Approving...')
    try {
        await paymentApi.approvePayment(id)
        toastService.success('Approved')
        await fetchPayments()
    } catch {
        toastService.error('Failed approve')
    } finally {
        toastService.dismiss(toastId)
    }
}

async function reject(id) {
    const toastId = toastService.loading('Rejecting...')
    try {
        await paymentApi.rejectPayment(id)
        toastService.success('Rejected')
        await fetchPayments()
    } catch {
        toastService.error('Failed reject')
    } finally {
        toastService.dismiss(toastId)
    }
}

onMounted(fetchPayments)
</script>