/**
 * 用户认证状态管理 store
 * 使用 zustand 管理用户登录状态、用户信息
 * 用户信息存储在 localStorage 中，实现持久化
 */

import { create } from 'zustand'
import type { User } from '@/types'
import { api } from '@/lib/api'

// 本地存储的 key
const STORAGE_KEY = 'survival_auth_user'

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

  // 初始化：从本地存储恢复用户信息
  init: () => void
  // 用户登录
  login: (username: string, password: string) => Promise<boolean>
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

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

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
   * @returns 是否登录成功
   */
  login: async (username: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null })
    try {
      const result = await api.auth.login({ username, password })
      const user = (result as { user: User; message: string }).user
      saveUserToStorage(user)
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
    set({ isLoading: true })
    try {
      await api.auth.logout()
    } catch (error) {
      console.error('登出 API 调用失败:', error)
    } finally {
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
    const { user } = get()
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
}))
