/**
 * 密码强度指示器组件
 * 实时显示密码强度得分和提示信息
 */
import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Shield } from 'lucide-react'
import { api } from '../lib/api'
import type { PasswordStrength } from '../types'
import { cn } from '../lib/utils'

interface PasswordStrengthMeterProps {
  // 密码值
  password: string
  // 是否显示详细提示
  showDetails?: boolean
}

export default function PasswordStrengthMeter({
  password,
  showDetails = true,
}: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState<PasswordStrength | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  // 实时验证密码强度（使用防抖）
  useEffect(() => {
    if (!password) {
      setStrength(null)
      return
    }

    const timer = setTimeout(async () => {
      setIsValidating(true)
      try {
        const result = await api.auth.validatePassword(password)
        setStrength(result)
      } catch (err) {
        console.error('密码强度验证失败:', err)
      } finally {
        setIsValidating(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [password])

  if (!password) {
    return null
  }

  // 根据分数获取颜色
  const getColorClass = (score: number) => {
    if (score >= 75) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    if (score >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  // 根据分数获取文字颜色
  const getTextColorClass = (score: number) => {
    if (score >= 75) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    if (score >= 25) return 'text-orange-400'
    return 'text-red-400'
  }

  // 根据分数获取强度描述
  const getStrengthLabel = (score: number) => {
    if (score === 100) return '非常强'
    if (score >= 75) return '较强'
    if (score >= 50) return '中等'
    if (score >= 25) return '较弱'
    return '非常弱'
  }

  // 检查各项条件是否满足
  const getChecks = () => {
    if (!password) return []
    return [
      { label: '至少8位字符', passed: password.length >= 8 },
      { label: '包含小写字母', passed: /[a-z]/.test(password) },
      { label: '包含大写字母', passed: /[A-Z]/.test(password) },
      { label: '包含特殊字符', passed: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/.test(password) },
    ]
  }

  const score = strength?.score ?? 0

  return (
    <div className="space-y-2">
      {/* 强度条 */}
      <div className="flex items-center gap-2">
        <Shield className={cn('w-4 h-4', getTextColorClass(score))} />
        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300', getColorClass(score))}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className={cn('text-sm font-medium', getTextColorClass(score))}>
          {isValidating ? '验证中...' : getStrengthLabel(score)}
        </span>
      </div>

      {/* 详细检查项 */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-1 text-sm">
          {getChecks().map((check, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-1',
                check.passed ? 'text-green-400' : 'text-slate-500',
              )}
            >
              {check.passed ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              <span>{check.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* 提示信息 */}
      {strength && !strength.valid && (
        <p className="text-xs text-orange-400">{strength.message}</p>
      )}
    </div>
  )
}
