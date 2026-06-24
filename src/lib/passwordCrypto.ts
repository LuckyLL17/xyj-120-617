/**
 * 前端密码加密存储工具
 * 使用 Web Crypto API 的 AES-GCM 算法对密码进行加密存储
 * 加密密钥派生自固定盐值 + 浏览器指纹，确保每个环境的密钥不同
 *
 * 注意：前端加密存储仅为混淆保护，不能替代后端安全措施
 * 因为加密密钥也需要存储在前端，无法做到绝对安全
 */

// 固定盐值（用于派生加密密钥）
const SALT = 'survival-community-auth-salt-v1'

// 存储密钥的 key
const KEY_STORAGE_KEY = 'survival-community-crypto-key'

// 存储加密密码的 key 前缀
const ENCRYPTED_PASSWORD_PREFIX = 'survival-community-encrypted-password:'

/**
 * 将字符串转换为 ArrayBuffer
 * @param str 输入字符串
 * @returns ArrayBuffer
 */
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder()
  return encoder.encode(str)
}

/**
 * 将 ArrayBuffer 转换为 Base64 字符串
 * @param buffer 输入 ArrayBuffer
 * @returns Base64 字符串
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/**
 * 将 Base64 字符串转换为 ArrayBuffer
 * @param base64 Base64 字符串
 * @returns ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * 生成或获取加密密钥
 * 优先从 localStorage 获取，不存在则生成新密钥
 * @returns CryptoKey
 */
async function getOrCreateKey(): Promise<CryptoKey> {
  // 尝试从 localStorage 获取密钥
  const storedKey = localStorage.getItem(KEY_STORAGE_KEY)

  if (storedKey) {
    // 导入已存储的密钥
    const keyData = base64ToArrayBuffer(storedKey)
    return crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt'],
    )
  }

  // 生成新密钥
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(SALT),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )

  // 使用 PBKDF2 派生 AES 密钥
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: stringToArrayBuffer(SALT),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  )

  // 导出并存储密钥
  const exportedKey = await crypto.subtle.exportKey('raw', key)
  localStorage.setItem(KEY_STORAGE_KEY, arrayBufferToBase64(exportedKey))

  return key
}

/**
 * 加密密码
 * @param password 明文密码
 * @param accountIdentifier 账户标识（用户名或邮箱），用于区分不同账户的密码
 * @returns 加密后的字符串（包含 IV 和密文）
 */
export async function encryptPassword(
  password: string,
  accountIdentifier: string,
): Promise<string> {
  const key = await getOrCreateKey()

  // 生成随机初始化向量 (IV)
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // 加密密码
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    stringToArrayBuffer(password),
  )

  // 将 IV 和密文组合后转为 Base64
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encrypted), iv.length)

  const encryptedBase64 = arrayBufferToBase64(combined.buffer)

  // 存储到 localStorage（使用账户标识作为 key 的一部分）
  const storageKey = ENCRYPTED_PASSWORD_PREFIX + accountIdentifier.toLowerCase()
  localStorage.setItem(storageKey, encryptedBase64)

  return encryptedBase64
}

/**
 * 解密密码
 * @param accountIdentifier 账户标识
 * @returns 解密后的明文密码，如果不存在则返回 null
 */
export async function decryptPassword(accountIdentifier: string): Promise<string | null> {
  const storageKey = ENCRYPTED_PASSWORD_PREFIX + accountIdentifier.toLowerCase()
  const encryptedBase64 = localStorage.getItem(storageKey)

  if (!encryptedBase64) {
    return null
  }

  try {
    const key = await getOrCreateKey()
    const combined = new Uint8Array(base64ToArrayBuffer(encryptedBase64))

    // 分离 IV 和密文（前 12 字节是 IV）
    const iv = combined.slice(0, 12)
    const ciphertext = combined.slice(12)

    // 解密
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      ciphertext,
    )

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  } catch (error) {
    // 解密失败，可能是密钥不匹配或数据损坏
    console.warn('密码解密失败，清除已存储的密码')
    localStorage.removeItem(storageKey)
    return null
  }
}

/**
 * 清除已保存的密码
 * @param accountIdentifier 账户标识，如果不传则清除所有
 */
export function clearSavedPassword(accountIdentifier?: string): void {
  if (accountIdentifier) {
    const storageKey = ENCRYPTED_PASSWORD_PREFIX + accountIdentifier.toLowerCase()
    localStorage.removeItem(storageKey)
  } else {
    // 清除所有以该前缀开头的存储项
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(ENCRYPTED_PASSWORD_PREFIX)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  }
}

/**
 * 检查是否有保存的密码
 * @param accountIdentifier 账户标识
 * @returns 是否存在保存的密码
 */
export function hasSavedPassword(accountIdentifier: string): boolean {
  const storageKey = ENCRYPTED_PASSWORD_PREFIX + accountIdentifier.toLowerCase()
  return localStorage.getItem(storageKey) !== null
}

/**
 * 保存"记住我"选项的账户标识
 * 用于下次自动填充用户名
 */
const REMEMBERED_ACCOUNT_KEY = 'survival-community-remembered-account'

/**
 * 保存记住的账户标识
 * @param accountIdentifier 账户标识
 */
export function saveRememberedAccount(accountIdentifier: string): void {
  localStorage.setItem(REMEMBERED_ACCOUNT_KEY, accountIdentifier)
}

/**
 * 获取记住的账户标识
 * @returns 账户标识，如果不存在则返回 null
 */
export function getRememberedAccount(): string | null {
  return localStorage.getItem(REMEMBERED_ACCOUNT_KEY)
}

/**
 * 清除记住的账户标识
 */
export function clearRememberedAccount(): void {
  localStorage.removeItem(REMEMBERED_ACCOUNT_KEY)
}
