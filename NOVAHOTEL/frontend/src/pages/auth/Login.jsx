import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'

/**
 * Trang đăng nhập Nova Hotel
 * - Bố cục hai cột sang trọng
 * - Có validation tiếng Việt
 * - Tối ưu trải nghiệm trên mobile
 */
export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const nextErrors = {}
    if (!email.trim()) nextErrors.email = 'Vui lòng nhập email'
    if (!password) nextErrors.password = 'Vui lòng nhập mật khẩu'
    if (password && password.length < 6) nextErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await login({ username: email, email, password })
      toast.success('Đăng nhập thành công')
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[36px] border border-white/70 bg-white/85 shadow-[0_30px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_36%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,64,175,0.95),rgba(9,14,33,0.98))] p-8 text-white md:p-12 lg:p-14">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),transparent_35%,rgba(255,255,255,0.02))]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-blue-50 backdrop-blur">
                <Sparkles size={15} className="text-amber-300" /> Chào mừng trở lại Nova Hotel
              </div>
              <h1 className="max-w-xl text-4xl font-bold tracking-tight md:text-6xl">
                Đăng nhập để quản lý trải nghiệm lưu trú của bạn.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-blue-100 md:text-lg">
                Từ đặt phòng, xem lịch sử, đến đánh giá chất lượng phòng - mọi thứ đều được tổ chức rõ ràng trong một giao diện tinh tế.
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ['An toàn', 'Xác thực rõ ràng'],
                ['Nhanh', 'Đăng nhập chỉ vài bước'],
                ['Mượt', 'Giao diện tối ưu UX'],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                  <div className="text-sm font-semibold text-white">{title}</div>
                  <div className="mt-1 text-xs leading-6 text-blue-100">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center px-6 py-8 md:px-10 lg:px-12">
          <div className="w-full">
            <div className="mx-auto max-w-md rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg">
                  <Lock size={22} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Đăng nhập</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Sử dụng tài khoản của bạn để tiếp tục.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Field label="Địa chỉ email" error={errors.email} icon={Mail}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: '' })
                    }}
                    placeholder="email@cuaban.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
                  />
                </Field>

                <Field label="Mật khẩu" error={errors.password} icon={Lock}>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errors.password) setErrors({ ...errors, password: '' })
                      }}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 pr-12 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-700">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </Field>

                <div className="flex items-center justify-between text-sm">
                  <Link to="/register" className="font-semibold text-blue-700 transition hover:text-blue-800">Chưa có tài khoản? Đăng ký</Link>
                  <a href="#" className="text-slate-500 transition hover:text-slate-700">Quên mật khẩu?</a>
                </div>

                <Button type="submit" className="w-full py-3" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2"><LoadingSpinner size={0.8} /> Đang đăng nhập...</span>
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function Field({ label, error, icon: Icon, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon size={18} />
        </div>
        {children}
      </div>
      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}
