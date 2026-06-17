import express, { type Request, type Response } from 'express'
import { checklistCategories, checklistTemplates } from '../data/mockData.js'
import type { ChecklistTemplate } from '../../src/types'

const router = express.Router()

router.get('/categories', (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: checklistCategories
  })
})

router.get('/', (req: Request, res: Response): void => {
  const { categoryId } = req.query

  let templates = [...checklistTemplates]

  if (categoryId && typeof categoryId === 'string') {
    templates = templates.filter(t => t.categoryId === categoryId)
  }

  res.status(200).json({
    success: true,
    data: templates
  })
})

router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params
  const template = checklistTemplates.find(t => t.id === id)

  if (!template) {
    res.status(404).json({
      success: false,
      error: '清单模板不存在'
    })
    return
  }

  res.status(200).json({
    success: true,
    data: template
  })
})

router.post('/generate', (req: Request, res: Response): void => {
  const { scenario, duration, peopleCount } = req.body as {
    scenario: string
    duration: string
    peopleCount: number
  }

  if (!scenario || !duration) {
    res.status(400).json({
      success: false,
      error: '请提供场景和时长信息'
    })
    return
  }

  const baseTemplate = checklistTemplates.find(t => 
    t.name.includes(duration) || t.duration === duration
  ) || checklistTemplates[0]

  const count = peopleCount || 1
  const generatedItems = baseTemplate.items.map(item => ({
    ...item,
    quantity: adjustQuantity(item.quantity, count),
    priority: item.priority
  }))

  const generatedChecklist: ChecklistTemplate = {
    ...baseTemplate,
    id: `gen_${Date.now()}`,
    name: `自定义${scenario}${duration}生存清单`,
    description: `为${count}人${duration}${scenario}生成的生存物资清单`,
    items: generatedItems
  }

  res.status(200).json({
    success: true,
    data: generatedChecklist
  })
})

function adjustQuantity(quantity: string, peopleCount: number): string {
  if (quantity.includes('升/人')) {
    const match = quantity.match(/(\d+)/)
    if (match) {
      const liters = parseInt(match[1]) * peopleCount
      return `${liters}升`
    }
  }
  
  if (quantity.includes('个/人') || quantity.includes('件/人') || quantity.includes('双/人')) {
    const match = quantity.match(/(\d+)/)
    if (match) {
      const num = parseInt(match[1]) * peopleCount
      return `${num}${quantity.replace(/\d+.*\/人/, '')}`
    }
  }
  
  if (quantity.includes('套/人')) {
    return `${peopleCount}套`
  }

  return quantity
}

router.post('/export', (req: Request, res: Response): void => {
  const { templateId } = req.body as { templateId: string }

  const template = checklistTemplates.find(t => t.id === templateId)

  if (!template) {
    res.status(404).json({
      success: false,
      error: '清单模板不存在'
    })
    return
  }

  const exportData = {
    name: template.name,
    description: template.description,
    duration: template.duration,
    generatedAt: new Date().toISOString(),
    items: template.items.map(item => ({
      名称: item.name,
      描述: item.description,
      优先级: getPriorityLabel(item.priority),
      数量: item.quantity,
      备注: item.notes || ''
    }))
  }

  res.status(200).json({
    success: true,
    data: exportData,
    format: 'json'
  })
})

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    critical: '★ 危急',
    high: '● 高优先级',
    medium: '○ 中优先级',
    low: '◇ 低优先级'
  }
  return labels[priority] || priority
}

export default router
