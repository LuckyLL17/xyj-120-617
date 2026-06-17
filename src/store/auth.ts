/**
 * 认证状态管理模块
 * 使用 Zustand 管理用户登录状态
 * 用户数据持久化到 localStorage，密码以 SHA-256 哈希 + 盐值形式加密存储
 */
import { create } from 'zustand'
import { hashPassword, verifyPassword, validatePasswordStrength } from '@/lib/crypto'
import type { StoredUser, CurrentUser } from '@/types'

/** localStorage 存储键名 */
const USERS_KEY = 'mercury_users'
const CURRENT_USER_KEY = 'mercury_current_user'

/** 从 localStorage 读取所有用户数据 */
function getStoredUsers(): StoredUser[] {
  try {
    const data = localStorage.getItem(USERS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/** 将用户数据写入 localStorage */
function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

/** 从 localStorage 读取当前登录用户 ID */
function getCurrentUserId(): string | null {
  return localStorage.getItem(CURRENT_USER_KEY)
}

/** 将当前登录用户 ID 写入 localStorage */
function saveCurrentUserId(userId: string | null): void {
  if (userId) {
    localStorage.setItem(CURRENT_USER_KEY, userId)
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

/** 生成唯一用户 ID */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/** 认证状态接口 */
interface AuthState {
  /** 当前登录用户（不含密码等敏感信息） */
  currentUser: CurrentUser | null
  /** 是否已登录 */
  isAuthenticated: boolean
  /** 初始化：从 localStorage 恢复登录状态 */
  initialize: () => void
  /** 用户注册 */
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  /** 用户登录 */
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  /** 用户登出 */
  logout: () => void
  /** 修改密码（仅支持已登录用户修改自己的密码） */
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,

  /** 应用启动时调用，从 localStorage 恢复上次的登录状态 */
  initialize: () => {
    const userId = getCurrentUserId()
    if (!userId) return

    const users = getStoredUsers()
    const user = users.find((u) => u.id === userId)
    if (user) {
      set({
        currentUser: { id: user.id, username: user.username, createdAt: user.createdAt },
        isAuthenticated: true,
      })
    }
  },

  /** 注册新用户：校验密码强度 → 检查用户名唯一性 → 哈希密码 → 存储 */
  register: async (username: string, password: string) => {
    const trimmedName = username.trim()
    if (!trimmedName) {
      return { success: false, error: '用户名不能为空' }
    }
    if (trimmedName.length < 2 || trimmedName.length > 20) {
      return { success: false, error: '用户名长度需在2-20个字符之间' }
    }

    /* 校验密码强度：必须包含大小写字母和特殊字符 */
    const strengthCheck = validatePasswordStrength(password)
    if (!strengthCheck.valid) {
      return { success: false, error: strengthCheck.errors.join('；') }
    }

    /* 检查用户名是否已存在 */
    const users = getStoredUsers()
    if (users.some((u) => u.username === trimmedName)) {
      return { success: false, error: '该用户名已被注册' }
    }

    /* 对密码进行 SHA-256 哈希 + 随机盐值加密 */
    const { hash, salt } = await hashPassword(password)

    const newUser: StoredUser = {
      id: generateUserId(),
      username: trimmedName,
      passwordHash: hash,
      salt,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveStoredUsers(users)
    saveCurrentUserId(newUser.id)

    set({
      currentUser: { id: newUser.id, username: newUser.username, createdAt: newUser.createdAt },
      isAuthenticated: true,
    })

    return { success: true }
  },

  /** 用户登录：查找用户 → 验证密码哈希 → 设置登录状态 */
  login: async (username: string, password: string) => {
    const trimmedName = username.trim()
    if (!trimmedName) {
      return { success: false, error: '请输入用户名' }
    }
    if (!password) {
      return { success: false, error: '请输入密码' }
    }

    const users = getStoredUsers()
    const user = users.find((u) => u.username === trimmedName)
    if (!user) {
      return { success: false, error: '用户名或密码错误' }
    }

    /* 使用存储的盐值对输入密码进行哈希，与存储的哈希值比对 */
    const isValid = await verifyPassword(password, user.passwordHash, user.salt)
    if (!isValid) {
      return { success: false, error: '用户名或密码错误' }
    }

    saveCurrentUserId(user.id)
    set({
      currentUser: { id: user.id, username: user.username, createdAt: user.createdAt },
      isAuthenticated: true,
    })

    return { success: true }
  },

  /** 用户登出：清除登录状态 */
  logout: () => {
    saveCurrentUserId(null)
    set({ currentUser: null, isAuthenticated: false })
  },

  /** 修改密码：验证旧密码 → 校验新密码强度 → 更新哈希 */
  changePassword: async (oldPassword: string, newPassword: string) => {
    const { currentUser } = get()
    if (!currentUser) {
      return { success: false, error: '请先登录' }
    }
    if (!oldPassword || !newPassword) {
      return { success: false, error: '请输入旧密码和新密码' }
    }

    const users = getStoredUsers()
    const user = users.find((u) => u.id === currentUser.id)
    if (!user) {
      return { success: false, error: '用户不存在' }
    }

    /* 验证旧密码是否正确 */
    const isValid = await verifyPassword(oldPassword, user.passwordHash, user.salt)
    if (!isValid) {
      return { success: false, error: '旧密码错误' }
    }

    /* 校验新密码强度 */
    const strengthCheck = validatePasswordStrength(newPassword)
    if (!strengthCheck.valid) {
      return { success: false, error: strengthCheck.errors.join('；') }
    }

    /* 新密码不能与旧密码相同 */
    if (oldPassword === newPassword) {
      return { success: false, error: '新密码不能与旧密码相同' }
    }

    /* 对新密码进行哈希加密并更新存储 */
    const { hash, salt } = await hashPassword(newPassword)
    user.passwordHash = hash
    user.salt = salt
    saveStoredUsers(users)

    return { success: true }
  },
}))
