import express, { type Request, type Response } from 'express'
import { simulatorScenarios, simulatorQuestions } from '../data/mockData.js'
import type { 
  SimulatorSubmission,
  SimulatorResult,
  SimulatorAnswerResult
} from '../../src/types'

const router = express.Router()

router.get('/scenarios', (req: Request, res: Response): void => {
  const { scenario, difficulty } = req.query

  let scenarios = [...simulatorScenarios]

  if (scenario && typeof scenario === 'string') {
    scenarios = scenarios.filter(s => s.scenario === scenario)
  }

  if (difficulty && typeof difficulty === 'string') {
    scenarios = scenarios.filter(s => s.difficulty === difficulty)
  }

  res.status(200).json({
    success: true,
    data: scenarios
  })
})

router.get('/scenarios/:id', (req: Request, res: Response): void => {
  const { id } = req.params
  const scenario = simulatorScenarios.find(s => s.id === id)

  if (!scenario) {
    res.status(404).json({
      success: false,
      error: '场景不存在'
    })
    return
  }

  res.status(200).json({
    success: true,
    data: scenario
  })
})

router.get('/scenarios/:id/questions', (req: Request, res: Response): void => {
  const { id } = req.params
  const scenario = simulatorScenarios.find(s => s.id === id)

  if (!scenario) {
    res.status(404).json({
      success: false,
      error: '场景不存在'
    })
    return
  }

  const questions = simulatorQuestions
    .filter(q => q.scenarioId === id)
    .sort((a, b) => a.order - b.order)

  const questionsWithoutScores = questions.map(q => ({
    id: q.id,
    scenarioId: q.scenarioId,
    order: q.order,
    situation: q.situation,
    question: q.question,
    options: q.options.map(o => ({
      id: o.id,
      text: o.text
    })),
    hint: q.hint
  }))

  res.status(200).json({
    success: true,
    data: questionsWithoutScores
  })
})

router.post('/submit', (req: Request, res: Response): void => {
  const { scenarioId, answers } = req.body as SimulatorSubmission

  if (!scenarioId) {
    res.status(400).json({
      success: false,
      error: '请提供场景ID'
    })
    return
  }

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    res.status(400).json({
      success: false,
      error: '请提供答案'
    })
    return
  }

  const scenario = simulatorScenarios.find(s => s.id === scenarioId)
  if (!scenario) {
    res.status(404).json({
      success: false,
      error: '场景不存在'
    })
    return
  }

  const questions = simulatorQuestions
    .filter(q => q.scenarioId === scenarioId)
    .sort((a, b) => a.order - b.order)

  if (answers.length !== questions.length) {
    res.status(400).json({
      success: false,
      error: '答案数量不匹配'
    })
    return
  }

  let totalScore = 0
  let maxScore = 0
  const answerResults: SimulatorAnswerResult[] = []
  const wrongAnswers: SimulatorAnswerResult[] = []

  for (const question of questions) {
    const userAnswer = answers.find(a => a.questionId === question.id)
    if (!userAnswer) {
      res.status(400).json({
        success: false,
        error: `缺少问题 ${question.id} 的答案`
      })
      return
    }

    const userOption = question.options.find(o => o.id === userAnswer.optionId)
    if (!userOption) {
      res.status(400).json({
        success: false,
        error: `无效的选项ID ${userAnswer.optionId}`
      })
      return
    }

    const bestOption = question.options.reduce((best, current) => 
      current.score > best.score ? current : best
    , question.options[0])

    totalScore += userOption.score
    maxScore += bestOption.score

    const result: SimulatorAnswerResult = {
      questionId: question.id,
      userOptionId: userOption.id,
      bestOptionId: bestOption.id,
      score: userOption.score,
      maxScore: bestOption.score,
      feedback: userOption.feedback,
      improvement: userOption.improvement,
      userChoice: userOption.text,
      bestChoice: bestOption.text,
      consequences: userOption.consequences
    }

    answerResults.push(result)

    if (userOption.score < bestOption.score) {
      wrongAnswers.push(result)
    }
  }

  const percentage = Math.round((totalScore / maxScore) * 100)
  
  let grade: SimulatorResult['grade']
  let survivalRating: string
  let overallFeedback: string

  if (percentage >= 95) {
    grade = 'S'
    survivalRating = '传奇生存者'
    overallFeedback = '完美！你展现了卓越的生存技能和冷静的判断力，在任何极端环境下都能保持镇定，做出最优决策。你已经是一名真正的生存专家！'
  } else if (percentage >= 85) {
    grade = 'A'
    survivalRating = '精英生存者'
    overallFeedback = '非常优秀！你具备扎实的生存知识和良好的决策能力，大多数情况下都能做出正确选择。继续保持，你已经非常专业了。'
  } else if (percentage >= 70) {
    grade = 'B'
    survivalRating = '合格生存者'
    overallFeedback = '不错！你掌握了基本的生存技能，在常见情况下能够应对。但在一些复杂或紧急的场景中，还有提升空间。'
  } else if (percentage >= 60) {
    grade = 'C'
    survivalRating = '初级生存者'
    overallFeedback = '及格！你有一些基本的生存意识，但知识不够系统，决策也不够果断。建议多学习生存知识，多进行模拟练习。'
  } else if (percentage >= 40) {
    grade = 'D'
    survivalRating = '生存菜鸟'
    overallFeedback = '需要努力！你目前的生存知识严重不足，很多决策都是错误的，在真实环境中可能会面临危险。请立即开始系统学习生存知识。'
  } else {
    grade = 'F'
    survivalRating = '生存小白'
    overallFeedback = '危险！你目前的生存技能几乎为零，很多决策不仅错误，甚至会危及生命。强烈建议从基础生存知识开始学习，不要独自前往危险环境。'
  }

  const improvementTips: string[] = []
  
  if (wrongAnswers.length > 0) {
    const uniqueImprovements = new Set<string>()
    wrongAnswers.forEach(wa => {
      if (wa.improvement) {
        uniqueImprovements.add(wa.improvement)
      }
    })
    improvementTips.push(...Array.from(uniqueImprovements).slice(0, 5))
  }

  if (improvementTips.length === 0) {
    improvementTips.push('保持学习的热情，不断更新自己的生存知识库')
    improvementTips.push('尝试挑战更高难度的生存场景')
    improvementTips.push('将生存知识分享给身边的人，教学相长')
  }

  const result: SimulatorResult = {
    scenarioId,
    scenarioName: scenario.name,
    totalScore,
    maxScore,
    percentage,
    grade,
    survivalRating,
    answers: answerResults,
    overallFeedback,
    improvementTips
  }

  res.status(200).json({
    success: true,
    data: result
  })
})

export default router
