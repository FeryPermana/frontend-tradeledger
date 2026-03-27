import {
  defineStore
} from 'pinia'
import {
  fetchAssets,
  fetchAsset,
  createAsset,
  updateAsset,
  deleteAsset,
  toggleAssetWatchlist
} from '@/api/asset.api'

export const useAssetStore = defineStore('asset', {
  state: () => ({
    items: [],
    detail: null,
    loading: false,
    filters: {
      search: '',
      category: '',
      watchlist_only: false,
    },
  }),

  actions: {
    reset() {
      this.filters = {
        search: '',
        category: '',
        watchlist_only: false,
      }
    },

    async getAll(params = {}) {
      this.loading = true
      try {
        const res = await fetchAssets({
          ...this.filters,
          ...params,
        })
        this.items = res.data?.data ?? [];
        return res
      } finally {
        this.loading = false
      }
    },

    async getOne(id) {
      this.loading = true
      try {
        const res = await fetchAsset(id)
        this.detail = res.data.data
        return res
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      return await createAsset(payload)
    },

    async update(id, payload) {
      return await updateAsset(id, payload)
    },

    async remove(id) {
      return await deleteAsset(id)
    },

    async toggleWatchlist(id) {
      const item = this.items.find((i) => i.id === id)
      if (!item) return

      const oldValue = item.is_watchlist

      item.is_watchlist = !oldValue

      try {
        await toggleAssetWatchlist(id)
      } catch (e) {
        item.is_watchlist = oldValue
        throw e
      }
    }
  }
})