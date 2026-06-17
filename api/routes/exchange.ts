import express, { type Request, type Response } from 'express'
import { exchangeItems, exchangeRequests } from '../data/mockData.js'
import { sensitiveContentFilter } from '../middleware/sensitiveFilter.js'
import type { ExchangeItem, ExchangeRequest, ExchangeItemType, ExchangeStatus } from '../../src/types'

const router = express.Router()

router.get('/', (req: Request, res: Response): void => {
  const { type, category, location, search, sortBy, status } = req.query

  let items = [...exchangeItems]

  if (type && typeof type === 'string') {
    items = items.filter(item => item.type === type)
  }

  if (category && typeof category === 'string') {
    items = items.filter(item => item.category === category)
  }

  if (location && typeof location === 'string') {
    items = items.filter(item => item.location === location)
  }

  if (status && typeof status === 'string') {
    items = items.filter(item => item.status === status)
  }

  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase()
    items = items.filter(item =>
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.tags.some(t => t.toLowerCase().includes(searchLower))
    )
  }

  if (sortBy && typeof sortBy === 'string') {
    switch (sortBy) {
      case 'latest':
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'popular':
        items.sort((a, b) => b.views - a.views)
        break
      case 'requests':
        items.sort((a, b) => b.requests - a.requests)
        break
    }
  }

  res.status(200).json({
    success: true,
    data: items
  })
})

router.get('/categories', (req: Request, res: Response): void => {
  const { type } = req.query
  let items = [...exchangeItems]

  if (type && typeof type === 'string') {
    items = items.filter(item => item.type === type)
  }

  const categories = [...new Set(items.map(item => item.category))]

  res.status(200).json({
    success: true,
    data: categories
  })
})

router.get('/locations', (req: Request, res: Response): void => {
  const locations = [...new Set(exchangeItems.filter(item => item.location).map(item => item.location as string))]

  res.status(200).json({
    success: true,
    data: locations
  })
})

router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params
  const item = exchangeItems.find(i => i.id === id)

  if (!item) {
    res.status(404).json({
      success: false,
      error: '交换物品不存在'
    })
    return
  }

  item.views += 1

  const itemRequests = exchangeRequests.filter(r => r.exchangeItemId === id)

  res.status(200).json({
    success: true,
    data: {
      ...item,
      requestList: itemRequests
    }
  })
})

router.post('/', sensitiveContentFilter, (req: Request, res: Response): void => {
  const {
    type,
    userName,
    title,
    description,
    category,
    images,
    condition,
    experienceLevel,
    location,
    exchangePreference,
    availability,
    tags
  } = req.body as {
    type: ExchangeItemType
    userName: string
    title: string
    description: string
    category: string
    images: string[]
    condition?: 'new' | 'excellent' | 'good' | 'fair' | 'poor'
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced'
    location?: string
    exchangePreference: string
    availability: string
    tags: string[]
  }

  if (!type || !userName || !title || !description || !category || !exchangePreference || !availability) {
    res.status(400).json({
      success: false,
      error: '请填写完整的交换信息'
    })
    return
  }

  const newItem: ExchangeItem = {
    id: `ex${Date.now()}`,
    type,
    userId: `u${Date.now()}`,
    userName,
    userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
    title,
    description,
    category,
    images: images || [],
    condition,
    experienceLevel,
    location,
    exchangePreference,
    availability,
    tags: tags || [],
    views: 0,
    requests: 0,
    status: 'open',
    createdAt: new Date().toLocaleString('zh-CN')
  }

  exchangeItems.unshift(newItem)

  res.status(201).json({
    success: true,
    data: newItem
  })
})

router.post('/:id/request', sensitiveContentFilter, (req: Request, res: Response): void => {
  const { id } = req.params
  const {
    requesterName,
    contactInfo,
    message,
    offerDetails
  } = req.body as {
    requesterName: string
    contactInfo: string
    message: string
    offerDetails: string
  }

  const item = exchangeItems.find(i => i.id === id)

  if (!item) {
    res.status(404).json({
      success: false,
      error: '交换物品不存在'
    })
    return
  }

  if (item.status !== 'open') {
    res.status(400).json({
      success: false,
      error: '该交换已关闭或正在进行中'
    })
    return
  }

  if (!requesterName || !contactInfo || !message || !offerDetails) {
    res.status(400).json({
      success: false,
      error: '请填写完整的交换请求信息'
    })
    return
  }

  const newRequest: ExchangeRequest = {
    id: `er${Date.now()}`,
    exchangeItemId: id,
    requesterId: `u${Date.now()}`,
    requesterName,
    requesterAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
    contactInfo,
    message,
    offerDetails,
    status: 'pending',
    createdAt: new Date().toLocaleString('zh-CN')
  }

  exchangeRequests.unshift(newRequest)
  item.requests += 1

  res.status(201).json({
    success: true,
    data: newRequest
  })
})

router.get('/:id/requests', (req: Request, res: Response): void => {
  const { id } = req.params
  const item = exchangeItems.find(i => i.id === id)

  if (!item) {
    res.status(404).json({
      success: false,
      error: '交换物品不存在'
    })
    return
  }

  const itemRequests = exchangeRequests.filter(r => r.exchangeItemId === id)

  res.status(200).json({
    success: true,
    data: itemRequests
  })
})

router.put('/:id/status', (req: Request, res: Response): void => {
  const { id } = req.params
  const { status } = req.body as { status: ExchangeStatus }

  const item = exchangeItems.find(i => i.id === id)

  if (!item) {
    res.status(404).json({
      success: false,
      error: '交换物品不存在'
    })
    return
  }

  item.status = status

  res.status(200).json({
    success: true,
    data: { status }
  })
})

router.put('/requests/:requestId/status', (req: Request, res: Response): void => {
  const { requestId } = req.params
  const { status } = req.body as { status: 'pending' | 'accepted' | 'rejected' | 'completed' }

  const request = exchangeRequests.find(r => r.id === requestId)

  if (!request) {
    res.status(404).json({
      success: false,
      error: '交换请求不存在'
    })
    return
  }

  request.status = status

  if (status === 'accepted') {
    const item = exchangeItems.find(i => i.id === request.exchangeItemId)
    if (item) {
      item.status = 'pending'
    }
  } else if (status === 'completed') {
    const item = exchangeItems.find(i => i.id === request.exchangeItemId)
    if (item) {
      item.status = 'completed'
    }
  }

  res.status(200).json({
    success: true,
    data: { status }
  })
})

export default router
