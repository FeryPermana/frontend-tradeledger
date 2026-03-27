import { defineStore } from 'pinia'
import {
  fetchStrategies,
  fetchStrategy,
  createStrategy,
  updateStrategy,
  deleteStrategy,
} from '@/api/strategy.api'

export const useStrategyStore = defineStore('strategy', {
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

    async getAll(params = {}) {
      this.loading = true

      try {
        const res = await fetchStrategies(params)
        this.items = res.data?.data ?? [];
        return res
      } finally {
        this.loading = false
      }
    },

    async getOne(id) {
      this.loading = true

      try {
        const res = await fetchStrategy(id)
        this.detail = res.data.data
        return res
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      return await createStrategy(payload)
    },

    async update(id, payload) {
      return await updateStrategy(id, payload)
    },

    async remove(id) {
      return await deleteStrategy(id)
    },
  },
})
