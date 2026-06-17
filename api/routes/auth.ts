/**
 * 用户认证 API 路由
 * 处理用户注册、登录、登出和修改密码
 * 注意：本项目的密码实际存储在前端 localStorage（SHA-256 哈希 + 盐值加密），
 * 后端路由保留用于 API 结构完整性和未来扩展
 */
import { Router, type Request, type Response } from 'express'

const router = Router()

/**
 * 用户注册
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400).json({ success: false, error: '用户名和密码不能为空' })
    return
  }

  if (username.trim().length < 2 || username.trim().length > 20) {
    res.status(400).json({ success: false, error: '用户名长度需在2-20个字符之间' })
    return
  }

  /* 密码强度校验：必须包含大写字母、小写字母和特殊字符 */
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).{8,}$/
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      success: false,
      error: '密码强度不足：至少8位，必须包含大写字母、小写字母和特殊字符',
    })
    return
  }

  /* 实际注册逻辑由前端 Zustand store + localStorage 处理 */
  res.status(200).json({
    success: true,
    data: { message: '注册请求已接收，密码已在前端加密存储' },
  })
})

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400).json({ success: false, error: '用户名和密码不能为空' })
    return
  }

  /* 实际登录验证由前端 Zustand store 处理（SHA-256 哈希比对） */
  res.status(200).json({
    success: true,
    data: { message: '登录请求已接收' },
  })
})

/**
 * 用户登出
 * POST /api/auth/logout
 */
router.post('/logout', async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    data: { message: '已登出' },
  })
})

/**
 * 修改密码
 * PUT /api/auth/change-password
 */
router.put('/change-password', async (req: Request, res: Response): Promise<void> => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword) {
    res.status(400).json({ success: false, error: '旧密码和新密码不能为空' })
    return
  }

  /* 新密码强度校验 */
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).{8,}$/
  if (!passwordRegex.test(newPassword)) {
    res.status(400).json({
      success: false,
      error: '新密码强度不足：至少8位，必须包含大写字母、小写字母和特殊字符',
    })
    return
  }

  /* 实际修改密码逻辑由前端 Zustand store 处理 */
  res.status(200).json({
    success: true,
    data: { message: '密码修改请求已接收' },
  })
})

export default router
