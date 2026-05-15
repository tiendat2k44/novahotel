import axios from 'axios'

const STORAGE_KEY = 'nh_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem(STORAGE_KEY)
    if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
  } catch (e) {
    // ignore
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) return Promise.reject(err.response.data || err.response)
    return Promise.reject(err)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (payload) => api.post('/auth/register', payload),
  me: () => api.get('/auth/me'),
}

export const roomsAPI = {
  list: (params) => api.get('/rooms', { params }),
  get: (id) => api.get(`/rooms/${id}`),
  available: (startDate, endDate, params) => api.get('/rooms/available', { params: { ...params, startDate, endDate } }),
}

export const bookingsAPI = {
  create: (payload) => api.post('/bookings', payload),
  myBookings: (params) => api.get('/bookings/my', { params }),
  all: (params) => api.get('/bookings', { params }),
  cancel: (id) => api.delete(`/bookings/${id}`),
}

export const usersAPI = {
  list: (params) => api.get('/users', { params }),
  get: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  remove: (id) => api.delete(`/users/${id}`),
}

export const reviewsAPI = {
  create: (roomId, payload) => api.post(`/rooms/${roomId}/reviews`, payload),
  listByRoom: (roomId) => api.get(`/rooms/${roomId}/reviews`),
}

export default api
