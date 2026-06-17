import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Send, X, Eye, MessageCircle, MapPin, 
  Clock, Tag, Shield, Check, XCircle,
  GraduationCap, Backpack, Calendar, AlertCircle,
  Handshake
} from 'lucide-react'
import { api } from '@/lib/api'
import type { ExchangeItem, ExchangeRequest, ExchangeItemType } from '@/types'
import { cn } from '@/lib/utils'

const typeLabels: Record<ExchangeItemType, string> = {
  skill: '技能教学',
  equipment: '装备交换'
}

const typeIcons: Record<ExchangeItemType, React.ReactNode> = {
  skill: <GraduationCap className="w-5 h-5" />,
  equipment: <Backpack className="w-5 h-5" />
}

const typeColors: Record<ExchangeItemType, string> = {
  skill: 'bg-blue-600',
  equipment: 'bg-emerald-600'
}

const conditionLabels: Record<string, string> = {
  new: '全新',
  excellent: '9成新',
  good: '8成新',
  fair: '7成新',
  poor: '较旧'
}

const levelLabels: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '专业'
}

const statusLabels: Record<string, string> = {
  pending: '待处理',
  accepted: '已接受',
  rejected: '已拒绝',
  completed: '已完成'
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-600',
  accepted: 'bg-green-600',
  rejected: 'bg-red-600',
  completed: 'bg-slate-600'
}

interface SensitiveCheckResult {
  hasSensitive: boolean
  foundWords: string[]
  filtered: string
}

interface ExchangeItemDetail extends ExchangeItem {
  requestList: ExchangeRequest[]
}

