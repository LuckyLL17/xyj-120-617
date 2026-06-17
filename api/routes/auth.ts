/**
 * 用户认证 API 路由
 * 处理用户注册、登录、修改密码等功能
 * 密码使用 bcryptjs 加密存储，确保安全性
 */
import { Router, type Request, type Response } from 'express'
import {
  findUserByUsername,
  findUserByEmail,
  createUser,
  verifyPassword,
  updateUserPassword,
  findUserById,
  type User,
} from '../data/userStore.js'
import { validatePassword } from '../utils/passwordValidator.js'

const router = Router()

/**
 * 用户注册接口
 * POST /api/auth/register
 * 请求体：{ username, email, password, confirmPassword }
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, confirmPassword } = req.body

    // 验证必填字段
    if (!username || !email || !password || !confirmPassword) {
      res.status(400).json({
        success: false,
        error: '请填写所有必填字段',
      })
      return
    }

    // 验证用户名长度
    if (username.length < 3 || username.length > 20) {
      res.status(400).json({
        success: false,
        error: '用户名长度需在3-20个字符之间',
      })
      return
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: '请输入有效的邮箱地址',
      })
      return
    }

    // 验证两次密码是否一致
    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        error: '两次输入的密码不一致',
      })
      return
    }

    // 验证密码强度
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      res.status(400).json({
        success: false,
        error: passwordValidation.errors[0] || '密码强度不符合要求',
        details: passwordValidation,
      })
      return
    }

    // 检查用户名是否已存在
    const existingUsername = await findUserByUsername(username)
    if (existingUsername) {
      res.status(400).json({
        success: false,
        error: '该用户名已被注册',
      })
      return
    }

    // 检查邮箱是否已存在
    const existingEmail = await findUserByEmail(email)
    if (existingEmail) {
      res.status(400).json({
        success: false,
        error: '该邮箱已被注册',
      })
      return
    }

    // 创建用户
    const user = await createUser(username, email, password)

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user,
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
 * 请求体：{ username, password }
 * 支持使用用户名或邮箱登录
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body

    // 验证必填字段
    if (!username || !password) {
      res.status(400).json({
        success: false,
        error: '请输入用户名和密码',
      })
      return
    }

    // 查找用户（支持用户名或邮箱登录）
    let user: User | null = await findUserByUsername(username)
    if (!user) {
      user = await findUserByEmail(username)
    }

    if (!user) {
      res.status(401).json({
        success: false,
        error: '用户名或密码错误',
      })
      return
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: '用户名或密码错误',
      })
      return
    }

    // 返回用户信息（不含密码）
    const { password: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: userWithoutPassword,
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
 * 用户登出接口
 * POST /api/auth/logout
 * 由于使用本地存储，登出主要由前端处理
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      message: '登出成功',
    })
  } catch (error) {
    console.error('登出失败:', error)
    res.status(500).json({
      success: false,
      error: '登出失败，请稍后重试',
    })
  }
})

/**
 * 修改密码接口
 * PUT /api/auth/password
 * 请求体：{ userId, oldPassword, newPassword, confirmNewPassword }
 */
router.put('/password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, oldPassword, newPassword, confirmNewPassword } = req.body

    // 验证必填字段
    if (!userId || !oldPassword || !newPassword || !confirmNewPassword) {
      res.status(400).json({
        success: false,
        error: '请填写所有必填字段',
      })
      return
    }

    // 查找用户
    const user = await findUserById(userId)
    if (!user) {
      res.status(404).json({
        success: false,
        error: '用户不存在',
      })
      return
    }

    // 验证旧密码
    const isOldPasswordValid = await verifyPassword(oldPassword, user.password)
    if (!isOldPasswordValid) {
      res.status(401).json({
        success: false,
        error: '原密码错误',
      })
      return
    }

    // 验证两次新密码是否一致
    if (newPassword !== confirmNewPassword) {
      res.status(400).json({
        success: false,
        error: '两次输入的新密码不一致',
      })
      return
    }

    // 验证新密码强度
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      res.status(400).json({
        success: false,
        error: passwordValidation.errors[0] || '新密码强度不符合要求',
        details: passwordValidation,
      })
      return
    }

    // 检查新密码是否与旧密码相同
    const isSameAsOld = await verifyPassword(newPassword, user.password)
    if (isSameAsOld) {
      res.status(400).json({
        success: false,
        error: '新密码不能与旧密码相同',
      })
      return
    }

    // 更新密码
    const updatedUser = await updateUserPassword(userId, newPassword)

    res.json({
      success: true,
      message: '密码修改成功',
      data: {
        user: updatedUser,
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
 * 验证密码强度接口（供前端实时调用）
 * POST /api/auth/validate-password
 * 请求体：{ password }
 */
router.post('/validate-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { password } = req.body

    if (!password) {
      res.status(400).json({
        success: false,
        error: '请输入密码',
      })
      return
    }

    const validation = validatePassword(password)

    res.json({
      success: true,
      data: validation,
    })
  } catch (error) {
    console.error('验证密码失败:', error)
    res.status(500).json({
      success: false,
      error: '验证失败，请稍后重试',
    })
  }
})

export default router
