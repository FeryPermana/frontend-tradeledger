import { defineStore } from 'pinia'
import {
  fetchAnalyticsSummary,
  fetchStrategyPerformance,
  fetchTagPerformance,
  fetchMonthlyPerformance,
  fetchAssetPerformance,
  fetchPortfolioSummary,
  fetchAssetAllocation,
} from '@/api/analytics.api'

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    summary: null,
    strategyPerformance: [],
    tagPerformance: [],
    monthlyPerformance: [],
    assetPerformance: [],
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
      this.assetPerformance = []
      this.portfolioSummary = null
      this.assetAllocation = []
      this.loading = false
    },

    async getSummary(params = {}) {
      const res = await fetchAnalyticsSummary(params)
      this.summary = res.data?.data ?? null
      return this.summary
    },

    async getStrategyPerformance(params = {}) {
      const res = await fetchStrategyPerformance(params)
      this.strategyPerformance = res.data?.data ?? []
      return this.strategyPerformance
    },

    async getTagPerformance(params = {}) {
      const res = await fetchTagPerformance(params)
      this.tagPerformance = res.data?.data ?? []
      return this.tagPerformance
    },

    async getMonthlyPerformance(params = {}) {
      const res = await fetchMonthlyPerformance(params)
      this.monthlyPerformance = res.data?.data ?? []
      return this.monthlyPerformance
    },

    async getAssetPerformance(params = {}) {
      const res = await fetchAssetPerformance(params)
      this.assetPerformance = res.data?.data ?? []
      return this.assetPerformance
    },

    async getPortfolioSummary() {
      const res = await fetchPortfolioSummary()
      this.portfolioSummary = res.data?.data ?? null
      return this.portfolioSummary
    },

    async getAssetAllocation() {
      const res = await fetchAssetAllocation()
      this.assetAllocation = res.data?.data ?? []
      return this.assetAllocation
    },

    async getDashboardData(params = {}) {
      this.loading = true

      try {
        await Promise.all([
          this.getSummary(params),
          this.getStrategyPerformance(params),
          this.getTagPerformance(params),
          this.getMonthlyPerformance(params),
          this.getAssetPerformance(params),
          this.getPortfolioSummary(),
          this.getAssetAllocation(),
        ])
      } finally {
        this.loading = false
      }
    },
  },
})