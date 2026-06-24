/**
 * 密码加密与验证工具模块
 * 使用 Node.js 内置 crypto 模块的 pbkdf2 算法进行密码哈希
 * 包含随机盐值生成，确保相同密码也会产生不同的哈希值
 */

import crypto from 'crypto'

// 迭代次数，越高越安全但越慢
const ITERATIONS = 10000
// 密钥长度
const KEY_LENGTH = 64
// 哈希算法
const DIGEST = 'sha512'
// 盐值长度
const SALT_LENGTH = 16

/**
 * 生成随机盐值
 * @returns 十六进制格式的盐值字符串
 */
export function generateSalt(): string {
  return crypto.randomBytes(SALT_LENGTH).toString('hex')
}

/**
 * 使用 pbkdf2 算法对密码进行哈希
 * @param password 明文密码
 * @param salt 盐值
 * @returns 十六进制格式的哈希值
 */
export function hashPassword(password: string, salt: string): string {
  return crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString('hex')
}

/**
 * 加密密码，返回盐值和哈希的组合字符串
 * 格式: salt$hash
 * @param password 明文密码
 * @returns 加密后的密码字符串（包含盐值）
 */
export function encryptPassword(password: string): string {
  const salt = generateSalt()
  const hash = hashPassword(password, salt)
  return `${salt}$${hash}`
}

/**
 * 验证密码是否正确
 * @param password 明文密码
 * @param storedPassword 存储的加密密码（格式: salt$hash）
 * @returns 密码是否匹配
 */
export function verifyPassword(password: string, storedPassword: string): boolean {
  const [salt, hash] = storedPassword.split('$')
  if (!salt || !hash) {
    return false
  }
  const computedHash = hashPassword(password, salt)
  // 使用 timingSafeEqual 防止时序攻击
  const hashBuffer = Buffer.from(hash, 'hex')
  const computedBuffer = Buffer.from(computedHash, 'hex')
  if (hashBuffer.length !== computedBuffer.length) {
    return false
  }
  return crypto.timingSafeEqual(hashBuffer, computedBuffer)
}

/**
 * 密码强度验证
 * 要求：长度至少8位，包含大写字母、小写字母、特殊字符
 * @param password 密码
 * @returns { valid: boolean, message: string } 验证结果和提示信息
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  message: string
} {
  // 最小长度8位
  if (password.length < 8) {
    return {
      valid: false,
      message: '密码长度至少为8位',
    }
  }

  // 包含小写字母
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: '密码必须包含小写字母',
    }
  }

  // 包含大写字母
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: '密码必须包含大写字母',
    }
  }

  // 包含特殊字符
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(password)) {
    return {
      valid: false,
      message: '密码必须包含特殊字符（如!@#$%^&*等）',
    }
  }

  return {
    valid: true,
    message: '密码强度符合要求',
  }
}
