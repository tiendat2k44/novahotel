import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../common/Button'
import LoadingSpinner from '../common/LoadingSpinner'
import { bookingsAPI } from '../../services/api'
import { CalendarDays, Users } from 'lucide-react'

/**
 * BookingForm — Form đặt phòng với chọn ngày và số khách
 * Gọi bookingsAPI.create khi gửi form
 * Sử dụng react-hot-toast để thông báo success/error
 */
export default function BookingForm({ roomId, onBooked }){
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)

  /**
   * Xử lý gửi form đặt phòng
   * Kiểm tra ngày, gọi API, thông báo kết quả
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Xác thực đầu vào
    if (!startDate || !endDate) {
      toast.error('Vui lòng chọn ngày nhận và trả phòng')
      return
    }

    setLoading(true)
    try {
      await bookingsAPI.create({ roomId, startDate, endDate, guests })
      toast.success('Đặt phòng thành công! Cảm ơn bạn.')
      if (onBooked) onBooked()
    } catch (err) {
      const msg = err?.message || 'Đặt phòng thất bại. Vui lòng thử lại.'
      toast.error(msg)
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Nhận phòng</label>
          <div className="relative">
            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Trả phòng</label>
          <div className="relative">
            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Số khách</label>
        <div className="relative">
          <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="number" 
            min={1} 
            max={10}
            value={guests} 
            onChange={e => setGuests(Number(e.target.value))} 
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white"
          />
        </div>
      </div>
      <Button 
        type="submit" 
        variant="primary" 
        disabled={loading}
        className="w-full justify-center py-3"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner size={0.8} />
            Đang xử lý...
          </span>
        ) : (
          'Đặt Phòng Ngay'
        )}
      </Button>
    </form>
  )
}
