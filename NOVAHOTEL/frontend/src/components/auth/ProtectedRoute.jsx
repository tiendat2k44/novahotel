import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

/**
 * ProtectedRoute Component — Bảo vệ các route yêu cầu xác thực
 * Kiểm tra xem user đã đăng nhập và có role phù hợp không
 * Nếu không, chuyển hướng đến trang đăng nhập `/login`
 */
export function ProtectedRoute({ children, requiredRoles = [] }) {
  const { user, loading } = useAuth()

  // Đợi authentication state load
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner size={3} />
      </div>
    )
  }

  // Nếu chưa đăng nhập — chuyển hướng về trang đăng nhập (route /login)
  if (!user) {
    const location = useLocation()
    // Truyền state `from` để có thể quay về trang trước sau khi đăng nhập
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Nếu yêu cầu role cụ thể
  if (requiredRoles.length > 0) {
    const userRole = user.role?.toUpperCase() || ''
    const hasRequiredRole = requiredRoles.some(role => userRole === role.toUpperCase())
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />
    }
  }

  return children
}

/**
 * AdminRoute — Route chỉ cho Admin/Receptionist
 * Kiểm tra user có role ADMIN hoặc RECEPTIONIST
 */
export function AdminRoute({ children }) {
  return (
    <ProtectedRoute requiredRoles={['ADMIN', 'RECEPTIONIST']}>
      {children}
    </ProtectedRoute>
  )
}

/**
 * CustomerRoute — Route chỉ cho Customer
 * Kiểm tra user có role CUSTOMER
 */
export function CustomerRoute({ children }) {
  return (
    <ProtectedRoute requiredRoles={['CUSTOMER', 'USER']}>
      {children}
    </ProtectedRoute>
  )
}

export default ProtectedRoute
