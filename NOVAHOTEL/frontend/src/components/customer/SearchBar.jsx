import React from 'react'
import { Search, CalendarDays, Users } from 'lucide-react'

/**
 * SearchBar — Thanh tìm phòng nhanh
 * - Props: onSearch({ q, checkIn, checkOut, guests })
 * - Trả về object tìm kiếm khi nhấn "Tìm kiếm"
 */
export default function SearchBar({ onSearch }) {
  const [q, setQ] = React.useState('')
  const [checkIn, setCheckIn] = React.useState('')
  const [checkOut, setCheckOut] = React.useState('')
  const [guests, setGuests] = React.useState(2)

  return (
    <div className="w-full rounded-[28px] border border-white/60 bg-white/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_160px_auto]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            aria-label="Tìm theo địa điểm hoặc tên phòng"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:outline-none"
            placeholder="Tìm theo thành phố, khu vực hoặc tên phòng"
          />
        </div>

        <label className="relative block">
          <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            aria-label="Ngày nhận phòng"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 transition focus:border-blue-300 focus:bg-white focus:outline-none"
          />
        </label>

        <label className="relative block">
          <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            aria-label="Ngày trả phòng"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 transition focus:border-blue-300 focus:bg-white focus:outline-none"
          />
        </label>

        <label className="relative block">
          <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 transition focus:border-blue-300 focus:bg-white focus:outline-none">
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} khách</option>)}
          </select>
        </label>

        <button
          type="button"
          onClick={() => onSearch({ q, checkIn, checkOut, guests })}
          className="h-12 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-5 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          Tìm kiếm
        </button>
      </div>
    </div>
  )
}
