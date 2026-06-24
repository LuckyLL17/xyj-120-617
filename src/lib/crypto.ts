/**
 * 前端密码加密工具模块
 * 使用 Web Crypto API 的 AES-GCM 算法进行密码加密解密
 * 用于在本地安全存储密码（记住密码功能）
 */

// 加密后的数据格式
interface EncryptedData {
  iv: string // 初始向量（base64）
  ciphertext: string // 密文（base64）
}

// 本地存储的密钥 key
const KEY_STORAGE_KEY = 'survival_crypto_key'
// 密钥版本
const KEY_VERSION = 'v1'

/**
 * 生成加密密钥
 * 使用 PBKDF2 从固定的应用密钥派生，用于本地加密
 * @returns CryptoKey
 */
async function generateKey(): Promise<CryptoKey> {
  // 固定的应用盐值（实际项目中应该从环境变量获取）
  const appSalt = 'survival_community_app_salt_2024'
  const encoder = new TextEncoder()
  const saltBuffer = encoder.encode(appSalt)

  // 应用密钥材料（实际项目中应该更安全地存储）
  const appSecret = 'survival_community_secret_key_for_local_storage'
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(appSecret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )

  // 使用 PBKDF2 派生 AES 密钥
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 10000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

/**
 * 将字符串转换为 base64
 * @param str 字符串
 * @returns base64 字符串
 */
function stringToBase64(str: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

/**
 * 将 base64 转换为字符串
 * @param base64 base64 字符串
 * @returns 原始字符串
 */
function base64ToString(base64: string): string {
  const binary = window.atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const decoder = new TextDecoder()
  return decoder.decode(bytes)
}

/**
 * 将 ArrayBuffer 转换为 base64 字符串
 * @param buffer ArrayBuffer
 * @returns base64 字符串
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

/**
 * 将 base64 字符串转换为 ArrayBuffer
 * @param base64 base64 字符串
 * @returns ArrayBuffer
 */
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * 加密密码
 * 使用 AES-GCM 算法加密
 * @param password 明文密码
 * @returns 加密后的数据（包含 iv 和密文）
 */
export async function encryptPassword(password: string): Promise<string> {
  const key = await generateKey()

  // 生成随机初始向量 (12字节是 AES-GCM 的推荐长度)
  const iv = window.crypto.getRandomValues(new Uint8Array(12))

  // 加密
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data,
  )

  // 构造加密数据对象
  const encryptedData: EncryptedData = {
    iv: bufferToBase64(iv.buffer),
    ciphertext: bufferToBase64(encrypted),
  }

  // 序列化为 JSON 字符串并编码为 base64
  const jsonStr = JSON.stringify(encryptedData)
  return stringToBase64(jsonStr)
}

/**
 * 解密密码
 * @param encryptedBase64 加密后的 base64 字符串
 * @returns 明文密码
 */
export async function decryptPassword(encryptedBase64: string): Promise<string> {
  try {
    const key = await generateKey()

    // 解码 base64 并解析 JSON
    const jsonStr = base64ToString(encryptedBase64)
    const encryptedData: EncryptedData = JSON.parse(jsonStr)

    // 解密
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: base64ToBuffer(encryptedData.iv),
      },
      key,
      base64ToBuffer(encryptedData.ciphertext),
    )

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  } catch (error) {
    console.error('密码解密失败:', error)
    throw new Error('密码解密失败')
  }
}

/**
 * 安全地在本地存储密码（加密后）
 * @param key 存储键名
 * @param password 明文密码
 */
export async function saveEncryptedPassword(key: string, password: string): Promise<void> {
  try {
    const encrypted = await encryptPassword(password)
    localStorage.setItem(`${KEY_VERSION}_${key}`, encrypted)
  } catch (error) {
    console.error('存储加密密码失败:', error)
    throw new Error('存储密码失败')
  }
}

/**
 * 从本地存储读取并解密密码
 * @param key 存储键名
 * @returns 明文密码，如果不存在则返回 null
 */
export async function getEncryptedPassword(key: string): Promise<string | null> {
  try {
    const encrypted = localStorage.getItem(`${KEY_VERSION}_${key}`)
    if (!encrypted) {
      return null
    }
    return await decryptPassword(encrypted)
  } catch (error) {
    console.error('读取加密密码失败:', error)
    // 读取失败时清除损坏的数据
    localStorage.removeItem(`${KEY_VERSION}_${key}`)
    return null
  }
}

/**
 * 从本地存储删除密码
 * @param key 存储键名
 */
export function removeEncryptedPassword(key: string): void {
  localStorage.removeItem(`${KEY_VERSION}_${key}`)
}

/**
 * 对密码进行哈希（用于前端的非可逆加密场景）
 * 使用 SHA-256 算法
 * @param password 密码
 * @returns 哈希后的十六进制字符串
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)

  // 转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

  return hashHex
}
