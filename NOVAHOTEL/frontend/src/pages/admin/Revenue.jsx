import React, { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart3, Clock3, DollarSign, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { bookingsAPI } from '../../services/api'

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}

function formatMonth(value) {
  if (!value || value === 'unknown') return 'Không rõ'
  const [year, month] = String(value).split('-')
  return `${month}/${year}`
}

export default function Revenue() {
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    let mounted = true

    async function loadData() {
      setLoading(true)
      try {
        const res = await bookingsAPI.all({ page: 0, size: 1000 })
        const data = res?.data || res || []
        if (mounted) setBookings(Array.isArray(data) ? data : data.content || [])
      } catch (err) {
        toast.error(err?.message || 'Không thể tải dữ liệu doanh thu')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()
    return () => {
      mounted = false
    }
  }, [])

  const { chartData, summary } = useMemo(() => {
    const monthMap = new Map()
    let totalRevenue = 0
    let totalBookings = 0

    bookings.forEach((booking) => {
      const dateValue = booking.createdAt || booking.startDate || booking.bookingDate || booking.date
      const amount = Number(booking.totalPrice || booking.total || booking.amount || booking.price || 0)
      const date = dateValue ? new Date(dateValue) : null
      const key = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : 'unknown'

      monthMap.set(key, (monthMap.get(key) || 0) + amount)
      totalRevenue += amount
      totalBookings += 1
    })

    const chartData = Array.from(monthMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue: Math.round(revenue) }))

    return {
      chartData,
      summary: {
        totalBookings,
        totalRevenue,
        averageBooking: totalBookings > 0 ? totalRevenue / totalBookings : 0,
      },
    }
  }, [bookings])

  const latestMonth = chartData[chartData.length - 1]?.month || 'unknown'

  return (
    <main className="flex-1 w-full bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
                <TrendingUp size={16} /> Báo cáo doanh thu
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">Tổng quan tài chính Nova Hotel</h1>
              <p className="mt-2 max-w-2xl text-blue-100">
                Theo dõi doanh thu từ các đặt phòng, nắm nhanh hiệu suất kinh doanh và xu hướng theo tháng.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="text-sm text-blue-100">Tháng gần nhất</div>
              <div className="text-2xl font-semibold">{formatMonth(latestMonth)}</div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl bg-white py-24 shadow-sm">
            <LoadingSpinner size={2} />
          </div>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <StatCard icon={DollarSign} label="Tổng doanh thu" value={formatCurrency(summary.totalRevenue)} tone="green" />
              <StatCard icon={BarChart3} label="Tổng số đặt phòng" value={summary.totalBookings} tone="blue" />
              <StatCard icon={Clock3} label="Giá trị trung bình" value={formatCurrency(summary.averageBooking)} tone="amber" />
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Biểu đồ doanh thu theo tháng</h2>
                    <p className="text-sm text-gray-500">Dữ liệu tổng hợp từ booking đã có.</p>
                  </div>
                </div>
                {chartData.length === 0 ? (
                  <div className="flex h-80 items-center justify-center text-gray-500">Chưa có dữ liệu doanh thu.</div>
                ) : (
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tickFormatter={formatMonth} stroke="#6b7280" />
                        <YAxis stroke="#6b7280" tickFormatter={(v) => `${Math.round(v / 1000000)}tr`} />
                        <Tooltip
                          formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                          labelFormatter={(label) => `Tháng: ${formatMonth(label)}`}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="url(#revenueGradient)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Tóm tắt</h2>
                <div className="space-y-4">
                  <SummaryRow label="Tổng đặt phòng" value={summary.totalBookings} />
                  <SummaryRow label="Tổng doanh thu" value={formatCurrency(summary.totalRevenue)} />
                  <SummaryRow label="Trung bình mỗi booking" value={formatCurrency(summary.averageBooking)} />
                </div>
                <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                  💡 Mẹo: Có thể mở rộng thêm bộ lọc theo ngày/tuần để khớp hoàn toàn phần demo trong báo cáo.
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

function StatCard({ icon: Icon, label, value, tone }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  }

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${tones[tone] || tones.blue}`}>
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <Icon size={22} />
        </div>
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}
