import React from 'react'

/**
 * Table Component — Bảng dữ liệu chuyên nghiệp
 * Tính năng:
 * - Cấu hình cột linh hoạt với hàm render tùy chỉnh
 * - Responsive và cuộn ngang khi cần
 * - Hiệu ứng hover trên từng dòng
 * - Hàng xen kẽ màu để dễ đọc
 * - Header rõ ràng, sạch sẽ
 */
export default function Table({ columns = [], rows = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white">
        {/* Tiêu đề bảng */}
        <thead>
          <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Nội dung bảng */}
        <tbody className="divide-y divide-gray-200">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={row.id || idx}
                className={`transition-colors duration-200 hover:bg-blue-50 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm text-gray-700"
                  >
                    {col.render ? col.render(row) : row[col.key] || '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
