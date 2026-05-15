import React, { useEffect, useState } from 'react'
import { CalendarDays, Check, Clock3, Crown, DollarSign, Ticket, Users, X } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'
import { bookingsAPI } from '../../services/api'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}

function StatusBadge({ status }) {
  const value = String(status || 'PENDING').toUpperCase()
  const configs = {
    CONFIRMED: { label: 'Đã xác nhận', className: 'bg-green-50 text-green-700 border-green-200', icon: Check },
    PENDING: { label: 'Đang chờ', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock3 },
    CANCELLED: { label: 'Đã hủy', className: 'bg-red-50 text-red-700 border-red-200', icon: X },
  }
  const config = configs[value] || configs.PENDING
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${config.className}`}>
      <Icon size={16} />
      {config.label}
    </span>
  )
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  const loadBookings = async () => {
    setLoading(true)
    try {
      const res = await bookingsAPI.myBookings()
      const data = res?.data?.content || res?.data || []
      setBookings(Array.isArray(data) ? data : [])
    } catch (err) {
      toast.error(err?.message || 'Không thể tải danh sách đặt phòng')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleCancel = async (id) => {
    setCancellingId(id)
    try {
      await bookingsAPI.cancel(id)
      toast.success('Đã hủy đặt phòng')
      await loadBookings()
    } catch (err) {
      toast.error(err?.message || 'Không thể hủy đặt phòng')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 md:py-12">
      <section className="mb-8 overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,64,175,0.92),rgba(9,14,33,0.98))] px-6 py-10 text-white shadow-[0_30px_100px_rgba(15,23,42,0.18)] md:px-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-blue-50 backdrop-blur">
          <Ticket size={15} className="text-amber-300" /> Lịch sử đặt phòng
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Đặt Phòng Của Tôi</h1>
        <p className="mt-4 max-w-2xl text-blue-100 leading-8">Theo dõi lịch sử booking, trạng thái xác nhận và tổng chi phí một cách rõ ràng, gọn gàng.</p>
      </section>

      {loading ? (
        <div className="flex justify-center rounded-[30px] border border-white/70 bg-white/90 py-24 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <LoadingSpinner size={2} />
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-[30px] border border-white/70 bg-white/90 p-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <Crown size={48} className="mx-auto mb-4 text-blue-700" />
          <p className="text-lg font-semibold text-slate-900">Chưa có đặt phòng nào</p>
          <p className="mt-2 text-slate-500">Hãy khám phá danh sách phòng để bắt đầu đặt phòng đầu tiên.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article key={booking.id || booking._id} className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Mã: #{booking.id || booking._id}</div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">{booking.room?.name || booking.roomName || 'Phòng'}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">{booking.notes || 'Không có ghi chú'}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <InfoCard icon={CalendarDays} label="Nhận phòng" value={formatDate(booking.startDate || booking.checkIn)} />
                <InfoCard icon={CalendarDays} label="Trả phòng" value={formatDate(booking.endDate || booking.checkOut)} />
                <InfoCard icon={Users} label="Số khách" value={`${booking.guests || 2} người`} />
                <InfoCard icon={DollarSign} label="Tổng giá" value={formatCurrency(booking.totalPrice || booking.total)} />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button variant="secondary" className="sm:flex-1" onClick={() => window.location.assign(`/room/${booking.room?.id || booking.roomId}`)}>
                  Xem chi tiết phòng
                </Button>
                {(booking.status || 'PENDING').toUpperCase() !== 'CANCELLED' && (
                  <Button
                    variant="danger"
                    className="sm:flex-1"
                    disabled={cancellingId === (booking.id || booking._id)}
                    onClick={() => handleCancel(booking.id || booking._id)}
                  >
                    {cancellingId === (booking.id || booking._id) ? 'Đang hủy...' : 'Hủy đặt phòng'}
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
          <Icon size={18} />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
        </div>
      </div>
    </div>
  )
}
