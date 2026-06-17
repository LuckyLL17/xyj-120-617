/**
 * 用户注册页面
 * 提供用户名、邮箱和密码注册功能，包含密码强度验证
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'
import { cn } from '../lib/utils'

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError, user } = useAuthStore()

  // 表单状态
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

  // 验证邮箱格式
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 验证密码强度（前端快速验证，避免不必要的API调用）
  const isPasswordStrong = (password: string) => {
    if (password.length < 8) return false
    if (!/[a-z]/.test(password)) return false
    if (!/[A-Z]/.test(password)) return false
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/.test(password)) return false
    return true
  }

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // 表单验证
    if (!username.trim()) {
      setFormError('请输入用户名')
      return
    }
    if (username.length < 3 || username.length > 20) {
      setFormError('用户名长度需要在3-20位之间')
      return
    }
    if (!email.trim()) {
      setFormError('请输入邮箱')
      return
    }
    if (!isValidEmail(email)) {
      setFormError('请输入有效的邮箱地址')
      return
    }
    if (!password) {
      setFormError('请输入密码')
      return
    }
    if (!isPasswordStrong(password)) {
      setFormError('密码强度不符合要求，需要包含大小写字母、特殊字符且至少8位')
      return
    }
    if (!confirmPassword) {
      setFormError('请确认密码')
      return
    }
    if (password !== confirmPassword) {
      setFormError('两次输入的密码不一致')
      return
    }

    try {
      await register(username.trim(), email.trim(), password)
      // 注册成功后跳转到首页
      navigate('/', { replace: true })
    } catch {
      // 错误已在store中处理
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">创建账号</h1>
          <p className="text-slate-400">加入末日生存社区</p>
        </div>

        {/* 注册表单卡片 */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 错误提示 */}
            {(error || formError) && (
              <div className="flex items-start gap-3 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error || formError}</p>
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
                placeholder="请输入用户名（3-20位）"
                className={cn(
                  'w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white placeholder-slate-500',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                  'transition-all duration-200',
                )}
              />
            </div>

            {/* 邮箱输入 */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
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
              {/* 密码强度指示器 */}
              {password && <PasswordStrengthMeter password={password} />}
            </div>

            {/* 确认密码输入 */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                确认密码
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  className={cn(
                    'w-full px-4 py-3 pr-12 bg-slate-700/50 border rounded-xl text-white placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                    'transition-all duration-200',
                    confirmPassword && password !== confirmPassword && 'border-red-500 focus:ring-red-500',
                    confirmPassword && password === confirmPassword && 'border-green-500/50',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-400">两次输入的密码不一致</p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="text-xs text-green-400">密码一致</p>
              )}
            </div>

            {/* 注册按钮 */}
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
                  <UserPlus className="w-5 h-5" />
                  <span>注册</span>
                </>
              )}
            </button>
          </form>

          {/* 登录链接 */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              已有账号？{' '}
              <Link
                to="/login"
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                立即登录
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
