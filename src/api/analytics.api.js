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

export function fetchPortfolioSummary(params = {}) {
  return api.get('/analytics/portfolio-summary', { params })
}

export function fetchAssetAllocation(params = {}) {
  return api.get('/analytics/asset-allocation', { params })
}