import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, Plus, X, Send, Eye, MessageCircle, MapPin, 
  Clock, Tag, Filter, ArrowLeftRight, Shield,
  GraduationCap, Backpack
} from 'lucide-react'
import { api } from '@/lib/api'
import type { ExchangeItem, ExchangeItemType } from '@/types'
import { cn } from '@/lib/utils'

const typeLabels: Record<ExchangeItemType, string> = {
  skill: '技能教学',
  equipment: '装备交换'
}

const typeIcons: Record<ExchangeItemType, React.ReactNode> = {
  skill: <GraduationCap className="w-4 h-4" />,
  equipment: <Backpack className="w-4 h-4" />
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

interface SensitiveCheckResult {
  hasSensitive: boolean
  foundWords: string[]
  filtered: string
}

const sortOptions = [
  { value: 'latest', label: '最新发布' },
  { value: 'popular', label: '最多浏览' },
  { value: 'requests', label: '最多请求' }
]

export default function Exchange() {
  const [items, setItems] = useState<ExchangeItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<ExchangeItemType | ''>('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    type: 'skill' as ExchangeItemType,
    userName: '',
    title: '',
    description: '',
    category: '',
    condition: 'good' as 'new' | 'excellent' | 'good' | 'fair' | 'poor',
    experienceLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    location: '',
    exchangePreference: '',
    availability: '',
    tags: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [sensitiveCheck, setSensitiveCheck] = useState<{
    checking: boolean
    result: { hasSensitive: boolean; foundWords: string[]; filtered: string } | null
  }>({ checking: false, result: null })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadItems()
    }, 300)
    return () => clearTimeout(timer)
  }, [search, selectedType, selectedCategory, selectedLocation, sortBy])

  useEffect(() => {
    loadCategories()
  }, [selectedType])

  async function loadData() {
    try {
      const [itemsData, locationsData] = await Promise.all([
        api.exchange.list({ sortBy: 'latest' }),
        api.exchange.locations()
      ])
      setItems(itemsData as ExchangeItem[])
      setLocations(locationsData as string[])
    } catch (error) {
      console.error('Failed to load exchange data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadCategories() {
    try {
      const params = selectedType ? { type: selectedType } : undefined
      const data = await api.exchange.categories(params)
      setCategories(data as string[])
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  async function loadItems() {
    try {
      const params: Record<string, string> = { sortBy }
      if (selectedType) params.type = selectedType
      if (selectedCategory) params.category = selectedCategory
      if (selectedLocation) params.location = selectedLocation
      if (search) params.search = search
      
      const data = await api.exchange.list(params)
      setItems(data as ExchangeItem[])
    } catch (error) {
      console.error('Failed to load items:', error)
    }
  }

  async function checkSensitive() {
    if (!createForm.description && !createForm.title) return
    
    setSensitiveCheck({ checking: true, result: null })
    try {
      const textToCheck = `${createForm.title} ${createForm.description}`
      const result = await api.checkSensitive(textToCheck)
      setSensitiveCheck({ checking: false, result: result as SensitiveCheckResult })
    } catch (error) {
      console.error('Failed to check sensitive content:', error)
      setSensitiveCheck({ checking: false, result: null })
    }
  }

  async function handleSubmit() {
    if (submitting) return

    if (!createForm.userName || !createForm.title || !createForm.description || 
        !createForm.category || !createForm.exchangePreference || !createForm.availability) {
      alert('请填写完整信息')
      return
    }

    setSubmitting(true)
    try {
      const itemData = {
        ...createForm,
        tags: createForm.tags ? createForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        condition: createForm.type === 'equipment' ? createForm.condition : undefined,
        experienceLevel: createForm.type === 'skill' ? createForm.experienceLevel : undefined
      }
      
      const result = await api.exchange.create(itemData)
      setItems(prev => [result as ExchangeItem, ...prev])
      setShowCreateForm(false)
      setCreateForm({
        type: 'skill',
        userName: '',
        title: '',
        description: '',
        category: '',
        condition: 'good',
        experienceLevel: 'intermediate',
        location: '',
        exchangePreference: '',
        availability: '',
        tags: ''
      })
      setSensitiveCheck({ checking: false, result: null })
    } catch (error) {
      if (error instanceof Error && error.message.includes('敏感词')) {
        alert(error.message)
      } else if (error instanceof Error) {
        alert('发布失败：' + error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-400">加载中...</div>
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <ArrowLeftRight className="w-10 h-10 text-orange-500" />
          生存技能与装备交换
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          发布你能教授的生存技能或闲置的生存装备，与志同道合的伙伴进行交换。
          发布前请确保内容合规，敏感内容将被自动过滤。
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            发布交换
          </button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
              <h3 className="text-xl font-semibold">发布交换</h3>
              <button
                onClick={() => {
                  setShowCreateForm(false)
                  setSensitiveCheck({ checking: false, result: null })
                }}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">你的昵称 *</label>
                  <input
                    type="text"
                    value={createForm.userName}
                    onChange={(e) => setCreateForm({...createForm, userName: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="输入昵称"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">交换类型 *</label>
                  <select
                    value={createForm.type}
                    onChange={(e) => setCreateForm({...createForm, type: e.target.value as ExchangeItemType, category: ''})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="skill">技能教学</option>
                    <option value="equipment">装备交换</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">分类 *</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({...createForm, category: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="">选择分类</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">所在地区</label>
                  <select
                    value={createForm.location}
                    onChange={(e) => setCreateForm({...createForm, location: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="">选择地区</option>
                    {locations.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {createForm.type === 'equipment' && (
                <div>
                  <label className="block text-sm text-slate-400 mb-1">物品成色</label>
                  <select
                    value={createForm.condition}
                    onChange={(e) => setCreateForm({...createForm, condition: e.target.value as 'new' | 'excellent' | 'good' | 'fair' | 'poor'})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="new">全新</option>
                    <option value="excellent">9成新</option>
                    <option value="good">8成新</option>
                    <option value="fair">7成新</option>
                    <option value="poor">较旧</option>
                  </select>
                </div>
              )}

              {createForm.type === 'skill' && (
                <div>
                  <label className="block text-sm text-slate-400 mb-1">技能水平</label>
                  <select
                    value={createForm.experienceLevel}
                    onChange={(e) => setCreateForm({...createForm, experienceLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced'})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="beginner">入门</option>
                    <option value="intermediate">进阶</option>
                    <option value="advanced">专业</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm text-slate-400 mb-1">标题 *</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="简要描述你要交换的技能或装备"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">详细描述 *</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                  onBlur={checkSensitive}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 min-h-[120px]"
                  placeholder="详细描述技能内容或装备情况..."
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

              <div>
                <label className="block text-sm text-slate-400 mb-1">希望交换什么 *</label>
                <input
                  type="text"
                  value={createForm.exchangePreference}
                  onChange={(e) => setCreateForm({...createForm, exchangePreference: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="如：希望交换急救医疗知识或户外装备"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">可用时间 *</label>
                <input
                  type="text"
                  value={createForm.availability}
                  onChange={(e) => setCreateForm({...createForm, availability: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="如：周末全天，工作日晚上"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">标签（用逗号分隔）</label>
                <input
                  type="text"
                  value={createForm.tags}
                  onChange={(e) => setCreateForm({...createForm, tags: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="如：取火, 水源净化, 野外生存"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setSensitiveCheck({ checking: false, result: null })
                  }}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? '发布中...' : '发布交换'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索技能、装备..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value as ExchangeItemType | '')
                  setSelectedCategory('')
                }}
                className="bg-transparent border-none focus:outline-none text-slate-300"
              >
                <option value="">全部类型</option>
                <option value="skill">技能教学</option>
                <option value="equipment">装备交换</option>
              </select>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="">全部分类</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="">全部地区</option>
              {locations.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-slate-400 text-sm flex items-center gap-1">
          <Tag className="w-4 h-4" />
          类型：
        </span>
        {Object.entries(typeLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedType(selectedType === key ? '' : key as ExchangeItemType)
              setSelectedCategory('')
            }}
            className={cn(
              'px-3 py-1 rounded-full text-sm transition-all flex items-center gap-1',
              selectedType === key
                ? `${typeColors[key as ExchangeItemType]} text-white`
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            )}
          >
            {typeIcons[key as ExchangeItemType]} {label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-slate-400">
            没有找到相关的交换信息
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              to={`/exchange/${item.id}`}
              className="block bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-all group"
            >
              <div className="aspect-video relative overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                    {item.type === 'skill' ? (
                      <GraduationCap className="w-16 h-16 text-slate-500" />
                    ) : (
                      <Backpack className="w-16 h-16 text-slate-500" />
                    )}
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={cn(
                    'px-2 py-1 text-xs rounded-full text-white flex items-center gap-1',
                    typeColors[item.type]
                  )}>
                    {typeIcons[item.type]}
                    {typeLabels[item.type]}
                  </span>
                  {item.status === 'open' ? (
                    <span className="px-2 py-1 bg-green-600 text-xs rounded-full text-white">
                      可交换
                    </span>
                  ) : item.status === 'pending' ? (
                    <span className="px-2 py-1 bg-yellow-600 text-xs rounded-full text-white">
                      交换中
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-slate-600 text-xs rounded-full text-white">
                      已完成
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {item.condition && (
                    <span className="px-2 py-0.5 bg-purple-900/50 text-purple-300 text-xs rounded">
                      {conditionLabels[item.condition]}
                    </span>
                  )}
                  {item.experienceLevel && (
                    <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 text-xs rounded">
                      {levelLabels[item.experienceLevel]}
                    </span>
                  )}
                  {item.location && (
                    <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                  {item.description}
                </p>

                <div className="mb-3">
                  <p className="text-xs text-orange-400 mb-1">想交换：</p>
                  <p className="text-sm text-slate-300 line-clamp-1">{item.exchangePreference}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {item.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-700/50 text-slate-400 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.userAvatar}
                      alt={item.userName}
                      className="w-8 h-8 rounded-full bg-slate-700"
                    />
                    <span className="text-sm text-slate-300">{item.userName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {item.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {item.requests}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.createdAt}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
