import React, { useEffect, useState } from 'react'
import { Shield, UserPlus, Trash2 } from 'lucide-react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Table from '../../components/admin/Table'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { usersAPI } from '../../services/api'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await usersAPI.list({ page: 0, size: 100 })
        const data = res?.data?.content || res?.data || []
        if (mounted) setUsers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Không thể tải danh sách người dùng:', err)
        if (mounted) setUsers([])
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
      label: 'Người dùng',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
            <Shield size={16} />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{user.name || user.username || 'Người dùng'}</div>
            <div className="text-xs text-gray-500">{user.email || '-'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Vai trò',
      render: (user) => (
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {(user.role || 'customer').toUpperCase()}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: () => <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Đang hoạt động</span>,
    },
    {
      key: 'actions',
      label: 'Hành động',
      render: () => (
        <div className="flex items-center gap-2">
          <button className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100" title="Cập nhật quyền">
            <UserPlus size={16} />
          </button>
          <button className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100" title="Xóa người dùng">
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
          <header className="rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold">Quản Lý Người Dùng</h1>
            <p className="mt-2 text-purple-100">Theo dõi và phân quyền tài khoản khách hàng / quản trị.</p>
          </header>

          {loading ? (
            <div className="flex justify-center rounded-2xl bg-white py-20 shadow-sm">
              <LoadingSpinner size={2} />
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <Table columns={columns} rows={users} />
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
