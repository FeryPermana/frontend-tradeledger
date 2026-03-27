import { defineStore } from 'pinia'
import {
  fetchAnalyticsSummary,
  fetchStrategyPerformance,
  fetchTagPerformance,
  fetchMonthlyPerformance,
  fetchPortfolioSummary,
  fetchAssetAllocation,
} from '@/api/analytics.api'

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    summary: null,
    strategyPerformance: [],
    tagPerformance: [],
    monthlyPerformance: [],
    portfolioSummary: null,
    assetAllocation: [],
    loading: false,
  }),

  actions: {
    reset() {
      this.summary = null
      this.strategyPerformance = []
      this.tagPerformance = []
      this.monthlyPerformance = []
      this.portfolioSummary = null
      this.assetAllocation = []
      this.loading = false
    },

    async getSummary(params = {}) {
      const res = await fetchAnalyticsSummary(params)
      this.summary = res.data?.data ?? null
      return res
    },

    async getStrategyPerformance(params = {}) {
      const res = await fetchStrategyPerformance(params)
      this.strategyPerformance = res.data?.data ?? []
      return res
    },

    async getTagPerformance(params = {}) {
      const res = await fetchTagPerformance(params)
      this.tagPerformance = res.data?.data ?? []
      return res
    },

    async getMonthlyPerformance(params = {}) {
      const res = await fetchMonthlyPerformance(params)
      this.monthlyPerformance = res.data?.data ?? []
      return res
    },

    async getPortfolioSummary(params = {}) {
      const res = await fetchPortfolioSummary(params)
      this.portfolioSummary = res.data?.data ?? null
      return res
    },

    async getAssetAllocation(params = {}) {
      const res = await fetchAssetAllocation(params)
      this.assetAllocation = res.data?.data ?? []
      return res
    },

    async getDashboardData(params = {}) {
      this.loading = true

      try {
        await Promise.all([
          this.getSummary(params),
          this.getStrategyPerformance(params),
          this.getTagPerformance(params),
          this.getMonthlyPerformance(params),
          this.getPortfolioSummary(params),
          this.getAssetAllocation(params),
        ])
      } finally {
        this.loading = false
      }
    },
  },
})