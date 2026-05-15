import React from 'react'
import { Toaster } from 'react-hot-toast'
import AppRouter from './routes/AppRouter'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import LoadingSpinner from './components/common/LoadingSpinner'

/**
 * Thành phần Root App — Wrapper ứng dụng chính
 * Cấu trúc:
 * - AuthProvider: Global authentication context (user state, token management)
 * - ErrorBoundary: Bắt lỗi từ component con, hiển thị giao diện lỗi
 * - Toaster: Toast notification provider từ react-hot-toast
 * - Navbar: Sticky header với navigation và user menu
 * - main.flex-1: Main content area (routes + pages)
 * - Footer: Professional footer với links và thông tin liên hệ
 * 
 * Thiết kế:
 * - Min height screen (full viewport)
 * - Flex layout để push footer xuống bottom
 * - Professional color scheme (xanh, xám, trắng)
 * - Responsive và accessible
 */
export default function App() {
  // Nội dung ứng dụng phụ thuộc vào AuthContext (ví dụ: hiển thị loading khi đang load user)
  function AppContent() {
    const { loading } = useAuth()

    return (
      <>
        {/* Toast Notification Provider */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              style: { background: '#d1fae5', color: '#065f46' },
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              style: { background: '#fee2e2', color: '#991b1b' },
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />

        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 antialiased">
          {/* Sticky Navigation Header */}
          <Navbar />

          {/* Main Content Area (grows to fill available space) */}
          <main className="flex-1 w-full relative">
            {/* Nếu đang load trạng thái auth toàn cục, hiển thị overlay loading */}
            {loading && (
              <div className="absolute inset-0 z-50 bg-white/60 flex items-center justify-center">
                <LoadingSpinner size={2} />
              </div>
            )}

            <AppRouter />
          </main>

          {/* Footer (always at bottom) */}
          <Footer />
        </div>
      </>
    )
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}
