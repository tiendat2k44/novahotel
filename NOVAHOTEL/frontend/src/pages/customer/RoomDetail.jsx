import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Sparkles, Star, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'
import BookingForm from '../../components/customer/BookingForm'
import { roomsAPI } from '../../services/api'

/**
 * Trang chi tiết phòng
 * - Hiển thị phòng với bố cục sang trọng
 * - Form đặt phòng tách riêng rõ ràng
 */
export default function RoomDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    let mounted = true

    async function loadRoom() {
      setLoading(true)
      try {
        const res = await roomsAPI.get(id)
        const data = res?.data || res
        if (mounted) setRoom(data)
      } catch (err) {
        toast.error(err?.message || 'Không thể tải thông tin phòng')
        if (mounted) setRoom(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadRoom()
    return () => {
      mounted = false
    }
  }, [id])

  const images = useMemo(() => {
    if (Array.isArray(room?.images) && room.images.length > 0) return room.images
    if (room?.image) return [room.image]
    return ['/src/assets/images/room_placeholder.jpg']
  }, [room])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner size={2} />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-[28px] bg-white p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <p className="text-lg font-semibold text-slate-900">Không tìm thấy phòng.</p>
          <Button className="mt-6" onClick={() => navigate('/rooms')}>
            Quay lại danh sách phòng
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 md:py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-blue-50 hover:text-blue-700">
          <ArrowLeft size={16} /> Quay lại
        </button>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
          <Sparkles size={15} /> Phòng nổi bật
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <div className="relative h-[28rem] bg-slate-100">
              <img src={images[imageIndex]} alt={room.name} className="h-full w-full object-cover" />
              {images.length > 1 && (
                <>
                  <button type="button" onClick={() => setImageIndex((prev) => (prev - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition hover:bg-white">
                    <ChevronLeft size={20} />
                  </button>
                  <button type="button" onClick={() => setImageIndex((prev) => (prev + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition hover:bg-white">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{room.roomType || 'Tiêu chuẩn'}</div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{room.name}</h1>
                <p className="mt-3 max-w-3xl leading-7 text-slate-500">{room.description || 'Phòng tiện nghi, thoải mái và được thiết kế tối ưu cho kỳ nghỉ của bạn.'}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-right">
                <div className="text-xs uppercase tracking-wide text-slate-500">Giá/đêm</div>
                <div className="mt-1 text-3xl font-bold text-emerald-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price || 0)}</div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <StatPill icon={Users} label="Sức chứa" value={`${room.capacity || 2} khách`} />
              <StatPill icon={Star} label="Đánh giá" value={`${room.rating || 4.5}/5`} />
              <StatPill icon={CalendarDays} label="Trạng thái" value={room.available ? 'Còn phòng' : 'Hết phòng'} />
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Tiện nghi nổi bật</h2>
              <div className="flex flex-wrap gap-2">
                {(room.facilities || room.amenities || []).map((item, index) => (
                  <span key={index} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[34px] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <div className="mb-5">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Đặt phòng ngay</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Chọn ngày và số khách để kiểm tra và đặt phòng nhanh.</p>
            </div>

            {user ? (
              <BookingForm roomId={room.id || room._id} onBooked={() => navigate('/my-bookings')} />
            ) : (
              <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5">
                <p className="text-sm leading-7 text-amber-800">Bạn cần đăng nhập để đặt phòng và lưu lịch sử booking.</p>
                <Button className="mt-4 w-full" onClick={() => navigate('/login')}>
                  Đăng nhập ngay
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,64,175,0.92),rgba(9,14,33,0.98))] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-blue-50">
              <Sparkles size={14} className="text-amber-300" /> Gợi ý
            </div>
            <p className="mt-3 text-sm leading-7 text-blue-100">Mỗi phòng đều được trình bày rõ ràng, giúp người dùng dễ quyết định hơn khi đặt phòng.</p>
          </div>
        </aside>
      </div>
    </main>
  )
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
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
