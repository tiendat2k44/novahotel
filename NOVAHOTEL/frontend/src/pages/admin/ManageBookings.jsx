import React, { useEffect, useState } from 'react'
import { Calendar, CheckCircle2, Clock3, XCircle } from 'lucide-react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Table from '../../components/admin/Table'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { bookingsAPI } from '../../services/api'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN')
  } catch {
    return dateStr
  }
}

function statusBadge(status) {
  const value = String(status || 'PENDING').toUpperCase()
  if (value === 'CONFIRMED') return <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Đã xác nhận</span>
  if (value === 'CANCELLED') return <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">Đã hủy</span>
  return <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">Đang chờ</span>
}

export default function ManageBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await bookingsAPI.all({ page: 0, size: 100 })
        const data = res?.data?.content || res?.data || []
        if (mounted) setBookings(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Không thể tải danh sách đặt phòng:', err)
        if (mounted) setBookings([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const columns = [
    { key: 'id', label: 'Mã', render: (booking) => <span className="font-semibold text-gray-900">{booking.id || booking._id}</span> },
    { key: 'guest', label: 'Khách hàng', render: (booking) => booking.guestName || booking.user?.name || 'Khách' },
    { key: 'room', label: 'Phòng', render: (booking) => booking.room?.name || booking.roomName || '—' },
    { key: 'date', label: 'Ngày', render: (booking) => `${formatDate(booking.startDate || booking.checkIn)} → ${formatDate(booking.endDate || booking.checkOut)}` },
    { key: 'status', label: 'Trạng thái', render: (booking) => statusBadge(booking.status) },
    { key: 'total', label: 'Tổng', render: (booking) => new Intl.NumberFormat('vi-VN').format(booking.totalPrice || booking.total || 0) + ' ₫' },
  ]

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-5">
        <aside className="lg:col-span-1">
          <AdminSidebar />
        </aside>

        <section className="lg:col-span-4 space-y-6">
          <header className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold">Quản Lý Đặt Phòng</h1>
            <p className="mt-2 text-emerald-100">Theo dõi và xử lý các booking của khách hàng.</p>
          </header>

          {loading ? (
            <div className="flex justify-center rounded-2xl bg-white py-20 shadow-sm">
              <LoadingSpinner size={2} />
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <Table columns={columns} rows={bookings} />
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
