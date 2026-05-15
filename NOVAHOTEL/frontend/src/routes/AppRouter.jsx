import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminRoute, ProtectedRoute, CustomerRoute } from '../components/auth/ProtectedRoute'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'

// Lazy-loaded pages — Tải trang lưới để cải thiện initial load time
const Login = React.lazy(() => import('../pages/auth/Login'))
const Register = React.lazy(() => import('../pages/auth/Register'))

const Home = React.lazy(() => import('../pages/customer/Home'))
const RoomList = React.lazy(() => import('../pages/customer/RoomList'))
const RoomDetail = React.lazy(() => import('../pages/customer/RoomDetail'))
const MyBookings = React.lazy(() => import('../pages/customer/MyBookings'))
const ReviewPage = React.lazy(() => import('../pages/customer/ReviewPage'))

const Dashboard = React.lazy(() => import('../pages/admin/Dashboard'))
const ManageRooms = React.lazy(() => import('../pages/admin/ManageRooms'))
const ManageUsers = React.lazy(() => import('../pages/admin/ManageUsers'))
const ManageBookings = React.lazy(() => import('../pages/admin/ManageBookings'))
const Revenue = React.lazy(() => import('../pages/admin/Revenue'))

/**
 * Loading fallback component — Hiển thị loading spinner
 */
function LoaderFallback() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size={3} />
    </div>
  )
}

/**
 * AppRouter — Định tuyến chính của ứng dụng
 * 
 * Cấu trúc routes:
 * - Public: / (Home), /login, /register, /rooms (list), /room/:id (detail)
 * - Protected Customer: /my-bookings, /review/:bookingId
 * - Admin: /admin/dashboard, /admin/rooms, /admin/users, /admin/bookings, /admin/revenue
 * - Fallback: 404 → Home
 */
export default function AppRouter() {
  // Component chuyển hướng nếu người dùng đã đăng nhập (tránh truy cập /login hoặc /register)
  function RedirectIfAuth({ children }) {
    const { user, loading } = useAuth()
    if (loading) return <LoaderFallback />
    if (user) return <Navigate to="/" replace />
    return children
  }

  return (
    <Suspense fallback={<LoaderFallback />}>
      <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          {/* Trang chủ */}
          <Route path="/" element={<Home />} />

          {/* Authentication routes — Đăng nhập / Đăng ký */}
          <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
          <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />

          {/* Booking & Review routes — Phòng khách sạn */}
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/room/:id" element={<RoomDetail />} />

          {/* ========== PROTECTED CUSTOMER ROUTES ========== */}
          {/* Đặt phòng của tôi — Yêu cầu đăng nhập */}
          <Route
            path="/my-bookings"
            element={
              <CustomerRoute>
                <MyBookings />
              </CustomerRoute>
            }
          />

          {/* Trang đánh giá phòng — Yêu cầu đăng nhập */}
          <Route
            path="/review/:bookingId"
            element={
              <CustomerRoute>
                <ReviewPage />
              </CustomerRoute>
            }
          />

          {/* ========== ADMIN ROUTES ========== */}
          {/* Dashboard Admin — Tổng quan hệ thống, yêu cầu ADMIN role */}
          {/* Admin root — chuyển hướng về dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />

          {/* Quản lý Phòng — CRUD phòng khách sạn */}
          <Route
            path="/admin/rooms"
            element={
              <AdminRoute>
                <ManageRooms />
              </AdminRoute>
            }
          />

          {/* Quản lý Người dùng — CRUD tài khoản khách hàng, admin */}
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />

          {/* Quản lý Đặt phòng — Xem, cập nhật trạng thái booking */}
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <ManageBookings />
              </AdminRoute>
            }
          />

          {/* Doanh thu & Thống kê — Biểu đồ doanh thu theo thời gian */}
          <Route
            path="/admin/revenue"
            element={
              <AdminRoute>
                <Revenue />
              </AdminRoute>
            }
          />

          {/* ========== 404 FALLBACK ========== */}
          {/* Route không tìm thấy → Chuyển hướng về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
