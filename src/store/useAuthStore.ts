/**
 * 用户认证状态管理
 * 使用zustand管理用户登录状态，用户信息持久化到localStorage
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '../types'
import { api } from '../lib/api'

// 用户状态接口
interface AuthState {
  // 当前登录用户
  user: User | null
  // 是否正在加载
  isLoading: boolean
  // 错误信息
  error: string | null
  
  // 登录
  login: (usernameOrEmail: string, password: string) => Promise<void>
  // 注册
  register: (username: string, email: string, password: string) => Promise<void>
  // 登出
  logout: () => Promise<void>
  // 修改密码
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
  // 清除错误
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      /**
       * 用户登录
       * @param usernameOrEmail 用户名或邮箱
       * @param password 密码
       */
      login: async (usernameOrEmail: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const result = await api.auth.login({ usernameOrEmail, password })
          set({
            user: result.user,
            isLoading: false,
            error: null,
          })
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : '登录失败',
          })
          throw err
        }
      },

      /**
       * 用户注册
       * @param username 用户名
       * @param email 邮箱
       * @param password 密码
       */
      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const result = await api.auth.register({ username, email, password })
          set({
            user: result.user,
            isLoading: false,
            error: null,
          })
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : '注册失败',
          })
          throw err
        }
      },

      /**
       * 用户登出
       */
      logout: async () => {
        set({ isLoading: true, error: null })
        try {
          await api.auth.logout()
        } catch (err) {
          // 登出接口失败不影响本地状态清除
          console.error('登出接口调用失败:', err)
        } finally {
          set({
            user: null,
            isLoading: false,
            error: null,
          })
        }
      },

      /**
       * 修改密码
       * @param oldPassword 旧密码
       * @param newPassword 新密码
       */
      changePassword: async (oldPassword: string, newPassword: string) => {
        const { user } = get()
        if (!user) {
          throw new Error('用户未登录')
        }

        set({ isLoading: true, error: null })
        try {
          await api.auth.changePassword({
            userId: user.id,
            oldPassword,
            newPassword,
          })
          set({
            isLoading: false,
            error: null,
          })
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : '修改密码失败',
          })
          throw err
        }
      },

      /**
       * 清除错误信息
       */
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      // 持久化配置
      name: 'survival-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // 只持久化用户信息
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
