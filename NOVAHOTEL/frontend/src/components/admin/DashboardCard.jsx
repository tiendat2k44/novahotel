import React from 'react'

/**
 * DashboardCard: small stat card used on admin dashboard
 */
export default function DashboardCard({ title, value, className = '' }){
  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
    </div>
  )
}
