import {
    defineStore
} from 'pinia'
import {
    fetchAccounts,
    fetchAccount,
    createAccount,
    updateAccount,
    deleteAccount,
} from '@/api/account.api'

export const useAccountStore = defineStore('account', {
    state: () => ({
        items: [],
        detail: null,
        loading: false,
    }),

    actions: {
        reset() {
            this.items = []
            this.detail = null
            this.loading = false
        },

        async getAll() {
            this.loading = true
            try {
                const res = await fetchAccounts()
                this.items = res.data?.data ?? [];
                return res
            } finally {
                this.loading = false
            }
        },

        async getOne(id) {
            this.loading = true
            try {
                const res = await fetchAccount(id)
                this.detail = res.data.data
                return res
            } finally {
                this.loading = false
            }
        },

        async create(payload) {
            return await createAccount(payload)
        },

        async update(id, payload) {
            return await updateAccount(id, payload)
        },

        async remove(id) {
            return await deleteAccount(id)
        },
    },
})