/**
 * 用户认证API路由
 * 处理用户注册、登录、登出、修改密码、密码强度验证等功能
 */
import { Router, type Request, type Response } from 'express'
import userStore, { type User } from '../data/userStore.js'

const router = Router()

// 定义不包含敏感信息的用户类型
type PublicUser = Omit<User, 'passwordHash' | 'salt'>

/**
 * 用户注册
 * POST /api/auth/register
 * 请求体: { username, email, password }
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body

    // 验证必填字段
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        error: '用户名、邮箱和密码不能为空',
      })
      return
    }

    // 验证用户名长度
    if (username.length < 3 || username.length > 20) {
      res.status(400).json({
        success: false,
        error: '用户名长度需要在3-20位之间',
      })
      return
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: '邮箱格式不正确',
      })
      return
    }

    // 验证密码强度
    const passwordCheck = userStore.validatePasswordStrength(password)
    if (!passwordCheck.valid) {
      res.status(400).json({
        success: false,
        error: passwordCheck.message,
      })
      return
    }

    // 检查用户名是否已存在
    if (userStore.findUserByUsername(username)) {
      res.status(409).json({
        success: false,
        error: '用户名已被注册',
      })
      return
    }

    // 检查邮箱是否已存在
    if (userStore.findUserByEmail(email)) {
      res.status(409).json({
        success: false,
        error: '邮箱已被注册',
      })
      return
    }

    // 创建用户
    const newUser = userStore.createUser(username, email, password)

    if (!newUser) {
      res.status(500).json({
        success: false,
        error: '注册失败，请稍后重试',
      })
      return
    }

    // 注册成功，将用户信息存入session（这里简化处理，直接返回用户信息）
    res.status(201).json({
      success: true,
      data: {
        user: newUser,
        message: '注册成功',
      },
    })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
    })
  }
})

/**
 * 用户登录
 * POST /api/auth/login
 * 请求体: { usernameOrEmail, password }
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body

    // 验证必填字段
    if (!usernameOrEmail || !password) {
      res.status(400).json({
        success: false,
        error: '用户名/邮箱和密码不能为空',
      })
      return
    }

    // 验证用户
    const user = userStore.verifyUser(usernameOrEmail, password)

    if (!user) {
      res.status(401).json({
        success: false,
        error: '用户名/邮箱或密码错误',
      })
      return
    }

    // 登录成功
    res.status(200).json({
      success: true,
      data: {
        user,
        message: '登录成功',
      },
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
    })
  }
})

/**
 * 用户登出
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  try {
    // 简化处理，前端清除本地存储的用户信息即可
    res.status(200).json({
      success: true,
      data: {
        message: '登出成功',
      },
    })
  } catch (error) {
    console.error('登出错误:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
    })
  }
})

/**
 * 验证密码强度
 * POST /api/auth/validate-password
 * 请求体: { password }
 */
router.post('/validate-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { password } = req.body

    if (!password) {
      res.status(400).json({
        success: false,
        error: '密码不能为空',
      })
      return
    }

    const result = userStore.validatePasswordStrength(password)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('密码验证错误:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
    })
  }
})

/**
 * 修改密码
 * POST /api/auth/change-password
 * 请求体: { userId, oldPassword, newPassword }
 */
router.post('/change-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, oldPassword, newPassword } = req.body

    // 验证必填字段
    if (!userId || !oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        error: '用户ID、旧密码和新密码不能为空',
      })
      return
    }

    // 验证新密码强度
    const passwordCheck = userStore.validatePasswordStrength(newPassword)
    if (!passwordCheck.valid) {
      res.status(400).json({
        success: false,
        error: `新密码不符合要求：${passwordCheck.message}`,
      })
      return
    }

    // 检查用户是否存在
    const user = userStore.findUserById(userId)
    if (!user) {
      res.status(404).json({
        success: false,
        error: '用户不存在',
      })
      return
    }

    // 修改密码
    const success = userStore.changePassword(userId, oldPassword, newPassword)

    if (!success) {
      res.status(401).json({
        success: false,
        error: '旧密码错误',
      })
      return
    }

    res.status(200).json({
      success: true,
      data: {
        message: '密码修改成功',
      },
    })
  } catch (error) {
    console.error('修改密码错误:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
    })
  }
})

/**
 * 获取用户信息（根据用户ID）
 * GET /api/auth/user/:id
 */
router.get('/user/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const user = userStore.findUserById(id)

    if (!user) {
      res.status(404).json({
        success: false,
        error: '用户不存在',
      })
      return
    }

    // 返回不包含敏感信息的用户数据
    const { passwordHash: _, salt: __, ...publicUser } = user

    res.status(200).json({
      success: true,
      data: {
        user: publicUser,
      },
    })
  } catch (error) {
    console.error('获取用户信息错误:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
    })
  }
})

export default router
