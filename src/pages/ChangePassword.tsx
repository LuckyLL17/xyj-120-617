/**
 * 修改密码页面
 * 用户修改密码，需要验证旧密码并设置符合强度要求的新密码
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, KeyRound, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'
import { cn } from '../lib/utils'

export default function ChangePassword() {
  const navigate = useNavigate()
  const { changePassword, isLoading, error, clearError, user } = useAuthStore()

  // 表单状态
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // 如果未登录，跳转到登录页
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true, state: { from: '/change-password' } })
    }
  }, [user, navigate])

  // 清除错误
  useEffect(() => {
    clearError()
    setFormError(null)
  }, [clearError])

  // 验证密码强度（前端快速验证）
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
    setSuccess(false)

    // 表单验证
    if (!oldPassword) {
      setFormError('请输入旧密码')
      return
    }
    if (!newPassword) {
      setFormError('请输入新密码')
      return
    }
    if (!isPasswordStrong(newPassword)) {
      setFormError('新密码强度不符合要求，需要包含大小写字母、特殊字符且至少8位')
      return
    }
    if (newPassword === oldPassword) {
      setFormError('新密码不能与旧密码相同')
      return
    }
    if (!confirmPassword) {
      setFormError('请确认新密码')
      return
    }
    if (newPassword !== confirmPassword) {
      setFormError('两次输入的新密码不一致')
      return
    }

    try {
      await changePassword(oldPassword, newPassword)
      setSuccess(true)
      // 清空表单
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      // 错误已在store中处理
    }
  }

  if (!user) {
    return null // 未登录时不渲染内容
  }

  return (
    <div className="max-w-md mx-auto">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4">
          <KeyRound className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">修改密码</h1>
        <p className="text-slate-400">为了账户安全，建议定期修改密码</p>
      </div>

      {/* 修改密码表单卡片 */}
      <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 成功提示 */}
          {success && (
            <div className="flex items-start gap-3 p-4 bg-green-900/30 border border-green-800 rounded-xl text-green-300">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">密码修改成功！请使用新密码重新登录以确认。</p>
            </div>
          )}

          {/* 错误提示 */}
          {(error || formError) && (
            <div className="flex items-start gap-3 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error || formError}</p>
            </div>
          )}

          {/* 旧密码输入 */}
          <div className="space-y-2">
            <label htmlFor="oldPassword" className="block text-sm font-medium text-slate-300">
              当前密码
            </label>
            <div className="relative">
              <input
                id="oldPassword"
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="请输入当前密码"
                className={cn(
                  'w-full px-4 py-3 pr-12 bg-slate-700/50 border rounded-xl text-white placeholder-slate-500',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                  'transition-all duration-200',
                )}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 新密码输入 */}
          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300">
              新密码
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="请输入新密码"
                className={cn(
                  'w-full px-4 py-3 pr-12 bg-slate-700/50 border rounded-xl text-white placeholder-slate-500',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                  'transition-all duration-200',
                )}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {/* 密码强度指示器 */}
            {newPassword && <PasswordStrengthMeter password={newPassword} />}
          </div>

          {/* 确认新密码输入 */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
              确认新密码
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入新密码"
                className={cn(
                  'w-full px-4 py-3 pr-12 bg-slate-700/50 border rounded-xl text-white placeholder-slate-500',
                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                  'transition-all duration-200',
                  confirmPassword && newPassword !== confirmPassword && 'border-red-500 focus:ring-red-500',
                  confirmPassword && newPassword === confirmPassword && 'border-green-500/50',
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
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-400">两次输入的密码不一致</p>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <p className="text-xs text-green-400">密码一致</p>
            )}
          </div>

          {/* 修改密码按钮 */}
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
                <KeyRound className="w-5 h-5" />
                <span>修改密码</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
