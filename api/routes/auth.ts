/**
 * 用户认证 API 路由模块
 * 处理用户注册、登录、修改密码、登出等功能
 */

import { Router, type Request, type Response } from 'express'
import { encryptPassword, verifyPassword, validatePasswordStrength } from '../utils/password.js'
import {
  findUserByUsername,
  findUserById,
  createUser,
  updateUserPassword,
  type User,
} from '../utils/userStore.js'

const router = Router()

// 去除密码字段的用户信息类型
type SafeUser = Omit<User, 'password'>

/**
 * 将用户对象转换为安全用户对象（去除密码字段）
 * @param user 用户对象
 * @returns 安全用户对象
 */
function toSafeUser(user: User): SafeUser {
  const { password: _password, ...safeUser } = user
  return safeUser
}

/**
 * 用户注册接口
 * POST /api/auth/register
 * 请求体: { username, password, confirmPassword, email? }
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, confirmPassword, email } = req.body

    // 参数校验
    if (!username || !password || !confirmPassword) {
      res.status(400).json({
        success: false,
        error: '用户名、密码和确认密码不能为空',
      })
      return
    }

    // 用户名长度校验
    if (username.length < 3 || username.length > 20) {
      res.status(400).json({
        success: false,
        error: '用户名长度应为3-20个字符',
      })
      return
    }

    // 用户名格式校验（只能包含字母、数字、下划线）
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      res.status(400).json({
        success: false,
        error: '用户名只能包含字母、数字和下划线',
      })
      return
    }

    // 两次密码一致性校验
    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        error: '两次输入的密码不一致',
      })
      return
    }

    // 密码强度校验
    const strengthResult = validatePasswordStrength(password)
    if (!strengthResult.valid) {
      res.status(400).json({
        success: false,
        error: strengthResult.message,
      })
      return
    }

    // 检查用户名是否已存在
    const existingUser = findUserByUsername(username)
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: '用户名已存在，请选择其他用户名',
      })
      return
    }

    // 加密密码
    const encryptedPassword = encryptPassword(password)

    // 创建用户
    const newUser = createUser({
      username,
      email,
      password: encryptedPassword,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    })

    // 返回成功响应
    res.status(201).json({
      success: true,
      data: {
        user: toSafeUser(newUser),
        message: '注册成功',
      },
    })
  } catch (error) {
    console.error('注册失败:', error)
    res.status(500).json({
      success: false,
      error: '注册失败，请稍后重试',
    })
  }
})

/**
 * 用户登录接口
 * POST /api/auth/login
 * 请求体: { username, password }
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body

    // 参数校验
    if (!username || !password) {
      res.status(400).json({
        success: false,
        error: '用户名和密码不能为空',
      })
      return
    }

    // 查找用户
    const user = findUserByUsername(username)
    if (!user) {
      res.status(401).json({
        success: false,
        error: '用户名或密码错误',
      })
      return
    }

    // 验证密码
    const isPasswordValid = verifyPassword(password, user.password)
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: '用户名或密码错误',
      })
      return
    }

    // 返回成功响应
    res.json({
      success: true,
      data: {
        user: toSafeUser(user),
        message: '登录成功',
      },
    })
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({
      success: false,
      error: '登录失败，请稍后重试',
    })
  }
})

/**
 * 修改密码接口
 * POST /api/auth/change-password
 * 请求体: { userId, oldPassword, newPassword, confirmNewPassword }
 */
router.post('/change-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, oldPassword, newPassword, confirmNewPassword } = req.body

    // 参数校验
    if (!userId || !oldPassword || !newPassword || !confirmNewPassword) {
      res.status(400).json({
        success: false,
        error: '参数不完整',
      })
      return
    }

    // 两次新密码一致性校验
    if (newPassword !== confirmNewPassword) {
      res.status(400).json({
        success: false,
        error: '两次输入的新密码不一致',
      })
      return
    }

    // 新密码强度校验
    const strengthResult = validatePasswordStrength(newPassword)
    if (!strengthResult.valid) {
      res.status(400).json({
        success: false,
        error: '新密码不符合要求：' + strengthResult.message,
      })
      return
    }

    // 查找用户
    const user = findUserById(userId)
    if (!user) {
      res.status(404).json({
        success: false,
        error: '用户不存在',
      })
      return
    }

    // 验证旧密码
    const isOldPasswordValid = verifyPassword(oldPassword, user.password)
    if (!isOldPasswordValid) {
      res.status(401).json({
        success: false,
        error: '原密码错误',
      })
      return
    }

    // 加密新密码
    const encryptedNewPassword = encryptPassword(newPassword)

    // 更新密码
    const updatedUser = updateUserPassword(userId, encryptedNewPassword)

    res.json({
      success: true,
      data: {
        user: toSafeUser(updatedUser),
        message: '密码修改成功',
      },
    })
  } catch (error) {
    console.error('修改密码失败:', error)
    res.status(500).json({
      success: false,
      error: '修改密码失败，请稍后重试',
    })
  }
})

/**
 * 获取用户信息接口
 * GET /api/auth/user/:userId
 */
router.get('/user/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params

    const user = findUserById(userId)
    if (!user) {
      res.status(404).json({
        success: false,
        error: '用户不存在',
      })
      return
    }

    res.json({
      success: true,
      data: {
        user: toSafeUser(user),
      },
    })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    res.status(500).json({
      success: false,
      error: '获取用户信息失败',
    })
  }
})

/**
 * 用户登出接口
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    // 由于当前是无状态认证，登出操作主要由前端清除本地存储
    res.json({
      success: true,
      data: {
        message: '登出成功',
      },
    })
  } catch (error) {
    console.error('登出失败:', error)
    res.status(500).json({
      success: false,
      error: '登出失败',
    })
  }
})

export default router
