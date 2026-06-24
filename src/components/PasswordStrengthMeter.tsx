/**
 * 密码强度指示器组件
 * 实时显示密码强度等级和各项要求的满足情况
 */

import { Check, X } from 'lucide-react'
import type { PasswordValidationResult, PasswordStrength } from '@/types'
import { cn } from '@/lib/utils'

/**
 * 获取密码强度对应的颜色
 */
function getStrengthColor(strength: PasswordStrength): string {
  const colors: Record<PasswordStrength, string> = {
    weak: 'bg-red-500',
    fair: 'bg-orange-500',
    good: 'bg-yellow-500',
    strong: 'bg-green-500',
    'very-strong': 'bg-emerald-500',
  }
  return colors[strength]
}

/**
 * 获取密码强度对应的文字描述
 */
function getStrengthText(strength: PasswordStrength): string {
  const texts: Record<PasswordStrength, string> = {
    weak: '弱',
    fair: '一般',
    good: '良好',
    strong: '强',
    'very-strong': '非常强',
  }
  return texts[strength]
}

/**
 * 获取密码强度对应的文字颜色
 */
function getStrengthTextColor(strength: PasswordStrength): string {
  const colors: Record<PasswordStrength, string> = {
    weak: 'text-red-400',
    fair: 'text-orange-400',
    good: 'text-yellow-400',
    strong: 'text-green-400',
    'very-strong': 'text-emerald-400',
  }
  return colors[strength]
}

interface PasswordStrengthMeterProps {
  // 密码验证结果
  validation: PasswordValidationResult | null
  // 是否显示详细的密码要求列表
  showRequirements?: boolean
}

export default function PasswordStrengthMeter({
  validation,
  showRequirements = true,
}: PasswordStrengthMeterProps) {
  // 如果没有验证结果，显示空状态
  if (!validation) {
    return (
      <div className="space-y-2">
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full w-0 transition-all duration-300" />
        </div>
        {showRequirements && (
          <div className="text-sm text-slate-400">请输入密码以查看强度</div>
        )}
      </div>
    )
  }

  const strengthColor = getStrengthColor(validation.strength)
  const strengthText = getStrengthText(validation.strength)
  const strengthTextColor = getStrengthTextColor(validation.strength)

  // 密码要求列表
  const requirements = [
    { key: 'hasMinLength', label: '至少8位字符', met: validation.requirements.hasMinLength },
    { key: 'hasUpperCase', label: '包含大写字母', met: validation.requirements.hasUpperCase },
    { key: 'hasLowerCase', label: '包含小写字母', met: validation.requirements.hasLowerCase },
    { key: 'hasSpecialChar', label: '包含特殊字符', met: validation.requirements.hasSpecialChar },
    { key: 'hasNumber', label: '包含数字（推荐）', met: validation.requirements.hasNumber },
  ]

  return (
    <div className="space-y-3">
      {/* 强度进度条 */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">密码强度</span>
          <span className={cn('text-sm font-medium', strengthTextColor)}>
            {strengthText}
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300', strengthColor)}
            style={{ width: `${validation.score}%` }}
          />
        </div>
      </div>

      {/* 密码要求列表 */}
      {showRequirements && (
        <div className="space-y-1.5">
          {requirements.map((req) => (
            <div
              key={req.key}
              className={cn(
                'flex items-center gap-2 text-sm transition-colors',
                req.met ? 'text-green-400' : 'text-slate-400',
              )}
            >
              {req.met ? (
                <Check className="w-4 h-4 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
