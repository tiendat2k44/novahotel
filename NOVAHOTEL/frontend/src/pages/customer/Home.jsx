import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock3, MapPin, Sparkles, Star } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import RoomCard from '../../components/common/RoomCard'
import SearchBar from '../../components/customer/SearchBar'
import { roomsAPI } from '../../services/api'

/**
 * Trang chủ Nova Hotel
 * - Hero sang trọng
 * - Thanh tìm kiếm nổi bật
 * - Các điểm mạnh dịch vụ
 * - Phòng nổi bật
 */
export default function Home() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      try {
        const res = await roomsAPI.list({ page: 0, size: 6 })
        const data = res?.data?.content || res?.data || []
        if (mounted) setRooms(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Không thể tải phòng nổi bật:', err)
        if (mounted) setRooms([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleSearch = async (params = {}) => {
    setLoading(true)
    try {
      const res = await roomsAPI.list({
        page: 0,
        size: 12,
        q: params.q || undefined,
        checkIn: params.checkIn || undefined,
        checkOut: params.checkOut || undefined,
        guests: params.guests || undefined,
      })
      setRooms(res?.data?.content || res?.data || [])
    } catch (err) {
      console.error('Tìm kiếm thất bại:', err)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { icon: MapPin, label: 'Vị trí đắc địa', value: 'Trung tâm thành phố' },
    { icon: Star, label: 'Chất lượng 5 sao', value: 'Dịch vụ chuẩn cao cấp' },
    { icon: Clock3, label: 'Hỗ trợ 24/7', value: 'Phục vụ liên tục' },
  ]

  return (
    <main className="pb-12">
      <section className="relative overflow-hidden px-4 pt-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-white/70 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.26),transparent_40%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,64,175,0.92),rgba(9,14,33,0.98))] px-6 py-14 text-white shadow-[0_30px_100px_rgba(15,23,42,0.22)] md:px-10 md:py-20">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05),transparent_30%,rgba(255,255,255,0.03))]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="animate-fade-up">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-50 backdrop-blur">
                <Sparkles size={15} className="text-amber-300" /> Nova Hotel - Nâng tầm trải nghiệm lưu trú
              </div>
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
                Không gian nghỉ dưỡng sang trọng, tinh tế và dễ đặt phòng.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100 md:text-lg">
                Khám phá bộ sưu tập phòng đẹp, tiện nghi cao cấp và dịch vụ chăm sóc khách hàng chuẩn khách sạn hiện đại.
              </p>

              <div className="mt-8 max-w-5xl">
                <SearchBar onSearch={handleSearch} />
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-blue-50">
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Phòng đẹp, ảnh rõ, giá minh bạch</span>
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Đặt phòng nhanh trong vài bước</span>
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">Trải nghiệm UI mượt và hiện đại</span>
              </div>
            </div>

            <div className="grid gap-4 animate-drift">
              <div className="rounded-[30px] border border-white/15 bg-white/10 p-5 shadow-lg backdrop-blur-xl">
                <div className="rounded-3xl bg-[linear-gradient(135deg,rgba(248,250,252,0.14),rgba(255,255,255,0.04))] p-5">
                  <div className="text-sm uppercase tracking-[0.22em] text-amber-200">Điểm nhấn thương hiệu</div>
                  <div className="mt-3 text-2xl font-bold">Tinh tế, thanh lịch và đáng nhớ</div>
                  <p className="mt-3 text-sm leading-7 text-blue-100">Bộ giao diện được tinh chỉnh theo tông xanh dương - vàng đồng để phù hợp báo cáo đồ án và trải nghiệm thực tế.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {stats.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-amber-200">
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-50">{label}</p>
                        <p className="text-sm text-blue-100">{value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Trải nghiệm cao cấp', 'Giao diện sang, thoáng, có chiều sâu và dễ dùng trên cả mobile lẫn desktop.'],
            ['Đặt phòng nhanh', 'Tìm kiếm, xem phòng và thao tác đặt phòng được thiết kế liền mạch.'],
            ['Quản trị rõ ràng', 'Khu admin trực quan, dễ theo dõi dữ liệu và xử lý công việc.'],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Phòng Nổi Bật</h2>
            <p className="mt-2 text-slate-500">Một số phòng tiêu biểu được chọn lọc để hiển thị trên trang chủ.</p>
          </div>
          <Link to="/rooms" className="hidden rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 md:inline-flex">
            Xem toàn bộ phòng
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center rounded-[28px] border border-white/70 bg-white/90 py-20 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <LoadingSpinner size={2} />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => <RoomCard key={room.id || room._id} room={room} />)}
          </div>
        )}
      </section>
    </main>
  )
}
