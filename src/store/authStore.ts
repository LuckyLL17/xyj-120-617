/**
 * 用户认证状态管理 store
 * 使用 zustand 管理用户登录状态、用户信息
 * 用户信息存储在 localStorage 中，实现持久化
 * 密码加密后存储在本地（记住密码功能）
 */

import { create } from 'zustand'
import type { User } from '@/types'
import { api } from '@/lib/api'
import {
  saveEncryptedPassword,
  getEncryptedPassword,
  removeEncryptedPassword,
} from '@/lib/crypto'

// 本地存储的 key
const STORAGE_KEY = 'survival_auth_user'
// 记住密码的存储 key 前缀
const REMEMBER_ME_KEY = 'survival_remember'

/**
 * 记住密码的数据结构
 */
interface RememberedCredentials {
  username: string
  // 密码是加密后存储的
}

/**
 * 认证 store 状态和方法定义
 */
interface AuthState {
  // 当前登录用户信息，未登录则为 null
  user: User | null
  // 登录加载状态
  isLoading: boolean
  // 错误信息
  error: string | null
  // 是否记住密码
  rememberMe: boolean

  // 初始化：从本地存储恢复用户信息
  init: () => void
  // 用户登录
  login: (username: string, password: string, remember?: boolean) => Promise<boolean>
  // 用户注册
  register: (
    username: string,
    password: string,
    confirmPassword: string,
    email?: string,
  ) => Promise<boolean>
  // 用户登出
  logout: () => Promise<void>
  // 修改密码
  changePassword: (
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) => Promise<boolean>
  // 清除错误信息
  clearError: () => void
  // 获取记住的密码（返回用户名和密码）
  getRememberedCredentials: () => Promise<{ username: string; password: string } | null>
  // 设置是否记住密码
  setRememberMe: (remember: boolean) => void
}

/**
 * 从本地存储获取用户信息
 * @returns 用户信息或 null
 */
function loadUserFromStorage(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as User
    }
  } catch (error) {
    console.error('从本地存储读取用户信息失败:', error)
  }
  return null
}

/**
 * 保存用户信息到本地存储
 * @param user 用户信息
 */
function saveUserToStorage(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch (error) {
    console.error('保存用户信息到本地存储失败:', error)
  }
}

/**
 * 从本地存储读取是否记住密码
 * @returns 是否记住密码
 */
function loadRememberMeFromStorage(): boolean {
  try {
    return localStorage.getItem('survival_remember_me') === 'true'
  } catch (error) {
    return false
  }
}

/**
 * 保存是否记住密码到本地存储
 * @param remember 是否记住密码
 */
function saveRememberMeToStorage(remember: boolean): void {
  try {
    localStorage.setItem('survival_remember_me', String(remember))
  } catch (error) {
    console.error('保存记住密码设置失败:', error)
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  rememberMe: loadRememberMeFromStorage(),

  /**
   * 初始化：从本地存储恢复用户信息
   */
  init: () => {
    const user = loadUserFromStorage()
    if (user) {
      set({ user })
    }
  },

  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @param remember 是否记住密码（加密存储）
   * @returns 是否登录成功
   */
  login: async (username: string, password: string, remember?: boolean): Promise<boolean> => {
    set({ isLoading: true, error: null })
    try {
      const result = await api.auth.login({ username, password })
      const user = (result as { user: User; message: string }).user
      saveUserToStorage(user)

      // 处理记住密码
      const shouldRemember = remember ?? get().rememberMe
      if (shouldRemember) {
        // 加密保存密码到本地
        await saveEncryptedPassword(`${REMEMBER_ME_KEY}_${username}`, password)
        // 同时保存用户名（明文）
        localStorage.setItem(`${REMEMBER_ME_KEY}_username`, username)
        saveRememberMeToStorage(true)
        set({ rememberMe: true })
      } else {
        // 不记住密码时，清除之前保存的
        await removeEncryptedPassword(`${REMEMBER_ME_KEY}_${username}`)
        localStorage.removeItem(`${REMEMBER_ME_KEY}_username`)
        saveRememberMeToStorage(false)
        set({ rememberMe: false })
      }

      set({ user, isLoading: false })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : '登录失败'
      set({ error: message, isLoading: false })
      return false
    }
  },

  /**
   * 用户注册
   * @param username 用户名
   * @param password 密码
   * @param confirmPassword 确认密码
   * @param email 邮箱（可选）
   * @returns 是否注册成功
   */
  register: async (
    username: string,
    password: string,
    confirmPassword: string,
    email?: string,
  ): Promise<boolean> => {
    set({ isLoading: true, error: null })
    try {
      const result = await api.auth.register({
        username,
        password,
        confirmPassword,
        email,
      })
      const user = (result as { user: User; message: string }).user
      saveUserToStorage(user)
      set({ user, isLoading: false })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : '注册失败'
      set({ error: message, isLoading: false })
      return false
    }
  },

  /**
   * 用户登出
   */
  logout: async (): Promise<void> => {
    const { user, rememberMe } = get()
    set({ isLoading: true })
    try {
      await api.auth.logout()
    } catch (error) {
      console.error('登出 API 调用失败:', error)
    } finally {
      // 如果没有选择记住密码，登出时清除保存的密码
      if (!rememberMe && user) {
        removeEncryptedPassword(`${REMEMBER_ME_KEY}_${user.username}`)
        localStorage.removeItem(`${REMEMBER_ME_KEY}_username`)
      }
      saveUserToStorage(null)
      set({ user: null, isLoading: false })
    }
  },

  /**
   * 修改密码
   * @param oldPassword 原密码
   * @param newPassword 新密码
   * @param confirmNewPassword 确认新密码
   * @returns 是否修改成功
   */
  changePassword: async (
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<boolean> => {
    const { user, rememberMe } = get()
    if (!user) {
      set({ error: '请先登录' })
      return false
    }

    set({ isLoading: true, error: null })
    try {
      await api.auth.changePassword({
        userId: user.id,
        oldPassword,
        newPassword,
        confirmNewPassword,
      })

      // 如果开启了记住密码，更新本地存储的加密密码
      if (rememberMe) {
        await saveEncryptedPassword(`${REMEMBER_ME_KEY}_${user.username}`, newPassword)
      }

      set({ isLoading: false })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : '修改密码失败'
      set({ error: message, isLoading: false })
      return false
    }
  },

  /**
   * 清除错误信息
   */
  clearError: () => {
    set({ error: null })
  },

  /**
   * 获取记住的用户名和密码
   * @returns 用户名和密码，如果没有记住则返回 null
   */
  getRememberedCredentials: async (): Promise<{ username: string; password: string } | null> => {
    try {
      const username = localStorage.getItem(`${REMEMBER_ME_KEY}_username`)
      if (!username) {
        return null
      }
      const password = await getEncryptedPassword(`${REMEMBER_ME_KEY}_${username}`)
      if (!password) {
        return null
      }
      return { username, password }
    } catch (error) {
      console.error('获取记住的密码失败:', error)
      return null
    }
  },

  /**
   * 设置是否记住密码
   * @param remember 是否记住密码
   */
  setRememberMe: (remember: boolean) => {
    saveRememberMeToStorage(remember)
    set({ rememberMe: remember })
  },
}))
