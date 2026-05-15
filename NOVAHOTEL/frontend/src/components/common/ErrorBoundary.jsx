import React from 'react'
import { AlertTriangle, Home } from 'lucide-react'

/**
 * ErrorBoundary — Component bắt lỗi từ component con
 * Hiển thị giao diện lỗi thân thiện nếu có lỗi xảy ra
 * Hỗ trợ refresh page để thử lại
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.16),transparent_36%),linear-gradient(180deg,#f8fbff_0%,#eef2f7_100%)] px-4">
          <div className="max-w-lg w-full animate-fade-up">
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl">
              <div className="inline-flex items-center justify-center w-18 h-18 rounded-full mb-5 bg-gradient-to-br from-amber-100 to-red-100 shadow-inner">
                <AlertTriangle className="text-red-600" size={34} />
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-3">Có Lỗi Xảy Ra</h1>
              <p className="text-slate-600 mb-5 leading-7">
                Ứng dụng gặp một vấn đề không mong muốn. Vui lòng tải lại hoặc quay về trang chủ để tiếp tục.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-left">
                  <p className="text-xs font-mono text-red-700 break-words leading-5">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-7 flex-col sm:flex-row">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Tải Lại Trang
                </button>
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 text-slate-700 rounded-2xl font-semibold bg-white hover:bg-slate-50 transition-all"
                >
                  <Home size={18} />
                  Trang Chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
