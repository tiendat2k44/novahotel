import React, { useEffect, useMemo, useState } from 'react'
import { BarChart3, Calendar, Home, Sparkles, Star, TrendingUp, Users } from 'lucide-react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import DashboardCard from '../../components/admin/DashboardCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import RoomCard from '../../components/common/RoomCard'
import { bookingsAPI, reviewsAPI, roomsAPI, usersAPI } from '../../services/api'

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN').format(value || 0) + ' ₫'
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ rooms: 0, users: 0, bookings: 0, rating: 0 })
  const [featuredRooms, setFeaturedRooms] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [revenueSeries, setRevenueSeries] = useState([
    { month: 'Th1', revenue: 12000000 },
    { month: 'Th2', revenue: 15000000 },
    { month: 'Th3', revenue: 8000000 },
    { month: 'Th4', revenue: 20000000 },
    { month: 'Th5', revenue: 17000000 },
    { month: 'Th6', revenue: 22000000 },
  ])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const [roomsRes, usersRes, bookingsRes, reviewsRes] = await Promise.all([
          roomsAPI.list({ page: 0, size: 100 }),
          usersAPI.list({ page: 0, size: 100 }),
          bookingsAPI.all({ page: 0, size: 100 }),
          reviewsAPI.listByRoom('all').catch(() => ({ data: [] })),
        ])

        const rooms = roomsRes?.data?.content || roomsRes?.data || []
        const users = usersRes?.data?.content || usersRes?.data || []
        const bookings = bookingsRes?.data?.content || bookingsRes?.data || []
        const reviews = reviewsRes?.data || []

        const averageRating = reviews.length
          ? (reviews.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / reviews.length).toFixed(1)
          : 0

        if (!mounted) return

        setStats({
          rooms: Array.isArray(rooms) ? rooms.length : 0,
          users: Array.isArray(users) ? users.length : 0,
          bookings: Array.isArray(bookings) ? bookings.length : 0,
          rating: averageRating,
        })
        setFeaturedRooms(Array.isArray(rooms) ? rooms.slice(0, 3) : [])
        setRecentBookings(Array.isArray(bookings) ? bookings.slice(0, 5) : [])
      } catch (err) {
        console.error('Không thể tải dữ liệu dashboard:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const totalRevenue = useMemo(() => revenueSeries.reduce((sum, item) => sum + item.revenue, 0), [revenueSeries])
  const maxRevenue = Math.max(...revenueSeries.map((item) => item.revenue))

  return (
    <main className="min-h-screen px-4 py-8 md:py-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[300px_1fr]">
        <aside>
          <AdminSidebar />
        </aside>

        <section className="space-y-8">
          <header className="overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,64,175,0.92),rgba(9,14,33,0.98))] p-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.18)] md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-blue-50 backdrop-blur">
              <Sparkles size={15} className="text-amber-300" /> Tổng quan quản trị
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Bảng điều khiển Nova Hotel</h1>
            <p className="mt-4 max-w-2xl text-blue-100 leading-8">
              Theo dõi phòng, người dùng, đặt phòng và hiệu suất kinh doanh trong một giao diện trực quan, cao cấp và dễ dùng.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center rounded-[30px] border border-white/70 bg-white/90 py-24 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <LoadingSpinner size={2} />
            </div>
          ) : (
            <>
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DashboardCard title="Tổng phòng" value={stats.rooms} className="rounded-[24px] border-blue-100 shadow-[0_20px_50px_rgba(15,23,42,0.06)]" />
                <DashboardCard title="Người dùng" value={stats.users} className="rounded-[24px] border-green-100 shadow-[0_20px_50px_rgba(15,23,42,0.06)]" />
                <DashboardCard title="Đặt phòng" value={stats.bookings} className="rounded-[24px] border-amber-100 shadow-[0_20px_50px_rgba(15,23,42,0.06)]" />
                <DashboardCard title="Rating trung bình" value={stats.rating} className="rounded-[24px] border-purple-100 shadow-[0_20px_50px_rgba(15,23,42,0.06)]" />
              </section>

              <section className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] xl:col-span-2">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-slate-900">Biểu đồ doanh thu</h2>
                      <p className="mt-1 text-sm text-slate-500">Dữ liệu minh họa theo 6 tháng gần nhất.</p>
                    </div>
                    <div className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                      {formatCurrency(totalRevenue)}
                    </div>
                  </div>

                  <div className="flex h-80 items-end gap-3 rounded-[28px] bg-[linear-gradient(180deg,#f8fbff,#eef4ff)] p-4">
                    {revenueSeries.map((item) => {
                      const height = Math.max((item.revenue / maxRevenue) * 100, 12)
                      return (
                        <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                          <div className="w-full rounded-t-[22px] bg-gradient-to-t from-blue-700 via-blue-600 to-indigo-700 shadow-lg" style={{ height: `${height}%` }} />
                          <div className="text-xs font-medium text-slate-500">{item.month}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">Phòng nổi bật</h2>
                  <div className="space-y-4">
                    {featuredRooms.length > 0 ? (
                      featuredRooms.map((room) => <RoomCard key={room.id || room._id} room={room} />)
                    ) : (
                      <p className="text-sm text-slate-500">Chưa có dữ liệu phòng.</p>
                    )}
                  </div>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">Đặt phòng gần đây</h2>
                  {recentBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="text-slate-500">
                          <tr>
                            <th className="py-2 pr-3">Mã</th>
                            <th className="py-2 pr-3">Phòng</th>
                            <th className="py-2 pr-3">Trạng thái</th>
                            <th className="py-2">Tổng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentBookings.map((booking) => (
                            <tr key={booking.id || booking._id} className="border-t border-slate-100">
                              <td className="py-3 pr-3 font-medium text-slate-900">{booking.id || booking._id}</td>
                              <td className="py-3 pr-3 text-slate-600">{booking.room?.name || booking.roomName || '—'}</td>
                              <td className="py-3 pr-3 text-slate-600">{booking.status || 'PENDING'}</td>
                              <td className="py-3 text-slate-600">{formatCurrency(booking.totalPrice || booking.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-slate-500">Chưa có đặt phòng mới.</p>
                  )}
                </div>

                <div className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">Lối tắt quản trị</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Shortcut href="/admin/rooms" icon={Home} label="Quản lý phòng" />
                    <Shortcut href="/admin/bookings" icon={Calendar} label="Quản lý đặt phòng" />
                    <Shortcut href="/admin/users" icon={Users} label="Quản lý người dùng" />
                    <Shortcut href="/admin/revenue" icon={BarChart3} label="Doanh thu" />
                  </div>
                </div>
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

function Shortcut({ href, icon: Icon, label }) {
  return (
    <a href={href} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
      <Icon size={18} />
      {label}
    </a>
  )
}
