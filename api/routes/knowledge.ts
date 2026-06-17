import express, { type Request, type Response } from 'express'
import { knowledgeItems } from '../data/mockData.js'
import type { KnowledgeItem, DifficultyLevel, SurvivalScenario } from '../../src/types'

const router = express.Router()

router.get('/', (req: Request, res: Response): void => {
  const { level, scenario, category, search } = req.query

  let items = [...knowledgeItems]

  if (level && typeof level === 'string') {
    items = items.filter(item => item.level === level as DifficultyLevel)
  }

  if (scenario && typeof scenario === 'string') {
    items = items.filter(item => item.scenario === scenario as SurvivalScenario)
  }

  if (category && typeof category === 'string') {
    items = items.filter(item => item.category === category)
  }

  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase()
    items = items.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.content.toLowerCase().includes(searchLower)
    )
  }

  res.status(200).json({
    success: true,
    data: items
  })
})

router.get('/categories', (req: Request, res: Response): void => {
  const categories = [...new Set(knowledgeItems.map(item => item.category))]
  
  res.status(200).json({
    success: true,
    data: categories
  })
})

router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params
  const item = knowledgeItems.find(k => k.id === id)

  if (!item) {
    res.status(404).json({
      success: false,
      error: '知识点不存在'
    })
    return
  }

  res.status(200).json({
    success: true,
    data: item
  })
})

router.post('/:id/quiz/submit', (req: Request, res: Response): void => {
  const { id } = req.params
  const { answers } = req.body as { answers: number[] }

  const item = knowledgeItems.find(k => k.id === id)

  if (!item) {
    res.status(404).json({
      success: false,
      error: '知识点不存在'
    })
    return
  }

  if (!item.quiz) {
    res.status(400).json({
      success: false,
      error: '该知识点没有测试题'
    })
    return
  }

  if (!answers || !Array.isArray(answers)) {
    res.status(400).json({
      success: false,
      error: '请提供答案'
    })
    return
  }

  if (answers.length !== item.quiz.questions.length) {
    res.status(400).json({
      success: false,
      error: '答案数量不匹配'
    })
    return
  }

  let correctCount = 0
  const results = item.quiz.questions.map((question, index) => {
    const isCorrect = answers[index] === question.correctAnswerIndex
    if (isCorrect) correctCount++
    return {
      questionId: question.id,
      isCorrect,
      correctAnswerIndex: question.correctAnswerIndex,
      userAnswerIndex: answers[index],
      explanation: question.explanation
    }
  })

  const score = Math.round((correctCount / item.quiz.questions.length) * 100)
  const passed = score >= item.quiz.passingScore

  res.status(200).json({
    success: true,
    data: {
      score,
      passed,
      passingScore: item.quiz.passingScore,
      correctCount,
      totalQuestions: item.quiz.questions.length,
      results
    }
  })
})

export default router
