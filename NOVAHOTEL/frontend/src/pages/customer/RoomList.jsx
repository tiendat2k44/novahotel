import React, { useEffect, useMemo, useState } from 'react'
import { Sliders, Sparkles } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import RoomCard from '../../components/common/RoomCard'
import { roomsAPI } from '../../services/api'

/**
 * Trang danh sách phòng
 * - Bộ lọc gọn, dễ dùng
 * - Lưới phòng sang trọng, thoáng
 */
export default function RoomList() {
  const [allRooms, setAllRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [priceFilter, setPriceFilter] = useState('all')
  const [capacityFilter, setCapacityFilter] = useState([])

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      try {
        const res = await roomsAPI.list({ page: 0, size: 100 })
        const data = res?.data?.content || res?.data || []
        if (mounted) setAllRooms(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Không thể tải danh sách phòng:', err)
        if (mounted) setAllRooms([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const filteredRooms = useMemo(() => {
    let list = [...allRooms]
    if (priceFilter === 'budget') list = list.filter((room) => (room.price || 0) < 500000)
    if (priceFilter === 'medium') list = list.filter((room) => (room.price || 0) >= 500000 && (room.price || 0) <= 1000000)
    if (priceFilter === 'luxury') list = list.filter((room) => (room.price || 0) > 1000000)
    if (capacityFilter.length > 0) list = list.filter((room) => capacityFilter.includes(Number(room.capacity || 1)))
    return list
  }, [allRooms, priceFilter, capacityFilter])

  const filterGroups = [
    { key: 'all', label: 'Tất cả' },
    { key: 'budget', label: 'Dưới 500k' },
    { key: 'medium', label: '500k - 1M' },
    { key: 'luxury', label: 'Trên 1M' },
  ]

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 md:py-12">
      <section className="mb-8 rounded-[36px] bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,64,175,0.92),rgba(9,14,33,0.98))] px-6 py-10 text-white shadow-[0_30px_100px_rgba(15,23,42,0.18)] md:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-blue-50 backdrop-blur">
              <Sparkles size={15} className="text-amber-300" /> Danh sách phòng Nova Hotel
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Lựa chọn phòng phù hợp theo nhu cầu của bạn</h1>
            <p className="mt-3 max-w-2xl text-blue-100 leading-7">
              Tìm phòng theo ngân sách, số khách và cảm giác sang trọng mà bạn mong muốn.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/15 bg-white/10 px-5 py-4 text-sm text-blue-50 backdrop-blur-xl">
            <div className="font-semibold">Mẹo tìm kiếm</div>
            <div className="mt-1 text-blue-100">Chọn bộ lọc bên trái để rút ngắn thời gian tìm phòng.</div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm lg:sticky lg:top-24">
          <div className="mb-5 flex items-center gap-2 text-slate-900">
            <Sliders size={18} className="text-blue-700" />
            <h2 className="text-lg font-bold">Bộ lọc nâng cao</h2>
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Khoảng giá</p>
              <div className="grid gap-2">
                {filterGroups.map((item) => (
                  <label
                    key={item.key}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${priceFilter === item.key ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50/70'}`}
                  >
                    <span>{item.label}</span>
                    <input type="radio" name="price" value={item.key} checked={priceFilter === item.key} onChange={(e) => setPriceFilter(e.target.value)} />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Sức chứa</p>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((cap) => {
                  const active = capacityFilter.includes(cap)
                  return (
                    <button
                      type="button"
                      key={cap}
                      onClick={() => {
                        if (active) setCapacityFilter(capacityFilter.filter((item) => item !== cap))
                        else setCapacityFilter([...capacityFilter, cap])
                      }}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${active ? 'border-amber-300 bg-amber-50 text-amber-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-200 hover:bg-amber-50/70'}`}
                    >
                      {cap}+ khách
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Kết quả phòng</h2>
              <p className="mt-1 text-sm text-slate-500">Hiển thị các phòng phù hợp nhất theo bộ lọc hiện tại.</p>
            </div>
            <div className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {filteredRooms.length} phòng
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center rounded-[30px] border border-white/70 bg-white/90 py-24 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <LoadingSpinner size={2} />
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-slate-300 bg-white/90 p-12 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <p className="text-lg font-semibold text-slate-900">Không có phòng phù hợp</p>
              <p className="mt-2 text-slate-500">Hãy thay đổi bộ lọc để xem thêm lựa chọn.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id || room._id} room={room} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
