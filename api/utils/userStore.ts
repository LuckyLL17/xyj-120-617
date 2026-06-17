/**
 * 用户数据存储模块
 * 使用本地 JSON 文件存储用户数据，模拟数据库功能
 * 包含用户的增删改查操作
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 用户数据文件路径
const USERS_FILE = path.join(__dirname, '../data/users.json')

/**
 * 用户数据接口定义
 */
export interface User {
  id: string
  username: string
  email?: string
  password: string // 加密后的密码
  avatar?: string
  createdAt: string
  updatedAt: string
}

/**
 * 确保用户数据文件存在，不存在则创建
 */
function ensureUsersFileExists(): void {
  const dir = path.dirname(USERS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8')
  }
}

/**
 * 读取所有用户数据
 * @returns 用户数组
 */
export function getAllUsers(): User[] {
  ensureUsersFileExists()
  try {
    const content = fs.readFileSync(USERS_FILE, 'utf-8')
    return JSON.parse(content) as User[]
  } catch (error) {
    console.error('读取用户数据失败:', error)
    return []
  }
}

/**
 * 保存所有用户数据
 * @param users 用户数组
 */
function saveAllUsers(users: User[]): void {
  ensureUsersFileExists()
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
  } catch (error) {
    console.error('保存用户数据失败:', error)
    throw new Error('保存用户数据失败')
  }
}

/**
 * 生成唯一的用户ID
 * @returns 用户ID
 */
export function generateUserId(): string {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

/**
 * 根据用户名查找用户
 * @param username 用户名
 * @returns 用户对象或null
 */
export function findUserByUsername(username: string): User | null {
  const users = getAllUsers()
  return users.find((user) => user.username === username) || null
}

/**
 * 根据用户ID查找用户
 * @param userId 用户ID
 * @returns 用户对象或null
 */
export function findUserById(userId: string): User | null {
  const users = getAllUsers()
  return users.find((user) => user.id === userId) || null
}

/**
 * 创建新用户
 * @param userData 用户数据（不包含id、createdAt、updatedAt）
 * @returns 创建的用户对象
 */
export function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
  const users = getAllUsers()

  // 检查用户名是否已存在
  if (findUserByUsername(userData.username)) {
    throw new Error('用户名已存在')
  }

  const now = new Date().toISOString()
  const newUser: User = {
    ...userData,
    id: generateUserId(),
    createdAt: now,
    updatedAt: now,
  }

  users.push(newUser)
  saveAllUsers(users)

  return newUser
}

/**
 * 更新用户密码
 * @param userId 用户ID
 * @param newPassword 新的加密密码
 * @returns 更新后的用户对象
 */
export function updateUserPassword(userId: string, newPassword: string): User {
  const users = getAllUsers()
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    throw new Error('用户不存在')
  }

  users[userIndex].password = newPassword
  users[userIndex].updatedAt = new Date().toISOString()

  saveAllUsers(users)

  return users[userIndex]
}

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param updates 更新的字段
 * @returns 更新后的用户对象
 */
export function updateUser(
  userId: string,
  updates: Partial<Omit<User, 'id' | 'password' | 'createdAt'>>,
): User {
  const users = getAllUsers()
  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    throw new Error('用户不存在')
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  saveAllUsers(users)

  return users[userIndex]
}
