import React from 'react'

/*
  LoadingSpinner.jsx

  Mục đích:
  - Hiển thị spinner tải nhẹ để dùng ở nhiều nơi trong ứng dụng.
  - Hỗ trợ prop `size` (kích cỡ tương đối) để tái sử dụng.

  Sử dụng:
  - <LoadingSpinner size={1.5} />
*/

export default function LoadingSpinner({ size = 1 }) {
  const s = Math.max(0.5, Number(size) || 1)
  return (
    <div className="flex items-center justify-center">
      <svg
        className="animate-spin text-blue-700 drop-shadow-sm"
        style={{ width: `${s * 24}px`, height: `${s * 24}px` }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-15" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
    </div>
  )
}
