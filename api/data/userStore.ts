/**
 * 用户数据存储模块
 * 使用本地JSON文件存储用户数据，密码使用SHA256加盐加密
 */

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

// ESM模式下获取__dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 用户数据文件路径
const USER_DATA_FILE = path.join(__dirname, 'users.json')

// 用户接口定义
export interface User {
  id: string
  username: string
  email: string
  passwordHash: string
  salt: string
  avatar: string
  createdAt: string
  updatedAt: string
}

// 内存中的用户数据缓存
let users: User[] = []

/**
 * 初始化用户数据存储
 * 如果数据文件不存在则创建，否则加载数据到内存
 */
function initializeStore(): void {
  try {
    if (fs.existsSync(USER_DATA_FILE)) {
      const data = fs.readFileSync(USER_DATA_FILE, 'utf-8')
      users = JSON.parse(data)
    } else {
      users = []
      saveToFile()
    }
  } catch (error) {
    console.error('初始化用户数据存储失败:', error)
    users = []
  }
}

/**
 * 将用户数据保存到本地文件
 */
function saveToFile(): void {
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(users, null, 2), 'utf-8')
  } catch (error) {
    console.error('保存用户数据失败:', error)
  }
}

/**
 * 生成随机盐值
 * @param length 盐值长度，默认16字节
 * @returns 十六进制格式的盐值
 */
function generateSalt(length: number = 16): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * 使用SHA256和盐值对密码进行加密
 * @param password 明文密码
 * @param salt 盐值
 * @returns 加密后的密码哈希
 */
export function hashPassword(password: string, salt: string): string {
  return crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('hex')
}

/**
 * 验证密码强度
 * 要求：至少8位，包含大小写字母和特殊字符
 * @param password 待验证的密码
 * @returns 是否符合强度要求
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  message: string
  score: number
} {
  const minLength = 8
  let score = 0
  const messages: string[] = []

  // 检查长度
  if (password.length >= minLength) {
    score += 25
  } else {
    messages.push(`密码长度至少需要${minLength}位`)
  }

  // 检查小写字母
  if (/[a-z]/.test(password)) {
    score += 25
  } else {
    messages.push('需要包含小写字母')
  }

  // 检查大写字母
  if (/[A-Z]/.test(password)) {
    score += 25
  } else {
    messages.push('需要包含大写字母')
  }

  // 检查特殊字符
  if (/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/.test(password)) {
    score += 25
  } else {
    messages.push('需要包含特殊字符（如!@#$%^&*等）')
  }

  return {
    valid: score === 100,
    message: messages.length > 0 ? messages.join('；') : '密码强度符合要求',
    score,
  }
}

/**
 * 生成唯一用户ID
 * @returns 用户ID
 */
function generateUserId(): string {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

/**
 * 根据用户名查找用户
 * @param username 用户名
 * @returns 用户对象或null
 */
export function findUserByUsername(username: string): User | null {
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null
}

/**
 * 根据邮箱查找用户
 * @param email 邮箱
 * @returns 用户对象或null
 */
export function findUserByEmail(email: string): User | null {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
}

/**
 * 根据用户ID查找用户
 * @param id 用户ID
 * @returns 用户对象或null
 */
export function findUserById(id: string): User | null {
  return users.find((u) => u.id === id) || null
}

/**
 * 创建新用户
 * @param username 用户名
 * @param email 邮箱
 * @param password 明文密码
 * @returns 创建的用户对象（不包含密码哈希和盐值）
 */
export function createUser(
  username: string,
  email: string,
  password: string,
): Omit<User, 'passwordHash' | 'salt'> | null {
  // 检查用户名是否已存在
  if (findUserByUsername(username)) {
    return null
  }

  // 检查邮箱是否已存在
  if (findUserByEmail(email)) {
    return null
  }

  // 生成盐值并加密密码
  const salt = generateSalt()
  const passwordHash = hashPassword(password, salt)

  const now = new Date().toISOString()

  // 创建新用户
  const newUser: User = {
    id: generateUserId(),
    username,
    email,
    passwordHash,
    salt,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
    createdAt: now,
    updatedAt: now,
  }

  users.push(newUser)
  saveToFile()

  // 返回用户信息（不包含敏感字段）
  const { passwordHash: _, salt: __, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

/**
 * 验证用户密码
 * @param usernameOrEmail 用户名或邮箱
 * @param password 明文密码
 * @returns 用户对象（不包含密码哈希和盐值）或null
 */
export function verifyUser(
  usernameOrEmail: string,
  password: string,
): Omit<User, 'passwordHash' | 'salt'> | null {
  // 先按用户名查找，再按邮箱查找
  const user =
    findUserByUsername(usernameOrEmail) || findUserByEmail(usernameOrEmail)

  if (!user) {
    return null
  }

  // 验证密码
  const passwordHash = hashPassword(password, user.salt)
  if (passwordHash !== user.passwordHash) {
    return null
  }

  // 返回用户信息（不包含敏感字段）
  const { passwordHash: _, salt: __, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * 修改用户密码
 * @param userId 用户ID
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns 是否修改成功
 */
export function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string,
): boolean {
  const user = findUserById(userId)

  if (!user) {
    return false
  }

  // 验证旧密码
  const oldPasswordHash = hashPassword(oldPassword, user.salt)
  if (oldPasswordHash !== user.passwordHash) {
    return false
  }

  // 生成新盐值并加密新密码
  const newSalt = generateSalt()
  user.passwordHash = hashPassword(newPassword, newSalt)
  user.salt = newSalt
  user.updatedAt = new Date().toISOString()

  saveToFile()
  return true
}

// 初始化存储
initializeStore()

export default {
  findUserByUsername,
  findUserByEmail,
  findUserById,
  createUser,
  verifyUser,
  changePassword,
  validatePasswordStrength,
  hashPassword,
}
