import axios from 'axios'

export const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

const api = axios.create({
  baseURL: API_BASE,
  headers: { Accept: 'application/json' },
})

export default api