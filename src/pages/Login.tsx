/**
 * 登录页面
 * 用户输入用户名和密码进行登录，密码通过 SHA-256 哈希验证
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(username, password)
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error || '登录失败')
      }
    } catch {
      setError('登录异常，请稍后重试')
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
            末日生存社区
          </h1>
          <p className="text-slate-400 mt-2">登录你的生存者账户</p>
        </div>

        {/* 登录表单 */}
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
              placeholder="请输入用户名"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              required
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
                placeholder="请输入密码"
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
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                登录
              </>
            )}
          </button>

          {/* 跳转注册 */}
          <p className="text-center text-slate-400 text-sm">
            还没有账户？{' '}
            <Link to="/register" className="text-orange-400 hover:text-orange-300 font-medium">
              立即注册
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
