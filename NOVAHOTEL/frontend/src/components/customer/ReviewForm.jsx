import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../common/Button'
import LoadingSpinner from '../common/LoadingSpinner'
import { reviewsAPI } from '../../services/api'
import { Star } from 'lucide-react'

/**
 * ReviewForm — Form để khách hàng đánh giá phòng
 * Gồm: rating (stars), comment text, submit button
 * Sử dụng react-hot-toast cho thông báo
 */
export default function ReviewForm({ roomId, onPosted }){
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * Xử lý gửi đánh giá
   * Kiểm tra comment, gọi API, thông báo kết quả
   */
  const submit = async (e) => {
    e.preventDefault()
    
    if (!comment.trim()) {
      toast.error('Vui lòng nhập nhận xét của bạn')
      return
    }

    setLoading(true)
    try {
      await reviewsAPI.create(roomId, { rating, comment })
      toast.success('Cảm ơn! Đánh giá của bạn đã được gửi.')
      setComment('')
      setRating(5)
      if (onPosted) onPosted()
    } catch (err) {
      const msg = err?.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.'
      toast.error(msg)
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div>
        <label className="mb-3 block text-sm font-medium text-slate-700">Đánh giá</label>
        <div className="flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRating(r)}
              className={`px-4 py-2 rounded-2xl border transition font-medium ${
                rating === r
                  ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50/60'
              }`}
            >
              <span className="flex items-center gap-1">
                <Star size={16} className={rating === r ? 'fill-yellow-400' : ''} />
                {r}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Nhận xét của bạn</label>
        <textarea 
          value={comment} 
          onChange={e => setComment(e.target.value)} 
          rows={4} 
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white"
          placeholder="Chia sẻ trải nghiệm lưu trú của bạn tại NovaHotel..."
        />
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          variant="primary" 
          disabled={loading}
          className="px-6 py-3"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size={0.8} />
              Đang gửi...
            </span>
          ) : (
            'Gửi Đánh Giá'
          )}
        </Button>
      </div>
    </form>
  )
}
