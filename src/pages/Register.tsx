/**
 * 注册页面
 * 用户注册新账户，密码强度必须包含大写字母、小写字母和特殊字符
 */
import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, UserPlus, Check, X } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { validatePasswordStrength } from '@/lib/crypto'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuthStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /* 实时计算密码强度各项指标 */
  const passwordChecks = useMemo(() => {
    const checks = [
      { label: '至少8位字符', passed: password.length >= 8 },
      { label: '包含小写字母', passed: /[a-z]/.test(password) },
      { label: '包含大写字母', passed: /[A-Z]/.test(password) },
      { label: '包含特殊字符', passed: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password) },
    ]
    const passedCount = checks.filter((c) => c.passed).length
    return { checks, passedCount }
  }, [password])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    /* 二次确认密码校验 */
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    /* 密码强度校验 */
    const strengthCheck = validatePasswordStrength(password)
    if (!strengthCheck.valid) {
      setError(strengthCheck.errors.join('；'))
      return
    }

    setLoading(true)
    try {
      const result = await register(username, password)
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error || '注册失败')
      }
    } catch {
      setError('注册异常，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* 顶部品牌标识 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            加入生存者社区
          </h1>
          <p className="text-slate-400 mt-2">创建你的生存者账户</p>
        </div>

        {/* 注册表单 */}
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-5">
          {/* 错误提示 */}
          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* 用户名输入 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="2-20个字符"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              required
              minLength={2}
              maxLength={20}
            />
          </div>

          {/* 密码输入 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">密码</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请设置密码"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* 密码强度实时提示 */}
            {password && (
              <div className="mt-3 space-y-1.5">
                {/* 强度进度条 */}
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
                {/* 各项校验状态 */}
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

          {/* 确认密码 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">确认密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再次输入密码"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1.5 text-xs text-red-400">两次输入的密码不一致</p>
            )}
          </div>

          {/* 注册按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                注册
              </>
            )}
          </button>

          {/* 跳转登录 */}
          <p className="text-center text-slate-400 text-sm">
            已有账户？{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium">
              立即登录
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
