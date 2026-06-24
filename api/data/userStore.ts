/**
 * 用户数据存储模块
 * 使用本地 JSON 文件持久化存储用户数据
 * 密码使用 bcryptjs 加密存储，确保安全性
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

// 用于 ESM 模式下获取 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 用户数据文件路径
const USER_DATA_FILE = path.join(__dirname, 'users.json')

/**
 * 用户接口定义
 */
export interface User {
  id: string
  username: string
  email: string
  password: string // 加密后的密码哈希
  avatar?: string
  createdAt: string
  updatedAt: string
}

/**
 * 确保用户数据文件存在
 * 如果不存在则创建空的用户列表
 */
function ensureDataFileExists(): void {
  if (!fs.existsSync(USER_DATA_FILE)) {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify({ users: [] }, null, 2), 'utf-8')
  }
}

/**
 * 读取所有用户数据
 * @returns 用户列表
 */
function readUsers(): User[] {
  ensureDataFileExists()
  try {
    const data = fs.readFileSync(USER_DATA_FILE, 'utf-8')
    const parsed = JSON.parse(data)
    return parsed.users || []
  } catch (error) {
    console.error('读取用户数据失败:', error)
    return []
  }
}

/**
 * 写入用户数据到文件
 * @param users 用户列表
 */
function writeUsers(users: User[]): void {
  ensureDataFileExists()
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify({ users }, null, 2), 'utf-8')
  } catch (error) {
    console.error('写入用户数据失败:', error)
    throw new Error('保存用户数据失败')
  }
}

/**
 * 生成唯一的用户ID
 * @returns 唯一ID字符串
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
}

/**
 * 加密密码
 * 使用 bcryptjs 进行哈希加密，盐值轮数为 10
 * @param password 明文密码
 * @returns 加密后的密码哈希
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

/**
 * 验证密码
 * @param password 明文密码
 * @param hash 加密后的密码哈希
 * @returns 是否匹配
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * 根据用户名查找用户
 * @param username 用户名
 * @returns 用户对象或 null
 */
export async function findUserByUsername(username: string): Promise<User | null> {
  const users = readUsers()
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase())
  return user || null
}

/**
 * 根据邮箱查找用户
 * @param email 邮箱
 * @returns 用户对象或 null
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const users = readUsers()
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  return user || null
}

/**
 * 根据用户ID查找用户
 * @param id 用户ID
 * @returns 用户对象或 null
 */
export async function findUserById(id: string): Promise<User | null> {
  const users = readUsers()
  const user = users.find((u) => u.id === id)
  return user || null
}

/**
 * 创建新用户
 * @param username 用户名
 * @param email 邮箱
 * @param password 明文密码
 * @returns 创建的用户对象（不含密码）
 */
export async function createUser(
  username: string,
  email: string,
  password: string,
): Promise<Omit<User, 'password'>> {
  const users = readUsers()

  // 检查用户名是否已存在
  const existingUsername = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase(),
  )
  if (existingUsername) {
    throw new Error('用户名已存在')
  }

  // 检查邮箱是否已存在
  const existingEmail = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (existingEmail) {
    throw new Error('邮箱已被注册')
  }

  // 加密密码
  const hashedPassword = await hashPassword(password)

  // 创建新用户
  const now = new Date().toISOString()
  const newUser: User = {
    id: generateUserId(),
    username,
    email,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  }

  // 保存到文件
  users.push(newUser)
  writeUsers(users)

  // 返回用户信息（不包含密码）
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

/**
 * 更新用户密码
 * @param userId 用户ID
 * @param newPassword 新的明文密码
 * @returns 更新后的用户对象（不含密码）
 */
export async function updateUserPassword(
  userId: string,
  newPassword: string,
): Promise<Omit<User, 'password'>> {
  const users = readUsers()
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    throw new Error('用户不存在')
  }

  // 加密新密码
  const hashedPassword = await hashPassword(newPassword)

  // 更新用户信息
  users[userIndex].password = hashedPassword
  users[userIndex].updatedAt = new Date().toISOString()

  // 保存到文件
  writeUsers(users)

  // 返回用户信息（不包含密码）
  const { password: _, ...userWithoutPassword } = users[userIndex]
  return userWithoutPassword
}
