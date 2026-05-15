import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MessageCircle, Sparkles, Star, User } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ReviewForm from '../../components/customer/ReviewForm'
import { bookingsAPI, reviewsAPI } from '../../services/api'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function renderStars(value) {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      size={18}
      className={index < Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
    />
  ))
}

export default function ReviewPage() {
  const { bookingId } = useParams()
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(null)
  const [reviews, setReviews] = useState([])

  const roomId = booking?.room?.id || booking?.roomId || booking?.room?.roomId

  const loadData = async () => {
    setLoading(true)
    try {
      const bookingRes = await bookingsAPI.myBookings()
      const allBookings = Array.isArray(bookingRes?.data) ? bookingRes.data : bookingRes?.data?.content || bookingRes?.data || []
      const currentBooking = allBookings.find((item) => String(item.id || item._id) === String(bookingId)) || null
      setBooking(currentBooking)

      const targetRoomId = currentBooking?.room?.id || currentBooking?.roomId
      if (targetRoomId) {
        const reviewRes = await reviewsAPI.listByRoom(targetRoomId)
        setReviews(reviewRes?.data || reviewRes || [])
      } else {
        setReviews([])
      }
    } catch (err) {
      toast.error(err?.message || 'Không thể tải dữ liệu đánh giá')
      setBooking(null)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [bookingId])

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0
    return (reviews.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / reviews.length).toFixed(1)
  }, [reviews])

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 md:py-12">
      <section className="mb-8 overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,64,175,0.92),rgba(9,14,33,0.98))] px-6 py-10 text-white shadow-[0_30px_100px_rgba(15,23,42,0.18)] md:px-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-blue-50 backdrop-blur">
          <Sparkles size={15} className="text-amber-300" /> Đánh giá phòng
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Chia sẻ cảm nhận của bạn</h1>
        <p className="mt-4 max-w-2xl text-blue-100 leading-8">Những đánh giá chân thực giúp Nova Hotel ngày càng hoàn thiện chất lượng dịch vụ.</p>
      </section>

      {loading ? (
        <div className="flex justify-center rounded-[30px] border border-white/70 bg-white/90 py-24 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <LoadingSpinner size={2} />
        </div>
      ) : !booking ? (
        <div className="rounded-[30px] border border-white/70 bg-white/90 p-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <MessageCircle size={48} className="mx-auto mb-4 text-blue-700" />
          <p className="text-lg font-semibold text-slate-900">Không tìm thấy đặt phòng</p>
          <p className="mt-2 text-slate-500">Vui lòng quay lại danh sách đặt phòng để chọn đúng booking.</p>
          <Link to="/my-bookings" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
            Quay lại đặt phòng của tôi
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{booking.room?.name || booking.roomName || 'Phòng'}</h2>
              <p className="mt-2 text-slate-500">Mã đặt phòng: #{booking.id || booking._id}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <KeyInfo label="Nhận phòng" value={formatDate(booking.startDate || booking.checkIn)} />
                <KeyInfo label="Trả phòng" value={formatDate(booking.endDate || booking.checkOut)} />
                <KeyInfo label="Số khách" value={`${booking.guests || 2} người`} />
              </div>

              <div className="mt-8 rounded-[28px] bg-slate-50 p-5">
                <h3 className="mb-4 text-xl font-bold text-slate-900">Viết đánh giá của bạn</h3>
                {roomId ? <ReviewForm roomId={roomId} onPosted={loadData} /> : <p className="text-slate-500">Thiếu roomId để gửi đánh giá.</p>}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,64,175,0.92),rgba(9,14,33,0.98))] p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <h3 className="text-2xl font-bold tracking-tight">Thống kê đánh giá</h3>
              <div className="mt-5 flex items-end gap-4">
                <div className="text-5xl font-bold">{averageRating}</div>
                <div className="mb-2 flex">{renderStars(Number(averageRating) || 0)}</div>
              </div>
              <p className="mt-2 text-sm text-blue-100">{reviews.length} đánh giá đã được gửi.</p>
              <div className="mt-6 rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                <p className="text-sm leading-7 text-blue-50">Màn hình này giúp khách hàng đánh giá và đọc phản hồi ngay sau khi sử dụng dịch vụ.</p>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">Danh sách đánh giá</h3>
            <p className="mt-2 text-sm text-slate-500">Các phản hồi từ khách hàng trước đó.</p>

            {reviews.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
                <MessageCircle size={44} className="mb-4 text-slate-400" />
                <p className="text-lg font-semibold text-slate-900">Chưa có đánh giá</p>
                <p className="mt-1 text-slate-500">Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {reviews.map((review) => (
                  <article key={review.id || review._id} className="rounded-[26px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div className="mb-4 flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-700 text-white">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{review.authorName || review.user?.name || 'Khách ẩn danh'}</p>
                          <p className="text-sm text-slate-500">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(Number(review.rating) || 0)}
                        <span className="font-bold text-slate-900">{review.rating}</span>
                      </div>
                    </div>
                    <p className="leading-relaxed text-slate-700">{review.comment}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

function KeyInfo({ label, value }) {
  return (
    <div className="rounded-[24px] bg-slate-50 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  )
}
