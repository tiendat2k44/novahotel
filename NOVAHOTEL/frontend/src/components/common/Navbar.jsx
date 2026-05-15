import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, LogOut, Home, LayoutDashboard, Sparkles } from 'lucide-react'

/**
 * Navbar — Thanh điều hướng chính
 * - Hiển thị logo, liên kết chính
 * - Hiển thị menu động theo trạng thái `user` từ `AuthContext`
 * - Responsive: mobile menu và desktop menu
 *
 * Tất cả text và chú thích bằng tiếng Việt.
 */
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Xử lý đăng xuất và chuyển hướng về trang đăng nhập
  const handleLogout = () => {
    logout()
    navigate('/login')
    setMobileOpen(false)
  }

  // Kiểm tra role Admin/Receptionist (không phân biệt chữ hoa)
  const isAdminOrReception = () => {
    const r = (user && user.role) || ''
    const low = String(r).toLowerCase()
    return low === 'admin' || low === 'receptionist'
  }

  const NavLink = ({ to, children, className = '' }) => (
    <Link
      to={to}
      className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-50 hover:text-blue-700 ${className}`}
    >
      {children}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3 rounded-2xl px-2 py-1 transition hover:bg-blue-50/70">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg">
            <Home size={18} />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2 text-lg font-bold tracking-wide text-slate-900">
              NOVA HOTEL <Sparkles size={14} className="text-amber-500" />
            </div>
            <div className="text-xs text-slate-500">Trải nghiệm nghỉ dưỡng hạng sang</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/">Trang Chủ</NavLink>
          <NavLink to="/rooms">Phòng</NavLink>
          {user && <NavLink to="/my-bookings">Đặt phòng của tôi</NavLink>}
          {isAdminOrReception() && (
            <NavLink to="/admin/dashboard" className="bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800">
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 md:flex">
              <div className="text-right leading-tight">
                <div className="text-sm font-semibold text-slate-800">{user.name || user.username}</div>
                <div className="text-xs uppercase tracking-wide text-slate-500">{(user.role || '').toUpperCase()}</div>
              </div>
              <button onClick={handleLogout} className="rounded-xl p-2 text-red-600 transition hover:bg-red-50" title="Đăng xuất">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">Đăng nhập</Link>
              <Link to="/register" className="rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">Đăng ký</Link>
            </div>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-xl p-2 transition hover:bg-slate-100 md:hidden" aria-label="Mở menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-slate-100 bg-white/95 px-4 py-4 shadow-xl md:hidden">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">Trang Chủ</Link>
          <Link to="/rooms" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">Phòng</Link>
          {user && (
            <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">Đặt phòng của tôi</Link>
          )}
          {isAdminOrReception() && (
            <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 font-medium text-amber-700 hover:bg-amber-50">Dashboard</Link>
          )}

          {user ? (
            <button onClick={handleLogout} className="mt-2 w-full rounded-xl bg-red-50 px-4 py-3 text-left font-semibold text-red-600 transition hover:bg-red-100">Đăng xuất</button>
          ) : (
            <div className="mt-3 flex gap-3">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-center font-semibold text-slate-700">Đăng nhập</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-3 text-center font-semibold text-white shadow-lg">Đăng ký</Link>
            </div>
          )}
        </nav>
      )}
    </header>
  )
}
