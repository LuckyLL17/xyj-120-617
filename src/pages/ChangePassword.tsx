/**
 * 修改密码页面
 * 用户可以修改自己的登录密码
 * 需要验证原密码，并设置符合强度要求的新密码
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Key, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter'
import type { PasswordValidationResult } from '@/types'
import { cn } from '@/lib/utils'

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const { user, changePassword, isLoading, error, clearError } = useAuthStore()

  // 表单数据
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  // 密码显示状态
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  // 密码验证结果
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidationResult | null>(null)
  // 表单错误
  const [formError, setFormError] = useState<string | null>(null)
  // 是否修改成功
  const [isSuccess, setIsSuccess] = useState(false)

  // 如果用户未登录，跳转到登录页
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/settings/password' } })
    }
  }, [user, navigate])

  // 清除错误信息
  useEffect(() => {
    clearError()
  }, [clearError])

  /**
   * 验证新密码强度
   */
  useEffect(() => {
    if (!newPassword) {
      setPasswordValidation(null)
      return
    }

    const hasMinLength = newPassword.length >= 8
    const hasUpperCase = /[A-Z]/.test(newPassword)
    const hasLowerCase = /[a-z]/.test(newPassword)
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)

    let score = 0
    if (hasMinLength) score += 20
    if (hasUpperCase) score += 20
    if (hasLowerCase) score += 20
    if (hasSpecialChar) score += 20
    if (hasNumber) score += 10
    if (newPassword.length >= 12) score += 5
    if (newPassword.length >= 16) score += 5
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
  }, [newPassword])

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsSuccess(false)

    try {
      // 验证原密码
      if (!oldPassword) {
        setFormError('请输入原密码')
        return
      }

      // 验证新密码
      if (!newPassword) {
        setFormError('请输入新密码')
        return
      }

      if (!passwordValidation?.isValid) {
        setFormError('新密码强度不符合要求')
        return
      }

      if (!confirmNewPassword) {
        setFormError('请确认新密码')
        return
      }

      if (newPassword !== confirmNewPassword) {
        setFormError('两次输入的新密码不一致')
        return
      }

      if (oldPassword === newPassword) {
        setFormError('新密码不能与原密码相同')
        return
      }

      await changePassword(oldPassword, newPassword, confirmNewPassword)

      // 修改成功
      setIsSuccess(true)
      setOldPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setPasswordValidation(null)
    } catch {
      // 错误已在 store 中处理
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 返回按钮 */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回</span>
      </button>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
        {/* 标题 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-600/20 rounded-lg">
            <Key className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">修改密码</h1>
            <p className="text-sm text-slate-400">定期修改密码可以提高账户安全性</p>
          </div>
        </div>

        {/* 成功提示 */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-medium">密码修改成功</p>
              <p className="text-sm text-green-400/70">请使用新密码重新登录</p>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {(error || formError) && !isSuccess && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
            {formError || error}
          </div>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 原密码 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              原密码
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="请输入原密码"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showOldPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* 新密码 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              新密码
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="请输入新密码"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* 密码强度指示器 */}
          {newPassword && (
            <div className="p-3 bg-slate-900/30 rounded-lg">
              <PasswordStrengthMeter validation={passwordValidation} />
            </div>
          )}

          {/* 确认新密码 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              确认新密码
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="请再次输入新密码"
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
            {confirmNewPassword && newPassword !== confirmNewPassword && (
              <p className="mt-1 text-sm text-red-400">两次输入的密码不一致</p>
            )}
          </div>

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
            确认修改
          </button>
        </form>

        {/* 安全提示 */}
        <div className="mt-6 p-4 bg-slate-900/30 rounded-lg">
          <p className="text-sm text-slate-400 font-medium mb-2">安全提示</p>
          <ul className="text-sm text-slate-500 space-y-1">
            <li>• 密码长度至少8位，包含大小写字母和特殊字符</li>
            <li>• 请勿使用与其他网站相同的密码</li>
            <li>• 定期更换密码可以提高账户安全性</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
