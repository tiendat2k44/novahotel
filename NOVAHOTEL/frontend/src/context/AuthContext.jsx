import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '../services/api'

/*
  AuthContext.jsx

  Mục đích:
  - Quản lý state đăng nhập cho ứng dụng React: token JWT, thông tin `user`, và `role`.
  - Cung cấp API tiện dụng: `login`, `logout`, `loadUserFromToken`, `isAuthenticated`, `isAdmin`.
  - Lưu token vào `localStorage` để giữ trạng thái giữa các lần refresh trang.

  Hướng dẫn sử dụng ngắn:
  - Bọc toàn app bằng `AuthProvider` trong entry point (ví dụ: `main.jsx`).
  - Dùng hook `useAuth()` trong các component con để truy cập state và hàm.

  Ghi chú kỹ thuật:
  - Không phụ thuộc thư viện bên ngoài để giải mã JWT; dùng hàm decode nội bộ nhẹ.
  - Tất cả chú thích/miêu tả bằng tiếng Việt theo yêu cầu.
*/

// Tên khóa lưu token trong localStorage (tiện thay đổi nếu cần)
const STORAGE_KEY = 'nh_token'

// Tạo context mặc định
const AuthContext = createContext(null)

/*
  Hàm phụ: decodeToken
  - Giải mã payload của JWT mà không cần thư viện bên ngoài.
  - Trả về object payload nếu hợp lệ, ngược lại ném lỗi.
*/
function decodeToken(token) {
  if (!token) throw new Error('Token rỗng')
  const parts = token.split('.')
  if (parts.length < 2) throw new Error('Token không hợp lệ')
  const payload = parts[1]
  // Chuẩn hoá base64 URL
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
  // Thêm padding nếu cần
  const pad = base64.length % 4
  const padded = base64 + (pad ? '='.repeat(4 - pad) : '')
  try {
    const json = atob(padded)
    return JSON.parse(json)
  } catch (err) {
    throw new Error('Không thể giải mã token: ' + err.message)
  }
}

/*
  AuthProvider
  - Provider chính cung cấp state và hàm quản lý xác thực.
  - Tự động gọi `loadUserFromToken` khi component mount để giữ đăng nhập sau refresh.
*/
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  // --- Hàm nội bộ: lưu token vào state và localStorage ---
  const saveToken = (t) => {
    if (t) {
      localStorage.setItem(STORAGE_KEY, t)
      setToken(t)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      setToken(null)
    }
  }

  // Adapter: services/api exports `authAPI.login` and `authAPI.register`.
  // Create apiLogin/apiRegister helpers returning response.data for compatibility.
  const apiLogin = async (credentials) => {
    const res = await authAPI.login(credentials)
    return res.data || res
  }

  const apiRegister = async (payload) => {
    const res = await authAPI.register(payload)
    return res.data || res
  }

  /*
    loadUserFromToken
    - Đọc token từ localStorage, giải mã và đặt `user` + `role` vào state.
    - Nếu token không hợp lệ thì sẽ xoá token và logout.
  */
  const loadUserFromToken = () => {
    setLoading(true)
    const t = localStorage.getItem(STORAGE_KEY)
    if (!t) {
      setLoading(false)
      return
    }
    try {
      const payload = decodeToken(t)
      // Cố gắng lấy thông tin user từ payload theo nhiều dạng phổ biến
      const u = payload.user || {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        role: payload.role || (payload.roles && payload.roles[0]) || null,
      }
      setToken(t)
      setUser(u)
      setRole(u.role || payload.role || null)
    } catch (err) {
      // Nếu token lỗi/expired => xoá để tránh vòng lặp lỗi
      console.error('Lỗi khi load user từ token:', err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  /*
    login
    - Sử dụng `api.login` (Axios) để gửi credentials lên backend.
    - Nếu server trả về token thì lưu token vào localStorage và giải mã user.
    - Hỗ trợ trường hợp truyền trực tiếp `credentials.token` (ví dụ sau OAuth).
  */
  const login = async (credentials) => {
    // Trường hợp đã có token trực tiếp
    if (credentials && credentials.token) {
      saveToken(credentials.token)
      setUser(credentials.user || null)
      setRole((credentials.user && credentials.user.role) || null)
      return credentials.user || null
    }

    try {
      const data = await apiLogin(credentials)
      const receivedToken = data.token || data.accessToken
      if (!receivedToken) throw new Error('Không nhận được token từ server')

      saveToken(receivedToken)
      try {
        const payload = decodeToken(receivedToken)
        const u = data.user || payload.user || { id: payload.sub, name: payload.name, email: payload.email, role: payload.role }
        setUser(u)
        setRole(u.role || payload.role || null)
        return u
      } catch (err) {
        setUser(data.user || null)
        setRole((data.user && data.user.role) || null)
        return data.user || null
      }
    } catch (err) {
      throw new Error(err.message || 'Lỗi khi đăng nhập')
    }
  }

  /*
    register
    - Gọi apiRegister để tạo tài khoản mới.
    - Nếu server trả về token ngay khi đăng ký, sẽ tự động lưu và login.
  */
  const register = async (userData) => {
    try {
      const data = await apiRegister(userData)
      const receivedToken = data.token || data.accessToken
      if (receivedToken) {
        saveToken(receivedToken)
        try {
          const payload = decodeToken(receivedToken)
          const u = data.user || payload.user || { id: payload.sub, name: payload.name, email: payload.email, role: payload.role }
          setUser(u)
          setRole(u.role || payload.role || null)
          return u
        } catch (err) {
          setUser(data.user || null)
          setRole((data.user && data.user.role) || null)
          return data.user || null
        }
      }
      return data
    } catch (err) {
      throw new Error(err.message || 'Lỗi khi đăng ký')
    }
  }

  /*
    logout
    - Xoá token khỏi localStorage và reset tất cả state liên quan.
  */
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setToken(null)
    setUser(null)
    setRole(null)
    setLoading(false)
  }

  /*
    isAuthenticated
    - Trả về boolean cho biết user đã đăng nhập (có token trong state) hay chưa.
  */
  const isAuthenticated = () => !!token

  /*
    isAdmin
    - Kiểm tra role có phải là admin hay không.
    - Có thể mở rộng để hỗ trợ nhiều role/permission phức tạp hơn.
  */
  const isAdmin = () => {
    // Chuẩn hoá kiểm tra role (không phân biệt chữ hoa/thường) và hỗ trợ role trong mảng
    const r = role || (user && (user.role || (user.roles && user.roles[0]))) || ''
    if (!r) return false
    const low = String(r).toLowerCase()
    return low === 'admin' || low === 'receptionist'
  }

  // Tự động load user/token khi mount (giữ trạng thái sau refresh)
  useEffect(() => {
    loadUserFromToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = {
    token,
    user,
    role,
    loading,
    login,
    register,
    logout,
    loadUserFromToken,
    isAuthenticated,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/*
  useAuth
  - Custom hook tiện dụng để các component con lấy context.
  - Nếu hook được gọi ngoài Provider sẽ ném lỗi để dễ phát hiện sai cấu trúc.
*/
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải được gọi bên trong AuthProvider')
  return ctx
}

export default AuthContext

