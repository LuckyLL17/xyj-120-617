import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { 
  ArrowLeft, Star, ThumbsUp, ThumbsDown, Check, X, 
  MessageSquare, Send, Shield, AlertCircle, GitCompare
} from 'lucide-react'
import { api } from '@/lib/api'
import type { Equipment, EquipmentReview } from '@/types'
import { cn } from '@/lib/utils'

const scenarioNames: Record<string, string> = {
  urban: '城市',
  wilderness: '野外',
  vehicle: '车辆',
  home: '家庭',
  disaster: '灾难',
  medical: '医疗'
}

export default function EquipmentDetail() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const compareIds = searchParams.get('ids')?.split(',') || []
  
  const [item, setItem] = useState<Equipment | null>(null)
  const [compareItems, setCompareItems] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    rating: 5,
    title: '',
    content: '',
    usageDuration: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (compareIds.length >= 2) {
      loadComparison()
    } else if (id) {
      loadEquipment()
    }
  }, [id, compareIds])

  async function loadEquipment() {
    try {
      const data = await api.equipment.get(id!)
      setItem(data as Equipment)
    } catch (error) {
      console.error('Failed to load equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadComparison() {
    try {
      const data = await api.equipment.compare(compareIds) as { items: Equipment[] }
      setCompareItems(data.items)
      if (data.items.length > 0) {
        setItem(data.items[0])
      }
    } catch (error) {
      console.error('Failed to load comparison:', error)
    } finally {
      setLoading(false)
    }
  }

  async function submitReview() {
    if (!id || submitting) return

    if (!reviewForm.userName || !reviewForm.title || !reviewForm.content) {
      alert('请填写完整的评价信息')
      return
    }

    setSubmitting(true)
    try {
      await api.equipment.addReview(id, reviewForm)
      alert('评价提交成功！')
      setShowReviewForm(false)
      setReviewForm({ userName: '', rating: 5, title: '', content: '', usageDuration: '' })
      loadEquipment()
    } catch (error) {
      console.error('Failed to submit review:', error)
      alert('提交失败：' + (error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-400">加载中...</div>
  }

  if (compareItems.length >= 2) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <Link
          to="/equipment"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回装备列表
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <GitCompare className="w-8 h-8 text-orange-500" />
            装备横向对比
          </h1>
          <p className="text-slate-400">对比 {compareItems.length} 款装备的各项参数</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="p-4 text-left bg-slate-800 sticky left-0">对比项</th>
                  {compareItems.map(item => (
                    <th key={item.id} className="p-4 text-center min-w-[200px]">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                      />
                      <p className="text-sm text-slate-400">{item.brand}</p>
                      <p className="font-semibold">{item.name}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700">
                  <td className="p-4 bg-slate-800/50 sticky left-0 font-medium">价格</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 text-center">
                      <span className="text-2xl font-bold text-orange-400">¥{item.price}</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="p-4 bg-slate-800/50 sticky left-0 font-medium">综合评分</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-xl font-bold">{item.rating}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="p-4 bg-slate-800/50 sticky left-0 font-medium">性价比</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 text-center">
                      <span className={cn(
                        'text-lg font-bold',
                        item.valueScore >= 4.5 ? 'text-green-400' : 
                        item.valueScore >= 4 ? 'text-yellow-400' : 'text-orange-400'
                      )}>
                        {item.valueScore.toFixed(1)}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="p-4 bg-slate-800/50 sticky left-0 font-medium">优点</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4">
                      <div className="space-y-1">
                        {item.pros.map((pro, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <ThumbsUp className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="p-4 bg-slate-800/50 sticky left-0 font-medium">缺点</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4">
                      <div className="space-y-1">
                        {item.cons.map((con, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <ThumbsDown className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <span>{con}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="p-4 bg-slate-800/50 sticky left-0 font-medium">适用场景</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {item.scenarios.map(s => (
                          <span key={s} className="px-2 py-1 bg-slate-700 text-sm rounded">
                            {scenarioNames[s]}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 bg-slate-800/50 sticky left-0 font-medium">操作</td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 text-center">
                      <Link
                        to={`/equipment/${item.id}`}
                        className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
                      >
                        查看详情
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">装备不存在</p>
        <Link to="/equipment" className="text-orange-400 hover:text-orange-300">
          返回装备列表
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        to="/equipment"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回装备列表
      </Link>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square bg-slate-900">
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <p className="text-slate-400">{item.brand}</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1 mb-4">{item.name}</h1>
            
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-orange-400">¥{item.price}</span>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg">{item.rating}</span>
                <span className="text-slate-500">({item.reviews.length}条评价)</span>
              </div>
            </div>

            <p className="text-slate-300 mb-6">{item.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <p className="text-sm text-slate-400">性价比评分</p>
                <p className="text-2xl font-bold text-green-400">{item.valueScore.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <p className="text-sm text-slate-400">适用场景</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.scenarios.slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-0.5 bg-slate-700 text-xs rounded">
                      {scenarioNames[s]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-2 text-green-400">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm font-medium">主要优点</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.pros.map((pro, i) => (
                  <span key={i} className="px-3 py-1.5 bg-green-900/30 text-green-300 text-sm rounded-lg">
                    ✓ {pro}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-red-400">
                <ThumbsDown className="w-4 h-4" />
                <span className="text-sm font-medium">需要注意</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.cons.map((con, i) => (
                  <span key={i} className="px-3 py-1.5 bg-red-900/30 text-red-300 text-sm rounded-lg">
                    ✗ {con}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setActiveTab('details')}
            className={cn(
              'flex-1 px-6 py-4 font-medium transition-colors',
              activeTab === 'details' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-slate-400 hover:text-white'
            )}
          >
            详细参数
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={cn(
              'flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2',
              activeTab === 'reviews' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-slate-400 hover:text-white'
            )}
          >
            <MessageSquare className="w-4 h-4" />
            用户评价 ({item.reviews.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                  规格参数
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(item.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                      <span className="text-slate-400">{key}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">适用场景详情</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(scenarioNames).map(([key, name]) => (
                    <div 
                      key={key}
                      className={cn(
                        'p-3 rounded-lg flex items-center gap-2',
                        item.scenarios.includes(key as any)
                          ? 'bg-green-900/30 border border-green-700'
                          : 'bg-slate-900/30 border border-slate-700 opacity-50'
                      )}
                    >
                      {item.scenarios.includes(key as any) ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <X className="w-5 h-5 text-slate-600" />
                      )}
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-300">购买建议</p>
                    <p className="text-sm text-yellow-200/80 mt-1">
                      本网站仅提供装备测评信息，不参与任何销售。
                      请根据自身需求和实际情况，在正规渠道购买。
                      所有测评均为用户真实反馈，本站不接受厂商充值。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">用户真实评价</h3>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
                >
                  写评价
                </button>
              </div>

              {showReviewForm && (
                <div className="p-6 bg-slate-900/50 rounded-xl space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">你的昵称</label>
                      <input
                        type="text"
                        value={reviewForm.userName}
                        onChange={(e) => setReviewForm({...reviewForm, userName: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                        placeholder="输入昵称"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">使用时长</label>
                      <input
                        type="text"
                        value={reviewForm.usageDuration}
                        onChange={(e) => setReviewForm({...reviewForm, usageDuration: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                        placeholder="如：3个月"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">评分</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setReviewForm({...reviewForm, rating: star})}
                          className="p-1"
                        >
                          <Star 
                            className={cn(
                              'w-8 h-8 transition-colors',
                              star <= reviewForm.rating 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-slate-600'
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">评价标题</label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                      placeholder="一句话总结你的使用感受"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">详细评价</label>
                    <textarea
                      value={reviewForm.content}
                      onChange={(e) => setReviewForm({...reviewForm, content: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 min-h-[100px]"
                      placeholder="分享你的使用体验..."
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={submitReview}
                      disabled={submitting}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? '提交中...' : '提交评价'}
                    </button>
                  </div>
                </div>
              )}

              {item.reviews.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  暂无评价，来做第一个评价的人吧
                </div>
              ) : (
                <div className="space-y-4">
                  {item.reviews.map((review: EquipmentReview) => (
                    <div key={review.id} className="p-4 bg-slate-900/50 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.userName}</span>
                              {review.verified && (
                                <span className="px-2 py-0.5 bg-green-900/50 text-green-400 text-xs rounded-full">
                                  已验证购买
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <span>使用 {review.usageDuration}</span>
                              <span>•</span>
                              <span>{review.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'w-4 h-4',
                                i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="font-medium mb-2">{review.title}</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{review.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
