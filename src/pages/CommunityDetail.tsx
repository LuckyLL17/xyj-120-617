import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, Heart, MessageCircle, Tag, MapPin, 
  AlertTriangle, Clock, Send, Shield, User
} from 'lucide-react'
import { api } from '@/lib/api'
import type { CommunityPost, Comment } from '@/types'
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

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentForm, setCommentForm] = useState({
    userName: '',
    content: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [sensitiveCheck, setSensitiveCheck] = useState<{
    checking: boolean
    result: { hasSensitive: boolean; foundWords: string[]; filtered: string } | null
  }>({ checking: false, result: null })

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  async function loadData() {
    try {
      const [postData, commentsData] = await Promise.all([
        api.community.get(id!),
        api.community.getComments(id!)
      ])
      setPost(postData as CommunityPost)
      setComments(commentsData as Comment[])
    } catch (error) {
      console.error('Failed to load post detail:', error)
    } finally {
      setLoading(false)
    }
  }

  async function checkSensitive() {
    if (!commentForm.content) return
    
    setSensitiveCheck({ checking: true, result: null })
    try {
      const result = await api.checkSensitive(commentForm.content)
      setSensitiveCheck({ checking: false, result: result as any })
    } catch (error) {
      console.error('Failed to check sensitive content:', error)
      setSensitiveCheck({ checking: false, result: null })
    }
  }

  async function handleSubmitComment() {
    if (submitting) return

    if (!commentForm.userName || !commentForm.content) {
      alert('请填写昵称和评论内容')
      return
    }

    setSubmitting(true)
    try {
      const result = await api.community.addComment(id!, commentForm)
      setComments(prev => [...prev, result as Comment])
      setPost(prev => prev ? { ...prev, comments: prev.comments + 1 } : null)
      setCommentForm({ userName: '', content: '' })
      setSensitiveCheck({ checking: false, result: null })
    } catch (error: any) {
      if (error.message.includes('敏感词')) {
        alert(error.message)
      } else {
        alert('评论失败：' + error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLikePost() {
    if (!post) return
    try {
      await api.community.like(post.id)
      setPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null)
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  async function handleLikeComment(commentId: string) {
    try {
      await api.community.likeComment(commentId)
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      ))
    } catch (error) {
      console.error('Failed to like comment:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-400">加载中...</div>
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">帖子不存在或已被删除</p>
        <Link to="/community" className="text-orange-500 hover:text-orange-400">
          返回社区列表
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link to="/community" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        返回社区
      </Link>

      <article className={cn(
        'bg-slate-800/50 border rounded-xl p-6 md:p-8',
        post.isEmergency ? 'border-red-700 bg-red-900/10' : 'border-slate-700'
      )}>
        {post.isEmergency && (
          <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span className="font-medium">紧急求助</span>
          </div>
        )}

        <div className="flex items-start gap-4 mb-6">
          <img 
            src={post.userAvatar} 
            alt={post.userName}
            className="w-14 h-14 rounded-full bg-slate-700"
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
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-slate-400">
              发布者：<span className="text-slate-300">{post.userName}</span>
            </p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none mb-6">
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-base">
            {post.content}
          </p>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 pt-6 border-t border-slate-700">
            <Tag className="w-4 h-4 text-slate-500" />
            {post.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-slate-700/50 text-slate-400 text-sm rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-6 pt-6 border-t border-slate-700">
          <button
            onClick={handleLikePost}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span>{post.likes} 人点赞</span>
          </button>
          <span className="flex items-center gap-2 text-slate-400">
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments} 条评论</span>
          </span>
        </div>
      </article>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-orange-500" />
          发表评论
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">你的昵称 *</label>
            <input
              type="text"
              value={commentForm.userName}
              onChange={(e) => setCommentForm({...commentForm, userName: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
              placeholder="输入昵称"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">评论内容 *</label>
            <textarea
              value={commentForm.content}
              onChange={(e) => setCommentForm({...commentForm, content: e.target.value})}
              onBlur={checkSensitive}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 min-h-[100px]"
              placeholder="写下你的看法、建议或经验分享..."
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
          <div className="flex justify-end">
            <button
              onClick={handleSubmitComment}
              disabled={submitting}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? '发表中...' : '发表评论'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-orange-500" />
          全部评论 ({comments.length})
        </h3>
        {comments.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-800/30 border border-slate-700 rounded-xl">
            暂无评论，快来抢沙发吧！
          </div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <img 
                  src={comment.userAvatar} 
                  alt={comment.userName}
                  className="w-10 h-10 rounded-full bg-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="font-medium text-slate-200">{comment.userName}</span>
                    <span className="text-slate-500 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center gap-1 text-slate-500 hover:text-red-400 transition-colors text-sm"
                  >
                    <Heart className="w-4 h-4" />
                    {comment.likes}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
