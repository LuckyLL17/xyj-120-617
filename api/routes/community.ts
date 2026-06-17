import express, { type Request, type Response } from 'express'
import { communityPosts, comments } from '../data/mockData.js'
import { sensitiveContentFilter } from '../middleware/sensitiveFilter.js'
import type { CommunityPost, Comment } from '../../src/types'

const router = express.Router()

router.get('/', (req: Request, res: Response): void => {
  const { category, region, tag, search, sortBy } = req.query

  let posts = [...communityPosts]

  if (category && typeof category === 'string') {
    posts = posts.filter(post => post.category === category)
  }

  if (region && typeof region === 'string') {
    posts = posts.filter(post => post.region === region)
  }

  if (tag && typeof tag === 'string') {
    posts = posts.filter(post => post.tags.includes(tag))
  }

  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase()
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.tags.some(t => t.toLowerCase().includes(searchLower))
    )
  }

  if (sortBy && typeof sortBy === 'string') {
    switch (sortBy) {
      case 'latest':
        posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'popular':
        posts.sort((a, b) => b.likes - a.likes)
        break
      case 'comments':
        posts.sort((a, b) => b.comments - a.comments)
        break
      case 'emergency':
        posts.sort((a, b) => (b.isEmergency ? 1 : 0) - (a.isEmergency ? 1 : 0))
        break
    }
  }

  res.status(200).json({
    success: true,
    data: posts
  })
})

router.get('/regions', (req: Request, res: Response): void => {
  const regions = [...new Set(communityPosts.filter(p => p.region).map(p => p.region))]
  
  res.status(200).json({
    success: true,
    data: regions
  })
})

router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params
  const post = communityPosts.find(p => p.id === id)

  if (!post) {
    res.status(404).json({
      success: false,
      error: '帖子不存在'
    })
    return
  }

  const postComments = comments.filter(c => c.postId === id)

  res.status(200).json({
    success: true,
    data: {
      ...post,
      commentList: postComments
    }
  })
})

router.post('/', sensitiveContentFilter, (req: Request, res: Response): void => {
  const { 
    userName, 
    title, 
    content, 
    category, 
    region, 
    tags,
    isEmergency 
  } = req.body as {
    userName: string
    title: string
    content: string
    category: 'experience' | 'discussion' | 'question' | 'regional'
    region?: string
    tags: string[]
    isEmergency?: boolean
  }

  if (!userName || !title || !content || !category) {
    res.status(400).json({
      success: false,
      error: '请填写完整的帖子信息'
    })
    return
  }

  const newPost: CommunityPost = {
    id: `cp${Date.now()}`,
    userId: `u${Date.now()}`,
    userName,
    userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
    title,
    content,
    category,
    region,
    tags: tags || [],
    likes: 0,
    comments: 0,
    createdAt: new Date().toLocaleString('zh-CN'),
    isEmergency: isEmergency || false
  }

  communityPosts.unshift(newPost)

  res.status(201).json({
    success: true,
    data: newPost
  })
})

router.post('/:id/like', (req: Request, res: Response): void => {
  const { id } = req.params
  const post = communityPosts.find(p => p.id === id)

  if (!post) {
    res.status(404).json({
      success: false,
      error: '帖子不存在'
    })
    return
  }

  post.likes += 1

  res.status(200).json({
    success: true,
    data: {
      likes: post.likes
    }
  })
})

router.get('/:id/comments', (req: Request, res: Response): void => {
  const { id } = req.params
  const post = communityPosts.find(p => p.id === id)

  if (!post) {
    res.status(404).json({
      success: false,
      error: '帖子不存在'
    })
    return
  }

  const postComments = comments.filter(c => c.postId === id)

  res.status(200).json({
    success: true,
    data: postComments
  })
})

router.post('/:id/comments', sensitiveContentFilter, (req: Request, res: Response): void => {
  const { id } = req.params
  const { userName, content } = req.body as {
    userName: string
    content: string
  }

  const post = communityPosts.find(p => p.id === id)

  if (!post) {
    res.status(404).json({
      success: false,
      error: '帖子不存在'
    })
    return
  }

  if (!userName || !content) {
    res.status(400).json({
      success: false,
      error: '请填写完整的评论信息'
    })
    return
  }

  const newComment: Comment = {
    id: `cm${Date.now()}`,
    postId: id,
    userId: `u${Date.now()}`,
    userName,
    userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
    content,
    likes: 0,
    createdAt: new Date().toLocaleString('zh-CN')
  }

  comments.unshift(newComment)
  post.comments += 1

  res.status(201).json({
    success: true,
    data: newComment
  })
})

router.post('/comment/:id/like', (req: Request, res: Response): void => {
  const { id } = req.params
  const comment = comments.find(c => c.id === id)

  if (!comment) {
    res.status(404).json({
      success: false,
      error: '评论不存在'
    })
    return
  }

  comment.likes += 1

  res.status(200).json({
    success: true,
    data: {
      likes: comment.likes
    }
  })
})

export default router
