/**
 * 修改密码页面组件
 * 提供用户修改密码功能
 * 包含原密码验证和新密码强度检查
 */

import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Key, Shield, AlertCircle, Check, X, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

export default function ChangePassword() {
  const navigate = useNavigate()
  const { changePassword, isLoading, error, user, clearError } = useAuthStore()

  // 表单状态
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // 如果用户未登录，重定向到登录页
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // 清除 store 中的错误
  useEffect(() => {
    clearError()
  }, [clearError])

  /**
   * 计算新密码强度验证结果
   */
  const passwordValidation = useMemo(() => {
    return {
      hasMinLength: newPassword.length >= 8,
      hasLowerCase: /[a-z]/.test(newPassword),
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(newPassword),
    }
  }, [newPassword])

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
    if (passwordStrength === 0) return '请输入新密码'
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
    setIsSuccess(false)

    // 原密码验证
    if (!oldPassword) {
      setFormError('请输入原密码')
      return
    }

    // 新密码验证
    if (!newPassword) {
      setFormError('请输入新密码')
      return
    }
    if (passwordStrength < 100) {
      setFormError('新密码不符合强度要求')
      return
    }

    // 确认密码验证
    if (!confirmNewPassword) {
      setFormError('请确认新密码')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setFormError('两次输入的新密码不一致')
      return
    }

    // 检查新密码是否与原密码相同
    if (newPassword === oldPassword) {
      setFormError('新密码不能与原密码相同')
      return
    }

    // 调用修改密码 API
    const success = await changePassword(oldPassword, newPassword, confirmNewPassword)
    if (success) {
      setIsSuccess(true)
      // 清空表单
      setOldPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    }
  }

  // 显示的错误信息
  const displayError = formError || error

  // 密码要求列表
  const passwordRequirements = [
    { key: 'hasMinLength' as const, label: '至少8个字符' },
    { key: 'hasLowerCase' as const, label: '包含小写字母' },
    { key: 'hasUpperCase' as const, label: '包含大写字母' },
    { key: 'hasSpecialChar' as const, label: '包含特殊字符' },
  ]

  if (!user) {
    return null
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* 修改密码卡片 */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* 卡片头部 */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">修改密码</h1>
            <p className="text-orange-100 mt-2">为了账号安全，请定期修改密码</p>
          </div>

          {/* 表单区域 */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* 成功提示 */}
            {isSuccess && (
              <div className="flex items-center gap-3 p-4 bg-green-900/30 border border-green-800 rounded-lg text-green-300">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">密码修改成功！</span>
              </div>
            )}

            {/* 错误提示 */}
            {displayError && (
              <div className="flex items-center gap-3 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{displayError}</span>
              </div>
            )}

            {/* 当前用户信息 */}
            <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full border border-slate-600"
              />
              <div>
                <p className="font-medium text-slate-200">{user.username}</p>
                <p className="text-xs text-slate-400">当前登录账号</p>
              </div>
            </div>

            {/* 原密码输入 */}
            <div className="space-y-2">
              <label htmlFor="oldPassword" className="block text-sm font-medium text-slate-300">
                原密码 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="请输入原密码"
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
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 新密码输入 */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300">
                新密码 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="请设置新密码"
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
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* 密码强度条 */}
              {newPassword && (
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

            {/* 确认新密码输入 */}
            <div className="space-y-2">
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-slate-300">
                确认新密码 <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                  className={cn(
                    'w-full px-4 py-3 pr-12 rounded-lg bg-slate-900 border transition-colors',
                    'border-slate-600 text-slate-100 placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                    confirmNewPassword && newPassword !== confirmNewPassword && 'border-red-500',
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
              {confirmNewPassword && newPassword !== confirmNewPassword && (
                <p className="text-red-400 text-xs">两次输入的密码不一致</p>
              )}
            </div>

            {/* 提交按钮 */}
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
                  <Shield className="w-5 h-5" />
                  <span>确认修改</span>
                </>
              )}
            </button>

            {/* 返回按钮 */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={cn(
                'w-full py-3 px-4 rounded-lg border border-slate-600 text-slate-300',
                'hover:bg-slate-700 transition-colors',
              )}
            >
              返回上一页
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
