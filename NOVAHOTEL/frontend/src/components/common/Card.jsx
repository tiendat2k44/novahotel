import React from 'react'

/**
 * Card Component — Professional card wrapper
 * Features:
 * - Clean white background
 * - Subtle border and shadow
 * - Rounded corners for modern look
 * - Professional spacing
 * - Accepts additional Tailwind classes for customization
 */
export default function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 ${className}`}
    >
      {children}
    </div>
  )
}
