/**
 * 密码加密工具模块
 * 使用 Web Crypto API 实现 SHA-256 哈希 + 随机盐值
 * 密码以哈希形式存储在本地，不可逆，确保安全性
 */

/** 生成随机盐值，用于增强密码哈希的安全性 */
function generateSalt(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/** 将字符串编码为 Uint8Array */
function encode(text: string): Uint8Array {
  return new TextEncoder().encode(text)
}

/** 使用 SHA-256 算法对密码 + 盐值进行哈希，返回十六进制字符串 */
async function sha256(password: string, salt: string): Promise<string> {
  const data = new Uint8Array(encode(password + salt))
  const hashBuffer = await crypto.subtle.digest('SHA-256', data.buffer as ArrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** 对密码进行加密哈希，返回哈希值和盐值 */
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = generateSalt()
  const hash = await sha256(password, salt)
  return { hash, salt }
}

/** 验证密码是否匹配，将输入密码与存储的哈希值和盐值进行比对 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const hash = await sha256(password, salt)
  return hash === storedHash
}

/**
 * 密码强度校验
 * 要求：至少8位，必须包含大写字母、小写字母和特殊字符
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('密码长度至少8位')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('必须包含小写字母')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('必须包含大写字母')
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    errors.push('必须包含特殊字符（如 !@#$%^&* 等）')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
