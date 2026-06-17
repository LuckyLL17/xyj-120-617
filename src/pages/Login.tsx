/**
 * 用户登录页面
 * 提供用户名/邮箱和密码登录功能
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Shield, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { cn } from '../lib/utils'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error, clearError, user } = useAuthStore()

  // 表单状态
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // 如果已登录，跳转到首页
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  // 清除错误
  useEffect(() => {
    clearError()
    setFormError(null)
  }, [clearError])

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // 表单验证
    if (!usernameOrEmail.trim()) {
      setFormError('请输入用户名或邮箱')
      return
    }
    if (!password) {
      setFormError('请输入密码')
      return
    }

    try {
      await login(usernameOrEmail.trim(), password)
      // 登录成功后跳转到之前的页面或首页
      const from = (location.state as { from?: string })?.from || '/'
      navigate(from, { replace: true })
    } catch {
      // 错误已在store中处理
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">欢迎回来</h1>
          <p className="text-slate-400">登录到末日生存社区</p>
        </div>

        {/* 登录表单卡片 */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 错误提示 */}
            {(error || formError) && (
              <div className="flex items-start gap-3 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error || formError}</p>
              </div>
            )}

            {/* 用户名/邮箱输入 */}
            <div className="space-y-2">
              <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-slate-300">
                用户名或邮箱
              </label>
              <input
                id="usernameOrEmail"
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="请输入用户名或邮箱"
                className={cn(
                  'w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-500',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                  'transition-all duration-200',
                )}
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
                    'w-full px-4 py-3 pr-12 bg-slate-700/50 border rounded-xl text-white placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                    'transition-all duration-200',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl',
                'flex items-center justify-center gap-2 transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-800',
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>登录</span>
                </>
              )}
            </button>
          </form>

          {/* 注册链接 */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              还没有账号？{' '}
              <Link
                to="/register"
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                立即注册
              </Link>
            </p>
          </div>
        </div>

        {/* 返回首页链接 */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-400 text-sm transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
