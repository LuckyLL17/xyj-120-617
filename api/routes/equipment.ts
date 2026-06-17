import express, { type Request, type Response } from 'express'
import { equipments, equipmentCategories } from '../data/mockData.js'
import type { Equipment, EquipmentReview } from '../../src/types'

const router = express.Router()

router.get('/categories', (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: equipmentCategories
  })
})

router.get('/', (req: Request, res: Response): void => {
  const { categoryId, search, minPrice, maxPrice, minRating } = req.query

  let items = [...equipments]

  if (categoryId && typeof categoryId === 'string') {
    items = items.filter(item => item.categoryId === categoryId)
  }

  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase()
    items = items.filter(item => 
      item.name.toLowerCase().includes(searchLower) ||
      item.brand.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower)
    )
  }

  if (minPrice && !isNaN(Number(minPrice))) {
    items = items.filter(item => item.price >= Number(minPrice))
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    items = items.filter(item => item.price <= Number(maxPrice))
  }

  if (minRating && !isNaN(Number(minRating))) {
    items = items.filter(item => item.rating >= Number(minRating))
  }

  res.status(200).json({
    success: true,
    data: items
  })
})

router.get('/compare', (req: Request, res: Response): void => {
  const { ids } = req.query

  if (!ids || typeof ids !== 'string') {
    res.status(400).json({
      success: false,
      error: '请提供要对比的装备ID，用逗号分隔'
    })
    return
  }

  const idList = ids.split(',')
  const items = equipments.filter(item => idList.includes(item.id))

  if (items.length < 2) {
    res.status(400).json({
      success: false,
      error: '请至少选择2个装备进行对比'
    })
    return
  }

  const comparison = {
    items,
    commonFields: [
      { field: 'price', label: '价格', type: 'number' },
      { field: 'rating', label: '综合评分', type: 'number' },
      { field: 'valueScore', label: '性价比', type: 'number' },
      { field: 'pros', label: '优点', type: 'array' },
      { field: 'cons', label: '缺点', type: 'array' },
      { field: 'scenarios', label: '适用场景', type: 'array' }
    ]
  }

  res.status(200).json({
    success: true,
    data: comparison
  })
})

router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params
  const item = equipments.find(e => e.id === id)

  if (!item) {
    res.status(404).json({
      success: false,
      error: '装备不存在'
    })
    return
  }

  res.status(200).json({
    success: true,
    data: item
  })
})

router.get('/:id/reviews', (req: Request, res: Response): void => {
  const { id } = req.params
  const item = equipments.find(e => e.id === id)

  if (!item) {
    res.status(404).json({
      success: false,
      error: '装备不存在'
    })
    return
  }

  res.status(200).json({
    success: true,
    data: item.reviews
  })
})

router.post('/:id/reviews', (req: Request, res: Response): void => {
  const { id } = req.params
  const { userName, rating, title, content, usageDuration } = req.body as {
    userName: string
    rating: number
    title: string
    content: string
    usageDuration: string
  }

  const item = equipments.find(e => e.id === id)

  if (!item) {
    res.status(404).json({
      success: false,
      error: '装备不存在'
    })
    return
  }

  if (!userName || !rating || !title || !content) {
    res.status(400).json({
      success: false,
      error: '请填写完整的评价信息'
    })
    return
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({
      success: false,
      error: '评分必须在1-5之间'
    })
    return
  }

  const newReview: EquipmentReview = {
    id: `er${Date.now()}`,
    equipmentId: id,
    userId: `u${Date.now()}`,
    userName,
    rating,
    title,
    content,
    usageDuration: usageDuration || '未知',
    createdAt: new Date().toISOString().split('T')[0],
    verified: false
  }

  item.reviews.unshift(newReview)

  res.status(201).json({
    success: true,
    data: newReview
  })
})

export default router
