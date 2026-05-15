import React, { useEffect, useState } from 'react'
import { Home, Plus, Edit2, Trash2 } from 'lucide-react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Table from '../../components/admin/Table'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { roomsAPI } from '../../services/api'

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}

export default function ManageRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await roomsAPI.list({ page: 0, size: 100 })
        const data = res?.data?.content || res?.data || []
        if (mounted) setRooms(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Không thể tải danh sách phòng:', err)
        if (mounted) setRooms([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const columns = [
    {
      key: 'name',
      label: 'Tên phòng',
      render: (room) => (
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
            <Home size={16} />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{room.name || 'Phòng'}</div>
            <div className="text-xs text-gray-500">{room.roomType || 'Tiêu chuẩn'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Giá/đêm',
      render: (room) => <span className="font-semibold text-green-600">{formatCurrency(room.price)}</span>,
    },
    {
      key: 'capacity',
      label: 'Sức chứa',
      render: (room) => <span>{room.capacity || 2} khách</span>,
    },
    {
      key: 'available',
      label: 'Trạng thái',
      render: (room) => (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${room.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {room.available ? 'Có sẵn' : 'Đã đặt'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Hành động',
      render: () => (
        <div className="flex items-center gap-2">
          <button className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100" title="Chỉnh sửa phòng">
            <Edit2 size={16} />
          </button>
          <button className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100" title="Xóa phòng">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-5">
        <aside className="lg:col-span-1">
          <AdminSidebar />
        </aside>

        <section className="lg:col-span-4 space-y-6">
          <header className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white shadow-lg md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Quản Lý Phòng</h1>
              <p className="mt-2 text-blue-100">Thêm, cập nhật và theo dõi trạng thái phòng khách sạn.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">
              <Plus size={18} /> Thêm phòng
            </button>
          </header>

          {loading ? (
            <div className="flex justify-center rounded-2xl bg-white py-20 shadow-sm">
              <LoadingSpinner size={2} />
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <Table columns={columns} rows={rooms} />
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
