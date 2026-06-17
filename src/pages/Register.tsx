/**
 * 用户注册页面组件
 * 提供用户注册功能
 * 包含密码强度实时验证和提示
 */

import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, Shield, AlertCircle, Check, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

/**
 * 密码强度验证结果
 */
interface PasswordValidation {
  hasMinLength: boolean
  hasLowerCase: boolean
  hasUpperCase: boolean
  hasSpecialChar: boolean
}

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading, error, user, clearError } = useAuthStore()

  // 表单状态
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
   * 计算密码强度验证结果
   */
  const passwordValidation: PasswordValidation = useMemo(() => {
    return {
      hasMinLength: password.length >= 8,
      hasLowerCase: /[a-z]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(password),
    }
  }, [password])

  /**
   * 计算密码强度百分比
   */
  const passwordStrength = useMemo(() => {
    const checks = [
      passwordValidation.hasMinLength,
      passwordValidation.hasLowerCase,
      passwordValidation.hasUpperCase,
      passwordValidation.hasSpecialChar,
    ]
    const passed = checks.filter(Boolean).length
    return (passed / checks.length) * 100
  }, [passwordValidation])

  /**
   * 获取密码强度对应的颜色
   */
  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-slate-600'
    if (passwordStrength <= 25) return 'bg-red-500'
    if (passwordStrength <= 50) return 'bg-orange-500'
    if (passwordStrength <= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  /**
   * 获取密码强度文字描述
   */
  const getStrengthText = () => {
    if (passwordStrength === 0) return '请输入密码'
    if (passwordStrength <= 25) return '弱'
    if (passwordStrength <= 50) return '一般'
    if (passwordStrength <= 75) return '中等'
    return '强'
  }

  /**
   * 表单提交处理
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // 用户名验证
    if (!username.trim()) {
      setFormError('请输入用户名')
      return
    }
    if (username.length < 3 || username.length > 20) {
      setFormError('用户名长度应为3-20个字符')
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setFormError('用户名只能包含字母、数字和下划线')
      return
    }

    // 密码验证
    if (!password) {
      setFormError('请输入密码')
      return
    }
    if (passwordStrength < 100) {
      setFormError('密码不符合强度要求')
      return
    }

    // 确认密码验证
    if (!confirmPassword) {
      setFormError('请确认密码')
      return
    }
    if (password !== confirmPassword) {
      setFormError('两次输入的密码不一致')
      return
    }

    // 调用注册 API
    const success = await register(username.trim(), password, confirmPassword, email || undefined)
    if (success) {
      navigate('/')
    }
  }

  // 显示的错误信息
  const displayError = formError || error

  // 密码要求列表
  const passwordRequirements = [
    { key: 'hasMinLength', label: '至少8个字符' },
    { key: 'hasLowerCase', label: '包含小写字母' },
    { key: 'hasUpperCase', label: '包含大写字母' },
    { key: 'hasSpecialChar', label: '包含特殊字符' },
  ] as const

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* 注册卡片 */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* 卡片头部 */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">创建账号</h1>
            <p className="text-orange-100 mt-2">加入生存者社区，学习应急技能</p>
          </div>

          {/* 表单区域 */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
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
                用户名 <span className="text-red-400">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="3-20个字符，字母/数字/下划线"
                className={cn(
                  'w-full px-4 py-3 rounded-lg bg-slate-900 border transition-colors',
                  'border-slate-600 text-slate-100 placeholder-slate-500',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                )}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            {/* 邮箱输入（可选） */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                邮箱 <span className="text-slate-500">（可选）</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="用于找回密码"
                className={cn(
                  'w-full px-4 py-3 rounded-lg bg-slate-900 border transition-colors',
                  'border-slate-600 text-slate-100 placeholder-slate-500',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                )}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            {/* 密码输入 */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                密码 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请设置密码"
                  className={cn(
                    'w-full px-4 py-3 pr-12 rounded-lg bg-slate-900 border transition-colors',
                    'border-slate-600 text-slate-100 placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                  )}
                  disabled={isLoading}
                  autoComplete="new-password"
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

              {/* 密码强度条 */}
              {password && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">密码强度</span>
                    <span
                      className={cn(
                        'font-medium',
                        passwordStrength <= 25
                          ? 'text-red-400'
                          : passwordStrength <= 50
                            ? 'text-orange-400'
                            : passwordStrength <= 75
                              ? 'text-yellow-400'
                              : 'text-green-400',
                      )}
                    >
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full transition-all duration-300', getStrengthColor())}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 密码要求列表 */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {passwordRequirements.map((req) => {
                  const passed = passwordValidation[req.key]
                  return (
                    <div
                      key={req.key}
                      className={cn(
                        'flex items-center gap-2 text-xs',
                        passed ? 'text-green-400' : 'text-slate-500',
                      )}
                    >
                      {passed ? (
                        <Check className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span>{req.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 确认密码输入 */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                确认密码 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  className={cn(
                    'w-full px-4 py-3 pr-12 rounded-lg bg-slate-900 border transition-colors',
                    'border-slate-600 text-slate-100 placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                    confirmPassword && password !== confirmPassword && 'border-red-500',
                  )}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-400 text-xs">两次输入的密码不一致</p>
              )}
            </div>

            {/* 注册按钮 */}
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
                  <UserPlus className="w-5 h-5" />
                  <span>注册</span>
                </>
              )}
            </button>

            {/* 登录链接 */}
            <div className="text-center text-slate-400 text-sm">
              已有账号？{' '}
              <Link to="/login" className="text-orange-400 hover:text-orange-300 transition-colors">
                立即登录
              </Link>
            </div>
          </form>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-slate-500 text-sm mt-6">
          注册即表示你同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  )
}