export default function ExchangeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<ExchangeItemDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestForm, setRequestForm] = useState({
    requesterName: '',
    contactInfo: '',
    message: '',
    offerDetails: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [sensitiveCheck, setSensitiveCheck] = useState<{
    checking: boolean
    result: { hasSensitive: boolean; foundWords: string[]; filtered: string } | null
  }>({ checking: false, result: null })

  useEffect(() => {
    if (id) {
      loadItem()
    }
  }, [id])

  async function loadItem() {
    try {
      const data = await api.exchange.get(id!)
      setItem(data as ExchangeItemDetail)
    } catch (error) {
      console.error('Failed to load exchange item:', error)
    } finally {
      setLoading(false)
    }
  }

  async function checkSensitive() {
    if (!requestForm.message && !requestForm.offerDetails) return
    
    setSensitiveCheck({ checking: true, result: null })
    try {
      const textToCheck = `${requestForm.message} ${requestForm.offerDetails}`
      const result = await api.checkSensitive(textToCheck)
      setSensitiveCheck({ checking: false, result: result as SensitiveCheckResult })
    } catch (error) {
      console.error('Failed to check sensitive content:', error)
      setSensitiveCheck({ checking: false, result: null })
    }
  }

  async function handleSubmitRequest() {
    if (submitting) return

    if (!requestForm.requesterName || !requestForm.contactInfo || 
        !requestForm.message || !requestForm.offerDetails) {
      alert('请填写完整信息')
      return
    }

    setSubmitting(true)
    try {
      await api.exchange.sendRequest(id!, requestForm)
      alert('交换请求已发送！发布者会尽快与你联系。')
      setShowRequestForm(false)
      setRequestForm({
        requesterName: '',
        contactInfo: '',
        message: '',
        offerDetails: ''
      })
      setSensitiveCheck({ checking: false, result: null })
      loadItem()
    } catch (error) {
      if (error instanceof Error && error.message.includes('敏感词')) {
        alert(error.message)
      } else if (error instanceof Error) {
        alert('发送失败：' + error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRequestStatus(requestId: string, status: string) {
    try {
      await api.exchange.updateRequestStatus(requestId, status)
      alert(`已${status === 'accepted' ? '接受' : status === 'rejected' ? '拒绝' : '标记为完成'}该请求`)
      loadItem()
    } catch (error) {
      console.error('Failed to update request status:', error)
      alert('操作失败，请重试')
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-400">加载中...</div>
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">该交换信息不存在或已被删除</p>
        <Link
          to="/exchange"
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold">交换详情</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="aspect-video relative">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  {item.type === 'skill' ? (
                    <GraduationCap className="w-24 h-24 text-slate-500" />
                  ) : (
                    <Backpack className="w-24 h-24 text-slate-500" />
                  )}
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={cn(
                  'px-3 py-1.5 text-sm rounded-full text-white flex items-center gap-2',
                  typeColors[item.type]
                )}>
                  {typeIcons[item.type]}
                  {typeLabels[item.type]}
                </span>
                {item.status === 'open' ? (
                  <span className="px-3 py-1.5 bg-green-600 text-sm rounded-full text-white flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    可交换
                  </span>
                ) : item.status === 'pending' ? (
                  <span className="px-3 py-1.5 bg-yellow-600 text-sm rounded-full text-white flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    交换中
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-slate-600 text-sm rounded-full text-white flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    已完成
                  </span>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {item.condition && (
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded">
                    成色：{conditionLabels[item.condition]}
                  </span>
                )}
                {item.experienceLevel && (
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded">
                    技能水平：{levelLabels[item.experienceLevel]}
                  </span>
                )}
                {item.location && (
                  <span className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold mb-4">{item.title}</h2>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {item.views} 次浏览
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {item.requests} 个交换请求
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  发布于 {item.createdAt}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-orange-500" />
                  标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-500" />
                  详细描述
                </h3>
                <div className="bg-slate-900/50 rounded-lg p-4 text-slate-300 whitespace-pre-wrap">
                  {item.description}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-orange-500" />
                  希望交换
                </h3>
                <div className="bg-orange-900/20 border border-orange-800/50 rounded-lg p-4 text-orange-200">
                  {item.exchangePreference}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  可用时间
                </h3>
                <div className="bg-slate-900/50 rounded-lg p-4 text-slate-300">
                  {item.availability}
                </div>
              </div>
            </div>
          </div>

          {item.requestList && item.requestList.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-orange-500" />
                交换请求 ({item.requestList.length})
              </h3>
              <div className="space-y-4">
                {item.requestList.map((request) => (
                  <div
                    key={request.id}
                    className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={request.requesterAvatar}
                          alt={request.requesterName}
                          className="w-10 h-10 rounded-full bg-slate-700"
                        />
                        <div>
                          <p className="font-medium text-slate-200">{request.requesterName}</p>
                          <p className="text-sm text-slate-500">{request.createdAt}</p>
                        </div>
                      </div>
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-full text-white',
                        statusColors[request.status]
                      )}>
                        {statusLabels[request.status]}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">留言：</p>
                        <p className="text-slate-300">{request.message}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">交换意向：</p>
                        <p className="text-slate-300">{request.offerDetails}</p>
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex gap-2 pt-2 border-t border-slate-700">
                          <button
                            onClick={() => handleRequestStatus(request.id, 'accepted')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            接受请求
                          </button>
                          <button
                            onClick={() => handleRequestStatus(request.id, 'rejected')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            拒绝请求
                          </button>
                        </div>
                      )}
                      {request.status === 'accepted' && (
                        <div className="pt-2 border-t border-slate-700">
                          <div className="p-3 bg-blue-900/30 border border-blue-800/50 rounded-lg">
                            <p className="text-sm text-blue-300 mb-1">联系方式：</p>
                            <p className="text-blue-200 font-mono">{request.contactInfo}</p>
                          </div>
                          <button
                            onClick={() => handleRequestStatus(request.id, 'completed')}
                            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            标记为已完成
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={item.userAvatar}
                alt={item.userName}
                className="w-14 h-14 rounded-full bg-slate-700"
              />
              <div>
                <p className="font-semibold text-lg">{item.userName}</p>
                <p className="text-sm text-slate-400">发布者</p>
              </div>
            </div>

            {item.status === 'open' && (
              <button
                onClick={() => setShowRequestForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors font-medium"
              >
                <Handshake className="w-5 h-5" />
                发起交换请求
              </button>
            )}

            {item.status !== 'open' && (
              <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-slate-400">
                  {item.status === 'pending' ? '该交换正在进行中' : '该交换已完成'}
                </p>
              </div>
            )}
          </div>

          <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-6">
            <h4 className="font-semibold text-amber-300 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              安全提示
            </h4>
            <ul className="space-y-2 text-sm text-amber-200/80">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                建议在公共场所进行交换，注意个人安全
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                交换前请仔细核实物品或技能的真实性
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                不要提前支付任何费用
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                遇到可疑情况请及时举报
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showRequestForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
              <h3 className="text-xl font-semibold">发起交换请求</h3>
              <button
                onClick={() => {
                  setShowRequestForm(false)
                  setSensitiveCheck({ checking: false, result: null })
                }}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-lg mb-4">
                <p className="text-sm text-slate-400 mb-1">你正在请求交换：</p>
                <p className="font-medium text-slate-200">{item.title}</p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">你的昵称 *</label>
                <input
                  type="text"
                  value={requestForm.requesterName}
                  onChange={(e) => setRequestForm({...requestForm, requesterName: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="输入你的昵称"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">联系方式 *</label>
                <input
                  type="text"
                  value={requestForm.contactInfo}
                  onChange={(e) => setRequestForm({...requestForm, contactInfo: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="如：微信: your_wechat 或 电话: 138****5678"
                />
                <p className="text-xs text-slate-500 mt-1">你的联系方式仅在对方接受请求后才会显示</p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">留言 *</label>
                <textarea
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({...requestForm, message: e.target.value})}
                  onBlur={checkSensitive}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 min-h-[100px]"
                  placeholder="简单介绍一下你自己，为什么想要这个交换..."
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">你能提供什么 *</label>
                <textarea
                  value={requestForm.offerDetails}
                  onChange={(e) => setRequestForm({...requestForm, offerDetails: e.target.value})}
                  onBlur={checkSensitive}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 min-h-[100px]"
                  placeholder="详细描述你能提供的交换内容，如技能、装备等..."
                />
                {sensitiveCheck.checking && (
                  <p className="text-sm text-orange-400 mt-1">正在检查敏感词...</p>
                )}
                {sensitiveCheck.result && sensitiveCheck.result.hasSensitive && (
                  <div className="mt-2 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      检测到敏感词：{sensitiveCheck.result.foundWords.join(', ')}
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      建议修改为：{sensitiveCheck.result.filtered}
                    </p>
                  </div>
                )}
                {sensitiveCheck.result && !sensitiveCheck.result.hasSensitive && (
                  <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    内容安全，未检测到敏感词
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    setShowRequestForm(false)
                    setSensitiveCheck({ checking: false, result: null })
                  }}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitRequest}
                  disabled={submitting}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? '发送中...' : '发送请求'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
