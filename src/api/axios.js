import axios from 'axios'
import { getToken, removeToken } from '@/utils/storage'
import { toastService } from '@/utils/toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    const message =
      error.response?.data?.message?.en ||
      error.response?.data?.message?.id ||
      error.response?.data?.message ||
      'Something went wrong'

    if (status === 401) {
      removeToken()
      toastService.error('Session expired. Please login again.')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (status === 422) {
      return Promise.reject(error)
    }

    toastService.error(message)

    return Promise.reject(error)
  }
)

export default api