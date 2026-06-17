/**
 * 用户登录页面组件
 * 提供用户名和密码登录功能
 * 包含登录状态展示和错误提示
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, Shield, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error, user, clearError } = useAuthStore()

  // 表单状态
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // 如果用户已登录，重定向到首页
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  // 清除 store 中的错误
  useEffect(() => {
    clearError()
  }, [clearError])

  /**
   * 表单提交处理
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // 表单验证
    if (!username.trim()) {
      setFormError('请输入用户名')
      return
    }
    if (!password) {
      setFormError('请输入密码')
      return
    }

    // 调用登录 API
    const success = await login(username.trim(), password)
    if (success) {
      navigate('/')
    }
  }

  // 显示的错误信息（优先显示表单验证错误）
  const displayError = formError || error

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* 登录卡片 */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* 卡片头部 */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">欢迎回来</h1>
            <p className="text-orange-100 mt-2">登录你的生存者社区账号</p>
          </div>

          {/* 表单区域 */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* 错误提示 */}
            {displayError && (
              <div className="flex items-center gap-3 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{displayError}</span>
              </div>
            )}

            {/* 用户名输入 */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                用户名
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                className={cn(
                  'w-full px-4 py-3 rounded-lg bg-slate-900 border transition-colors',
                  'border-slate-600 text-slate-100 placeholder-slate-500',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                )}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            {/* 密码输入 */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                密码
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className={cn(
                    'w-full px-4 py-3 pr-12 rounded-lg bg-slate-900 border transition-colors',
                    'border-slate-600 text-slate-100 placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                  )}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg',
                'bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold',
                'hover:from-orange-500 hover:to-red-500 transition-all',
                'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-800',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>登录</span>
                </>
              )}
            </button>

            {/* 注册链接 */}
            <div className="text-center text-slate-400 text-sm">
              还没有账号？{' '}
              <Link to="/register" className="text-orange-400 hover:text-orange-300 transition-colors">
                立即注册
              </Link>
            </div>
          </form>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-slate-500 text-sm mt-6">
          登录即表示你同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  )
}
