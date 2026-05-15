import React from 'react'
import { Link } from 'react-router-dom'

/*
  RoomCard.jsx

  Mục đích:
  - Hiển thị một thẻ phòng đẹp mắt trong grid danh sách phòng.
  - Thể hiện ảnh, tên phòng, giá, tiện ích ngắn, rating và nút "Đặt phòng ngay".

  Props:
  - room: object chứa thông tin phòng (id, name, image, price, facilities, rating)

  Lưu ý:
  - Văn bản giao diện hoàn toàn bằng tiếng Việt.
*/

export default function RoomCard({ room }) {
  const priceFormatted = room?.price
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)
    : 'Liên hệ'

  const amenities = (room?.facilities || []).slice(0, 3).join(' · ')
  const roomType = room?.roomType || 'Tiêu chuẩn'

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.14)]">
      <Link to={`/room/${room?.id}`} className="block">
        <div className="relative h-56 overflow-hidden bg-slate-100">
          {room?.image ? (
            <img
              src={room.image}
              alt={room.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">Không có ảnh</div>
          )}
          <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/85 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
            {roomType}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-slate-900/0 to-transparent opacity-0 transition group-hover:opacity-100" />
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <Link to={`/room/${room?.id}`}>
          <h3 className="line-clamp-1 text-xl font-bold tracking-tight text-slate-900 transition group-hover:text-blue-700">{room?.name || 'Phòng'}</h3>
        </Link>
        <p className="min-h-[40px] text-sm leading-6 text-slate-500">{amenities || 'Tiện nghi đang cập nhật'}</p>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Giá mỗi đêm</div>
            <div className="text-2xl font-extrabold text-emerald-600">{priceFormatted}</div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">⭐ {room?.rating || 4.5}</div>
            <Link to={`/room/${room?.id}`} className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
