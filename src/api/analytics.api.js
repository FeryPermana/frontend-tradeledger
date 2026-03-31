import api from '@/api/axios'

export function fetchAnalyticsSummary(params = {}) {
  return api.get('/analytics/summary', { params })
}

export function fetchStrategyPerformance(params = {}) {
  return api.get('/analytics/strategy-performance', { params })
}

export function fetchTagPerformance(params = {}) {
  return api.get('/analytics/tag-performance', { params })
}

export function fetchMonthlyPerformance(params = {}) {
  return api.get('/analytics/monthly-performance', { params })
}

export function fetchAssetPerformance(params = {}) {
  return api.get('/analytics/asset-performance', { params })
}

export function fetchPortfolioSummary() {
  return api.get('/analytics/portfolio-summary')
}

export function fetchAssetAllocation() {
  return api.get('/analytics/asset-allocation')
}