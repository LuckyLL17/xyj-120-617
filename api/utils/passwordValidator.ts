/**
 * 密码强度验证工具
 * 要求密码必须包含：大写字母、小写字母、特殊字符
 * 同时提供密码强度评估功能
 */

/**
 * 密码强度等级
 */
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'

/**
 * 密码验证结果接口
 */
export interface PasswordValidationResult {
  isValid: boolean
  strength: PasswordStrength
  score: number
  errors: string[]
  requirements: {
    hasMinLength: boolean
    hasUpperCase: boolean
    hasLowerCase: boolean
    hasSpecialChar: boolean
    hasNumber: boolean
  }
}

/**
 * 特殊字符定义
 */
const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

/**
 * 验证密码强度
 * 必须满足：至少8位、包含大写字母、包含小写字母、包含特殊字符
 * @param password 密码字符串
 * @returns 验证结果
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  let score = 0

  // 检查最小长度（8位）
  const hasMinLength = password.length >= 8
  if (!hasMinLength) {
    errors.push('密码长度至少为8位')
  }

  // 检查是否包含大写字母
  const hasUpperCase = /[A-Z]/.test(password)
  if (!hasUpperCase) {
    errors.push('密码必须包含至少一个大写字母')
  }

  // 检查是否包含小写字母
  const hasLowerCase = /[a-z]/.test(password)
  if (!hasLowerCase) {
    errors.push('密码必须包含至少一个小写字母')
  }

  // 检查是否包含特殊字符
  const hasSpecialChar = new RegExp(`[${SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)
  if (!hasSpecialChar) {
    errors.push('密码必须包含至少一个特殊字符（如!@#$%^&*等）')
  }

  // 检查是否包含数字（加分项，非必需）
  const hasNumber = /[0-9]/.test(password)

  // 计算基础分数
  if (hasMinLength) score += 20
  if (hasUpperCase) score += 20
  if (hasLowerCase) score += 20
  if (hasSpecialChar) score += 20
  if (hasNumber) score += 10

  // 额外长度加分
  if (password.length >= 12) score += 5
  if (password.length >= 16) score += 5

  // 确保分数不超过100
  score = Math.min(score, 100)

  // 判断密码是否有效（必须满足所有必需条件）
  const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasSpecialChar

  // 判断密码强度等级
  let strength: PasswordStrength
  if (score < 40) {
    strength = 'weak'
  } else if (score < 60) {
    strength = 'fair'
  } else if (score < 75) {
    strength = 'good'
  } else if (score < 90) {
    strength = 'strong'
  } else {
    strength = 'very-strong'
  }

  return {
    isValid,
    strength,
    score,
    errors,
    requirements: {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasSpecialChar,
      hasNumber,
    },
  }
}

/**
 * 获取密码强度对应的颜色
 * @param strength 密码强度等级
 * @returns 颜色字符串（tailwindcss 颜色类）
 */
export function getPasswordStrengthColor(strength: PasswordStrength): string {
  const colors: Record<PasswordStrength, string> = {
    'weak': 'bg-red-500',
    'fair': 'bg-orange-500',
    'good': 'bg-yellow-500',
    'strong': 'bg-green-500',
    'very-strong': 'bg-emerald-500',
  }
  return colors[strength]
}

/**
 * 获取密码强度对应的文字描述
 * @param strength 密码强度等级
 * @returns 强度描述文字
 */
export function getPasswordStrengthText(strength: PasswordStrength): string {
  const texts: Record<PasswordStrength, string> = {
    'weak': '弱',
    'fair': '一般',
    'good': '良好',
    'strong': '强',
    'very-strong': '非常强',
  }
  return texts[strength]
}
