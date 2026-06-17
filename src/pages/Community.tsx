import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Search, Heart, MessageCircle, Tag, MapPin, 
  AlertTriangle, Clock, Plus, X, Send, Shield
} from 'lucide-react'
import { api } from '@/lib/api'
import type { CommunityPost } from '@/types'
import { cn } from '@/lib/utils'

const categoryIcons: Record<string, string> = {
  experience: '📝',
  discussion: '💬',
  question: '❓',
  regional: '📍'
}

const categoryLabels: Record<string, string> = {
  experience: '真实经历',
  discussion: '讨论交流',
  question: '求助问答',
  regional: '区域讨论'
}

const categoryColors: Record<string, string> = {
  experience: 'bg-blue-600',
  discussion: 'bg-purple-600',
  question: 'bg-yellow-600',
  regional: 'bg-green-600'
}

const sortOptions = [
  { value: 'emergency', label: '紧急优先' },
  { value: 'latest', label: '最新发布' },
  { value: 'popular', label: '最多点赞' },
  { value: 'comments', label: '最多评论' }
]

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [sortBy, setSortBy] = useState('emergency')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    userName: '',
    title: '',
    content: '',
    category: 'experience' as 'experience' | 'discussion' | 'question' | 'regional',
    region: '',
    tags: '',
    isEmergency: false
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
      loadPosts()
    }, 300)
    return () => clearTimeout(timer)
  }, [search, selectedCategory, selectedRegion, sortBy])

  async function loadData() {
    try {
      const [postsData, regionsData] = await Promise.all([
        api.community.list({ sortBy: 'emergency' }),
        api.community.regions()
      ])
      setPosts(postsData as CommunityPost[])
      setRegions(regionsData as string[])
    } catch (error) {
      console.error('Failed to load community data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadPosts() {
    try {
      const params: Record<string, string> = { sortBy }
      if (selectedCategory) params.category = selectedCategory
      if (selectedRegion) params.region = selectedRegion
      if (search) params.search = search
      
      const data = await api.community.list(params)
      setPosts(data as CommunityPost[])
    } catch (error) {
      console.error('Failed to load posts:', error)
    }
  }

  async function checkSensitive() {
    if (!createForm.content && !createForm.title) return
    
    setSensitiveCheck({ checking: true, result: null })
    try {
      const textToCheck = `${createForm.title} ${createForm.content}`
      const result = await api.checkSensitive(textToCheck)
      setSensitiveCheck({ checking: false, result: result as any })
    } catch (error) {
      console.error('Failed to check sensitive content:', error)
      setSensitiveCheck({ checking: false, result: null })
    }
  }

  async function handleSubmit() {
    if (submitting) return

    if (!createForm.userName || !createForm.title || !createForm.content) {
      alert('请填写完整信息')
      return
    }

    setSubmitting(true)
    try {
      const postData = {
        ...createForm,
        tags: createForm.tags ? createForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        region: createForm.category === 'regional' ? createForm.region : undefined
      }
      
      const result = await api.community.create(postData)
      setPosts(prev => [result as CommunityPost, ...prev])
      setShowCreateForm(false)
      setCreateForm({
        userName: '',
        title: '',
        content: '',
        category: 'experience',
        region: '',
        tags: '',
        isEmergency: false
      })
      setSensitiveCheck({ checking: false, result: null })
    } catch (error: any) {
      if (error.message.includes('敏感词')) {
        alert(error.message)
      } else {
        alert('发布失败：' + error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLike(postId: string) {
    try {
      await api.community.like(postId)
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ))
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-400">加载中...</div>
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Users className="w-10 h-10 text-orange-500" />
          生存者社区
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          真实经历分享，区域化讨论，和志同道合的伙伴一起交流。
          发言请遵守社区规范，敏感内容将被自动过滤。
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            发布新帖
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
              <h3 className="text-xl font-semibold">发布新帖</h3>
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
                  <label className="block text-sm text-slate-400 mb-1">帖子分类 *</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({...createForm, category: e.target.value as any})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="experience">真实经历</option>
                    <option value="discussion">讨论交流</option>
                    <option value="question">求助问答</option>
                    <option value="regional">区域讨论</option>
                  </select>
                </div>
              </div>
              
              {createForm.category === 'regional' && (
                <div>
                  <label className="block text-sm text-slate-400 mb-1">所在地区</label>
                  <select
                    value={createForm.region}
                    onChange={(e) => setCreateForm({...createForm, region: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="">选择地区</option>
                    {regions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
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
                  placeholder="简要描述你的帖子内容"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">内容 *</label>
                <textarea
                  value={createForm.content}
                  onChange={(e) => setCreateForm({...createForm, content: e.target.value})}
                  onBlur={checkSensitive}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 min-h-[150px]"
                  placeholder="分享你的经历、想法或问题..."
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
                <label className="block text-sm text-slate-400 mb-1">标签（用逗号分隔）</label>
                <input
                  type="text"
                  value={createForm.tags}
                  onChange={(e) => setCreateForm({...createForm, tags: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="如：地震, 北京, 应急"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createForm.isEmergency}
                  onChange={(e) => setCreateForm({...createForm, isEmergency: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  标记为紧急求助
                </span>
              </label>

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
                  {submitting ? '发布中...' : '发布帖子'}
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
              placeholder="搜索帖子、标签..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="">全部分类</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{categoryIcons[key]} {label}</option>
              ))}
            </select>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="">全部地区</option>
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-slate-400 text-sm flex items-center gap-1">
          <Tag className="w-4 h-4" />
          分类：
        </span>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(selectedCategory === key ? '' : key)}
            className={cn(
              'px-3 py-1 rounded-full text-sm transition-all flex items-center gap-1',
              selectedCategory === key
                ? `${categoryColors[key]} text-white`
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            )}
          >
            {categoryIcons[key]} {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            没有找到相关帖子
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              to={`/community/${post.id}`}
              className={cn(
                'block bg-slate-800/50 border rounded-xl p-6 hover:border-slate-500 transition-all',
                post.isEmergency ? 'border-red-700 bg-red-900/10' : 'border-slate-700'
              )}
            >
              {post.isEmergency && (
                <div className="flex items-center gap-2 text-red-400 text-sm mb-3">
                  <AlertTriangle className="w-4 h-4 animate-pulse" />
                  <span className="font-medium">紧急求助</span>
                </div>
              )}
              <div className="flex items-start gap-4">
                <img 
                  src={post.userAvatar} 
                  alt={post.userName}
                  className="w-12 h-12 rounded-full bg-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={cn(
                      'px-2 py-0.5 text-xs rounded-full text-white',
                      categoryColors[post.category]
                    )}>
                      {categoryIcons[post.category]} {categoryLabels[post.category]}
                    </span>
                    {post.region && (
                      <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {post.region}
                      </span>
                    )}
                    <span className="text-slate-500 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.createdAt}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 hover:text-orange-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-3">{post.content}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {post.tags.slice(0, 5).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-700/50 text-slate-400 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 mt-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="text-slate-300">{post.userName}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleLike(post.id)
                      }}
                      className="flex items-center gap-1 hover:text-red-400 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
