import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Home, Calendar, Users, TrendingUp, Crown, Sparkles } from 'lucide-react'

/**
 * AdminSidebar Component — Admin navigation sidebar
 * Features:
 * - Icon-based menu items
 * - Active page highlighting
 * - Professional styling with icons
 * - Responsive layout
 * - Easy navigation between admin sections
 */
export default function AdminSidebar() {
  const location = useLocation()

  // Menu configuration
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/rooms', label: 'Manage Rooms', icon: Home },
    { path: '/admin/bookings', label: 'Manage Bookings', icon: Calendar },
    { path: '/admin/users', label: 'Manage Users', icon: Users },
    { path: '/admin/revenue', label: 'Revenue', icon: TrendingUp }
  ]

  // Check if a menu item is active
  const isActive = (path) => location.pathname === path

  return (
    <aside className="sticky top-24 h-fit rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mb-6 rounded-3xl bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,64,175,0.92),rgba(9,14,33,0.98))] p-5 text-white">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-blue-50">
          <Crown size={14} className="text-amber-300" /> Khu quản trị
        </div>
        <h3 className="text-xl font-bold">Nova Hotel Admin</h3>
        <p className="mt-2 text-sm leading-6 text-blue-100">Quản lý dữ liệu, phòng và đặt phòng trong một giao diện gọn gàng.</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map(({ path, label, icon: Icon }) => {
          const active = isActive(path)
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              <span className="text-sm">{label}</span>
              {active && <Sparkles size={14} className="ml-auto text-amber-200" />}
            </Link>
          )
        })}
      </nav>

      <div className="mt-8 border-t border-slate-200 pt-5">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="flex items-center gap-1 text-xs font-medium text-blue-700">
            💡 <span>Admin Panel v1.0</span>
          </p>
          <p className="mt-1 text-xs text-blue-600">Mọi thay đổi đều được ghi nhận rõ ràng</p>
        </div>
      </div>
    </aside>
  )
}
