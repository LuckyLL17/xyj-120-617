import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Backpack, 
  ClipboardList, 
  Users, 
  Home, 
  Menu, 
  X,
  Shield,
  AlertTriangle,
  Gamepad2,
  ArrowLeftRight,
  LogIn,
  UserPlus,
  LogOut,
  Key,
  User,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/knowledge', label: '生存知识', icon: BookOpen },
  { path: '/equipment', label: '装备库', icon: Backpack },
  { path: '/checklist', label: '生存清单', icon: ClipboardList },
  { path: '/simulator', label: '生存模拟器', icon: Gamepad2 },
  { path: '/exchange', label: '技能装备交换', icon: ArrowLeftRight },
  { path: '/community', label: '社区', icon: Users },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout, init } = useAuthStore()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // 初始化：从本地存储恢复用户信息
  useEffect(() => {
    init()
  }, [init])

  // 点击外部关闭用户菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /**
   * 处理登出
   */
  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                末日生存社区
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path))
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                      isActive
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-3">
              {/* 用户菜单 - 桌面端 */}
              <div className="hidden sm:block relative" ref={userMenuRef}>
                {user ? (
                  // 已登录状态
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-8 h-8 rounded-full border border-slate-600"
                      />
                      <span className="text-sm text-slate-200 max-w-24 truncate">
                        {user.username}
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 text-slate-400 transition-transform',
                          userMenuOpen && 'rotate-180',
                        )}
                      />
                    </button>

                    {/* 下拉菜单 */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-slate-700">
                          <p className="text-sm font-medium text-slate-200">{user.username}</p>
                          <p className="text-xs text-slate-400">已登录</p>
                        </div>
                        <button
                          onClick={() => {
                            navigate('/change-password')
                            setUserMenuOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                          <Key className="w-4 h-4" />
                          <span>修改密码</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/30 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>退出登录</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  // 未登录状态
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>登录</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>注册</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 移动端 - 用户菜单按钮 */}
              <button
                className="md:hidden p-2 hover:bg-slate-700 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 bg-slate-800">
            <nav className="container mx-auto px-4 py-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path))
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                      isActive
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {/* 移动端用户菜单 */}
              <div className="border-t border-slate-700 mt-2 pt-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-10 h-10 rounded-full border border-slate-600"
                      />
                      <div>
                        <p className="font-medium text-slate-200">{user.username}</p>
                        <p className="text-xs text-slate-400">已登录</p>
                      </div>
                    </div>
                    <Link
                      to="/change-password"
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Key className="w-5 h-5" />
                      <span>修改密码</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/30 rounded-lg transition-all text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>退出登录</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5" />
                      <span>登录</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center gap-3 px-4 py-3 text-orange-400 hover:bg-orange-900/30 rounded-lg transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>注册</span>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-slate-800 border-t border-slate-700 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <span className="font-semibold">末日生存社区</span>
            </div>
            <p className="text-slate-400 text-sm text-center">
              本站内容仅供学习交流，请在法律允许范围内使用。
              紧急情况请拨打当地应急电话。
            </p>
            <p className="text-slate-500 text-sm">
              © 2024 末日生存社区
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
