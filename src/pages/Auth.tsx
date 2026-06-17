/**
 * 登录/注册页面
 * 提供用户登录和注册功能
 * 包含密码强度验证和表单校验
 */

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'
import type { PasswordValidationResult } from '@/types'
import { cn } from '@/lib/utils'

// 页面模式：登录或注册
type AuthMode = 'login' | 'register'

export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login, register, isLoading, error, clearError } = useAuthStore()

  // 当前模式
  const [mode, setMode] = useState<AuthMode>('login')
  // 表单数据
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // 密码显示状态
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  // 密码验证结果
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidationResult | null>(null)
  // 表单提交错误
  const [formError, setFormError] = useState<string | null>(null)

  // 如果用户已登录，跳转到首页
  useEffect(() => {
    if (user) {
      const from = (location.state as { from?: string })?.from || '/'
      navigate(from, { replace: true })
    }
  }, [user, navigate, location.state])

  // 清除错误信息
  useEffect(() => {
    clearError()
    setFormError(null)
  }, [mode, clearError])

  /**
   * 验证密码强度（前端验证，减少后端请求）
   */
  useEffect(() => {
    if (!password) {
      setPasswordValidation(null)
      return
    }

    // 前端简单验证密码强度
    const hasMinLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    let score = 0
    if (hasMinLength) score += 20
    if (hasUpperCase) score += 20
    if (hasLowerCase) score += 20
    if (hasSpecialChar) score += 20
    if (hasNumber) score += 10
    if (password.length >= 12) score += 5
    if (password.length >= 16) score += 5
    score = Math.min(score, 100)

    const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasSpecialChar

    let strength: PasswordValidationResult['strength']
    if (score < 40) {
      strength = 'weak'
    } else if (score < 60) {
      strength = 'fair'
    } else if (score < 75) {
      strength = 'good'
    } else if (score < 90) {
      strength = 'strong'
    } else {
      strength = 'very-strong'
    }

    const errors: string[] = []
    if (!hasMinLength) errors.push('密码长度至少为8位')
    if (!hasUpperCase) errors.push('密码必须包含至少一个大写字母')
    if (!hasLowerCase) errors.push('密码必须包含至少一个小写字母')
    if (!hasSpecialChar) errors.push('密码必须包含至少一个特殊字符')

    setPasswordValidation({
      isValid,
      strength,
      score,
      errors,
      requirements: {
        hasMinLength,
        hasUpperCase,
        hasLowerCase,
        hasSpecialChar,
        hasNumber,
      },
    })
  }, [password])

  /**
   * 切换登录/注册模式
   */
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setPasswordValidation(null)
    setFormError(null)
    clearError()
  }

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    try {
      if (mode === 'login') {
        // 登录
        if (!username || !password) {
          setFormError('请输入用户名和密码')
          return
        }
        await login(username, password)
      } else {
        // 注册
        if (!username || !email || !password || !confirmPassword) {
          setFormError('请填写所有必填字段')
          return
        }

        if (username.length < 3 || username.length > 20) {
          setFormError('用户名长度需在3-20个字符之间')
          return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          setFormError('请输入有效的邮箱地址')
          return
        }

        if (!passwordValidation?.isValid) {
          setFormError('密码强度不符合要求')
          return
        }

        if (password !== confirmPassword) {
          setFormError('两次输入的密码不一致')
          return
        }

        await register(username, email, password, confirmPassword)
      }
    } catch {
      // 错误已在 store 中处理
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">末日生存社区</h1>
          <p className="text-slate-400">
            {mode === 'login' ? '欢迎回来，幸存者' : '加入我们，一起生存'}
          </p>
        </div>

        {/* 登录/注册选项卡 */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          {/* 选项卡切换 */}
          <div className="flex mb-6 bg-slate-900/50 rounded-lg p-1">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={cn(
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                mode === 'login'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-400 hover:text-white',
              )}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={cn(
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
                mode === 'register'
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-400 hover:text-white',
              )}
            >
              注册
            </button>
          </div>

          {/* 错误提示 */}
          {(error || formError) && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
              {formError || error}
            </div>
          )}

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {mode === 'login' ? '用户名 / 邮箱' : '用户名'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder={mode === 'login' ? '请输入用户名或邮箱' : '请输入用户名'}
                disabled={isLoading}
              />
            </div>

            {/* 邮箱（仅注册时显示） */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  邮箱
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="请输入邮箱地址"
                  disabled={isLoading}
                />
              </div>
            )}

            {/* 密码 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="请输入密码"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 密码强度指示器（仅注册时显示） */}
            {mode === 'register' && password && (
              <div className="p-3 bg-slate-900/30 rounded-lg">
                <PasswordStrengthMeter validation={passwordValidation} />
              </div>
            )}

            {/* 确认密码（仅注册时显示） */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  确认密码
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="请再次输入密码"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">两次输入的密码不一致</p>
                )}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
                isLoading
                  ? 'bg-orange-600/50 cursor-not-allowed text-white/70'
                  : 'bg-orange-600 hover:bg-orange-500 text-white',
              )}
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {mode === 'login' ? '登录' : '注册'}
            </button>
          </form>

          {/* 底部提示 */}
          <div className="mt-6 text-center text-sm text-slate-400">
            {mode === 'login' ? (
              <>
                还没有账号？
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-orange-400 hover:text-orange-300 ml-1"
                >
                  立即注册
                </button>
              </>
            ) : (
              <>
                已有账号？
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-orange-400 hover:text-orange-300 ml-1"
                >
                  立即登录
                </button>
              </>
            )}
          </div>
        </div>

        {/* 安全提示 */}
        <p className="mt-6 text-center text-xs text-slate-500">
          您的密码已加密存储，我们无法查看您的原始密码
        </p>
      </div>
    </div>
  )
}
