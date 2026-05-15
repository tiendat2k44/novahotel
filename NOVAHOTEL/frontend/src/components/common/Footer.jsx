import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Sparkles } from 'lucide-react'

/**
 * Footer — Chân trang chính của ứng dụng
 * - Hiển thị thông tin thương hiệu, liên kết nhanh và thông tin liên hệ
 * - Tất cả văn bản bằng tiếng Việt
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-12 w-full border-t border-slate-200 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 font-bold text-white shadow-lg">N</div>
              <h3 className="text-xl font-bold text-white">NovaHotel <Sparkles size={14} className="inline text-amber-400" /></h3>
            </div>
            <p className="max-w-sm text-sm leading-7 text-slate-400">Trải nghiệm nghỉ dưỡng hạng sang với dịch vụ chuyên nghiệp, tiện nghi hiện đại và phong cách tinh tế.</p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Liên kết nhanh</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="transition hover:text-amber-300">Trang Chủ</Link></li>
              <li><Link to="/rooms" className="transition hover:text-amber-300">Phòng</Link></li>
              <li><Link to="/login" className="transition hover:text-amber-300">Đăng nhập</Link></li>
              <li><Link to="/register" className="transition hover:text-amber-300">Đăng ký</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><MapPin size={16} className="text-amber-400" /> 123 Đường Khách Sạn, TP.HCM</li>
              <li className="flex items-center gap-2"><Phone size={16} className="text-amber-400" /> +84 (28) 1234-5678</li>
              <li className="flex items-center gap-2"><Mail size={16} className="text-amber-400" /> info@novahotel.com</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Theo dõi</h4>
            <div className="flex gap-3">
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-blue-600">f</a>
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-blue-500">𝕏</a>
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-pink-600">📷</a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-400 sm:flex-row">
            <p>© {currentYear} NovaHotel. Bảo lưu mọi quyền.</p>
            <div className="flex gap-4">
              <a href="#privacy" className="transition hover:text-amber-300">Chính Sách Bảo Mật</a>
              <span className="text-slate-600">•</span>
              <a href="#terms" className="transition hover:text-amber-300">Điều Khoản Dịch Vụ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
