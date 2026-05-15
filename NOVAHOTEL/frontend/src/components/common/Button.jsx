import React from 'react'

/**
 * Button Component — Reusable professional button
 * Props:
 * - `children`: Button content/text
 * - `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
 * - `size`: 'sm' | 'md' | 'lg'
 * - `disabled`: boolean - disable button
 * - `className`: Additional Tailwind classes
 * - All standard HTML button attributes supported
 */
export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  ...rest
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const variants = {
    primary: 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-[0_18px_40px_rgba(29,78,216,0.28)] hover:shadow-[0_24px_48px_rgba(29,78,216,0.34)] hover:-translate-y-0.5 focus:ring-blue-300 disabled:hover:shadow-none disabled:hover:translate-y-0',
    secondary: 'bg-white text-slate-800 border border-slate-200 shadow-sm hover:border-blue-200 hover:bg-blue-50/50 focus:ring-slate-200',
    ghost: 'bg-transparent text-blue-700 hover:bg-blue-50 focus:ring-blue-300',
    danger: 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-[0_18px_40px_rgba(220,38,38,0.22)] hover:shadow-[0_22px_44px_rgba(220,38,38,0.3)] hover:-translate-y-0.5 focus:ring-red-300',
  }

  return (
    <button
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}
