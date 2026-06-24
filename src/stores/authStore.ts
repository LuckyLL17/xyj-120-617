/**
 * 用户认证状态管理
 * 使用 zustand 管理登录状态
 * 用户信息存储在 localStorage 中，实现会话持久化
 * 密码使用 Web Crypto API 加密后存储在本地
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/api'
import {
  encryptPassword,
  decryptPassword,
  clearSavedPassword as clearSavedPasswordUtil,
  saveRememberedAccount,
  getRememberedAccount as getRememberedAccountUtil,
  clearRememberedAccount,
  hasSavedPassword as hasSavedPasswordUtil,
} from '@/lib/passwordCrypto'
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
  // 是否记住密码
  rememberPassword: boolean

  /**
   * 用户登录
   * @param username 用户名或邮箱
   * @param password 密码
   * @param remember 是否记住密码
   */
  login: (username: string, password: string, remember?: boolean) => Promise<void>

  /**
   * 用户注册
   * @param username 用户名
   * @param email 邮箱
   * @param password 密码
   * @param confirmPassword 确认密码
   * @param remember 是否记住密码
   */
  register: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    remember?: boolean,
  ) => Promise<void>

  /**
   * 用户登出
   * @param clearSaved 是否清除保存的密码
   */
  logout: (clearSaved?: boolean) => Promise<void>

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
   * 获取保存的密码
   * @param accountIdentifier 账户标识
   * @returns 解密后的密码
   */
  getSavedPassword: (accountIdentifier: string) => Promise<string | null>

  /**
   * 检查是否有保存的密码
   * @param accountIdentifier 账户标识
   * @returns 是否存在保存的密码
   */
  hasSavedPassword: (accountIdentifier: string) => boolean

  /**
   * 获取记住的账户
   * @returns 账户标识
   */
  getRememberedAccount: () => string | null

  /**
   * 清除保存的密码
   * @param accountIdentifier 账户标识，不传则清除所有
   */
  clearSavedPassword: (accountIdentifier?: string) => void

  /**
   * 清除错误信息
   */
  clearError: () => void

  /**
   * 设置记住密码选项
   */
  setRememberPassword: (remember: boolean) => void
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
      rememberPassword: false,

      // 用户登录
      login: async (username: string, password: string, remember = false) => {
        set({ isLoading: true, error: null })
        try {
          const result = (await api.auth.login({ username, password })) as {
            user: User
          }
          set({ user: result.user, isLoading: false, rememberPassword: remember })

          // 如果选择记住密码，加密后存储到本地
          if (remember) {
            await encryptPassword(password, result.user.username)
            saveRememberedAccount(result.user.username)
          } else {
            // 不记住密码则清除之前保存的
            clearSavedPasswordUtil(result.user.username)
            clearRememberedAccount()
          }
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
        remember = false,
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
          set({ user: result.user, isLoading: false, rememberPassword: remember })

          // 如果选择记住密码，加密后存储到本地
          if (remember) {
            await encryptPassword(password, result.user.username)
            saveRememberedAccount(result.user.username)
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '注册失败',
            isLoading: false,
          })
          throw error
        }
      },

      // 用户登出
      logout: async (clearSaved = false) => {
        set({ isLoading: true, error: null })
        try {
          await api.auth.logout()
        } catch (error) {
          // 即使接口调用失败，也清除本地状态
        }

        const { user } = get()

        // 如果选择清除保存的密码
        if (clearSaved && user) {
          clearSavedPasswordUtil(user.username)
          clearRememberedAccount()
        }

        set({ user: null, isLoading: false, rememberPassword: false })
      },

      // 修改密码
      changePassword: async (
        oldPassword: string,
        newPassword: string,
        confirmNewPassword: string,
      ) => {
        set({ isLoading: true, error: null })
        try {
          const { user, rememberPassword } = get()
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

          // 如果之前记住了密码，更新保存的密码
          if (rememberPassword) {
            await encryptPassword(newPassword, result.user.username)
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '修改密码失败',
            isLoading: false,
          })
          throw error
        }
      },

      // 获取保存的密码
      getSavedPassword: async (accountIdentifier: string) => {
        return decryptPassword(accountIdentifier)
      },

      // 检查是否有保存的密码
      hasSavedPassword: (accountIdentifier: string) => {
        return hasSavedPasswordUtil(accountIdentifier)
      },

      // 获取记住的账户
      getRememberedAccount: () => {
        return getRememberedAccountUtil()
      },

      // 清除保存的密码
      clearSavedPassword: (accountIdentifier?: string) => {
        clearSavedPasswordUtil(accountIdentifier)
        if (!accountIdentifier) {
          clearRememberedAccount()
        }
        set({ rememberPassword: false })
      },

      // 清除错误信息
      clearError: () => {
        set({ error: null })
      },

      // 设置记住密码选项
      setRememberPassword: (remember: boolean) => {
        set({ rememberPassword: remember })
      },
    }),
    {
      // 持久化配置
      name: 'survival-community-auth',
      // 只持久化用户信息和记住密码选项，不持久化加载状态和错误
      partialize: (state) => ({
        user: state.user,
        rememberPassword: state.rememberPassword,
      }),
    },
  ),
)
