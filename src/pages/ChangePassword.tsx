/**
 * 修改密码页面
 * 仅支持已登录用户修改自己的密码，需验证旧密码并校验新密码强度
 */
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, Eye, EyeOff, Check, X, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { validatePasswordStrength } from '@/lib/crypto'

export default function ChangePassword() {
  const navigate = useNavigate()
  const { currentUser, changePassword } = useAuthStore()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  /* 实时计算新密码强度各项指标 */
  const passwordChecks = useMemo(() => {
    const checks = [
      { label: '至少8位字符', passed: newPassword.length >= 8 },
      { label: '包含小写字母', passed: /[a-z]/.test(newPassword) },
      { label: '包含大写字母', passed: /[A-Z]/.test(newPassword) },
      { label: '包含特殊字符', passed: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(newPassword) },
    ]
    const passedCount = checks.filter((c) => c.passed).length
    return { checks, passedCount }
  }, [newPassword])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    /* 二次确认密码校验 */
    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致')
      return
    }

    /* 新密码强度校验 */
    const strengthCheck = validatePasswordStrength(newPassword)
    if (!strengthCheck.valid) {
      setError(strengthCheck.errors.join('；'))
      return
    }

    setLoading(true)
    try {
      const result = await changePassword(oldPassword, newPassword)
      if (result.success) {
        setSuccess(true)
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setError(result.error || '修改失败')
      }
    } catch {
      setError('修改异常，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  /* 未登录时提示 */
  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <KeyRound className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">请先登录后再修改密码</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
          >
            去登录
          </button>
        </div>
      </div>
    )
  }

  /* 修改成功提示 */
  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">密码修改成功</h2>
          <p className="text-slate-400 mb-6">你的密码已安全更新</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-2xl mb-4">
            <KeyRound className="w-8 h-8 text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">修改密码</h1>
          <p className="text-slate-400 mt-2">
            当前账户：<span className="text-orange-400">{currentUser.username}</span>
          </p>
        </div>

        {/* 修改密码表单 */}
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-5">
          {/* 错误提示 */}
          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* 旧密码输入 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">旧密码</label>
            <div className="relative">
              <input
                type={showOld ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="请输入当前密码"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 新密码输入 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">新密码</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="请输入新密码"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* 新密码强度实时提示 */}
            {newPassword && (
              <div className="mt-3 space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordChecks.passedCount >= level
                          ? passwordChecks.passedCount <= 1
                            ? 'bg-red-500'
                            : passwordChecks.passedCount <= 2
                              ? 'bg-yellow-500'
                              : passwordChecks.passedCount <= 3
                                ? 'bg-blue-500'
                                : 'bg-green-500'
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                {passwordChecks.checks.map((check) => (
                  <div key={check.label} className="flex items-center gap-2 text-xs">
                    {check.passed ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span className={check.passed ? 'text-green-400' : 'text-slate-500'}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 确认新密码 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">确认新密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再次输入新密码"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              required
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1.5 text-xs text-red-400">两次输入的密码不一致</p>
            )}
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound className="w-5 h-5" />
                确认修改
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
