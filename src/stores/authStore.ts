/**
 * 用户认证状态管理
 * 使用 zustand 管理登录状态
 * 用户信息存储在 localStorage 中，实现会话持久化
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/api'
import type { User } from '@/types'

/**
 * 认证状态接口
 */
interface AuthState {
  // 用户信息，未登录时为 null
  user: User | null
  // 是否正在加载
  isLoading: boolean
  // 错误信息
  error: string | null

  /**
   * 用户登录
   * @param username 用户名或邮箱
   * @param password 密码
   */
  login: (username: string, password: string) => Promise<void>

  /**
   * 用户注册
   * @param username 用户名
   * @param email 邮箱
   * @param password 密码
   * @param confirmPassword 确认密码
   */
  register: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>

  /**
   * 用户登出
   */
  logout: () => Promise<void>

  /**
   * 修改密码
   * @param oldPassword 原密码
   * @param newPassword 新密码
   * @param confirmNewPassword 确认新密码
   */
  changePassword: (
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) => Promise<void>

  /**
   * 清除错误信息
   */
  clearError: () => void
}

/**
 * 创建认证 store
 * 使用 persist 中间件将用户信息保存到 localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      // 用户登录
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const result = (await api.auth.login({ username, password })) as {
            user: User
          }
          set({ user: result.user, isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '登录失败',
            isLoading: false,
          })
          throw error
        }
      },

      // 用户注册
      register: async (
        username: string,
        email: string,
        password: string,
        confirmPassword: string,
      ) => {
        set({ isLoading: true, error: null })
        try {
          const result = (await api.auth.register({
            username,
            email,
            password,
            confirmPassword,
          })) as { user: User }
          // 注册成功后自动登录
          set({ user: result.user, isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '注册失败',
            isLoading: false,
          })
          throw error
        }
      },

      // 用户登出
      logout: async () => {
        set({ isLoading: true, error: null })
        try {
          await api.auth.logout()
          set({ user: null, isLoading: false })
        } catch (error) {
          // 即使接口调用失败，也清除本地状态
          set({ user: null, isLoading: false })
        }
      },

      // 修改密码
      changePassword: async (
        oldPassword: string,
        newPassword: string,
        confirmNewPassword: string,
      ) => {
        set({ isLoading: true, error: null })
        try {
          const { user } = get()
          if (!user) {
            throw new Error('请先登录')
          }

          const result = (await api.auth.changePassword({
            userId: user.id,
            oldPassword,
            newPassword,
            confirmNewPassword,
          })) as { user: User }

          set({ user: result.user, isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '修改密码失败',
            isLoading: false,
          })
          throw error
        }
      },

      // 清除错误信息
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      // 持久化配置
      name: 'survival-community-auth',
      // 只持久化用户信息，不持久化加载状态和错误
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
