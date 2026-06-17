import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Gamepad2,
  Clock,
  Target,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  RefreshCw,
  Trophy,
  Star,
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  BookOpen
} from 'lucide-react'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type {
  SimulatorScenario,
  SimulatorQuestion,
  SimulatorResult
} from '@/types'

type GameState = 'select' | 'playing' | 'result'

const scenarioIcons: Record<string, string> = {
  urban: '🏙️',
  wilderness: '🏕️',
  vehicle: '🚗',
  home: '🏠',
  disaster: '⚠️',
  medical: '🏥'
}

const scenarioNames: Record<string, string> = {
  urban: '城市',
  wilderness: '野外',
  vehicle: '车辆',
  home: '家庭',
  disaster: '灾难',
  medical: '医疗'
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-600',
  intermediate: 'bg-yellow-600',
  advanced: 'bg-red-600'
}

const difficultyNames: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级'
}

const gradeBgColors: Record<string, string> = {
  S: 'from-yellow-600 to-orange-600',
  A: 'from-green-600 to-emerald-600',
  B: 'from-blue-600 to-cyan-600',
  C: 'from-orange-600 to-amber-600',
  D: 'from-red-600 to-rose-600',
  F: 'from-red-800 to-red-900'
}

interface Answer {
  questionId: string
  optionId: string
}

export default function Simulator() {
  const [gameState, setGameState] = useState<GameState>('select')
  const [scenarios, setScenarios] = useState<SimulatorScenario[]>([])
  const [selectedScenario, setSelectedScenario] = useState<SimulatorScenario | null>(null)
  const [questions, setQuestions] = useState<SimulatorQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [result, setResult] = useState<SimulatorResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [expandedAnswer, setExpandedAnswer] = useState<number | null>(null)
  const [filterScenario, setFilterScenario] = useState<string>('')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('')

  const loadScenarios = useCallback(async () => {
    try {
      setLoading(true)
      const params: Record<string, string> = {}
      if (filterScenario) params.scenario = filterScenario
      if (filterDifficulty) params.difficulty = filterDifficulty
      const data = await api.simulator.scenarios(
        Object.keys(params).length > 0 ? params : undefined
      )
      setScenarios(data as SimulatorScenario[])
    } catch (error) {
      console.error('Failed to load scenarios:', error)
    } finally {
      setLoading(false)
    }
  }, [filterScenario, filterDifficulty])

  useEffect(() => {
    loadScenarios()
  }, [loadScenarios])

  async function startScenario(scenario: SimulatorScenario) {
    try {
      setLoading(true)
      const data = await api.simulator.getQuestions(scenario.id)
      setQuestions(data as SimulatorQuestion[])
      setSelectedScenario(scenario)
      setCurrentQuestionIndex(0)
      setAnswers([])
      setSelectedOptionId(null)
      setShowHint(false)
      setGameState('playing')
    } catch (error) {
      console.error('Failed to load questions:', error)
    } finally {
      setLoading(false)
    }
  }

  function selectOption(optionId: string) {
    setSelectedOptionId(optionId)
  }

  function nextQuestion() {
    if (!selectedOptionId || !currentQuestion) return

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      optionId: selectedOptionId
    }
    const newAnswers = [...answers, newAnswer]
    setAnswers(newAnswers)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOptionId(null)
      setShowHint(false)
    } else {
      submitAnswers(newAnswers)
    }
  }

  async function submitAnswers(finalAnswers: Answer[]) {
    if (!selectedScenario) return

    try {
      setSubmitting(true)
      const data = await api.simulator.submit({
        scenarioId: selectedScenario.id,
        answers: finalAnswers
      })
      setResult(data as SimulatorResult)
      setGameState('result')
    } catch (error) {
      console.error('Failed to submit answers:', error)
    } finally {
      setSubmitting(false)
    }
  }

  function resetGame() {
    setGameState('select')
    setSelectedScenario(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setAnswers([])
    setSelectedOptionId(null)
    setShowHint(false)
    setResult(null)
    setExpandedAnswer(null)
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  if (loading && gameState === 'select') {
    return (
      <div className="text-center py-20 text-slate-400">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>加载中...</p>
      </div>
    )
  }

  if (gameState === 'select') {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600/20 border border-orange-600/30 rounded-full mb-6">
            <Gamepad2 className="w-5 h-5 text-orange-400" />
            <span className="text-orange-300 font-medium">生存模拟器</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
              考验你的生存智慧
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            选择一个生存场景，在一系列紧急情况中做出正确决策
            <br className="hidden md:block" />
            测试你的生存技能，获取专业评估和改进建议
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">场景类型:</span>
              <select
                value={filterScenario}
                onChange={(e) => setFilterScenario(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">全部</option>
                {Object.entries(scenarioNames).map(([key, name]) => (
                  <option key={key} value={key}>
                    {scenarioIcons[key]} {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">难度:</span>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">全部</option>
                {Object.entries(difficultyNames).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="group bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-orange-500 transition-all cursor-pointer"
              onClick={() => startScenario(scenario)}
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={scenario.imageUrl}
                  alt={scenario.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{scenario.icon}</span>
                    <span className={`px-2 py-0.5 ${difficultyColors[scenario.difficulty]} text-white text-xs rounded-full`}>
                      {difficultyNames[scenario.difficulty]}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-700/80 text-slate-300 text-xs rounded-full">
                      {scenarioNames[scenario.scenario]}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{scenario.name}</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                  {scenario.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {scenario.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {scenario.totalQuestions} 道题
                    </span>
                  </div>
                  <span className="text-orange-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    开始挑战 <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {scenarios.length === 0 && !loading && (
          <div className="text-center py-12 text-slate-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <p>没有找到符合条件的场景</p>
          </div>
        )}
      </div>
    )
  }

  if (gameState === 'playing' && currentQuestion && selectedScenario) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={resetGame}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回选择
          </button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedScenario.icon}</span>
            <div>
              <h2 className="font-semibold">{selectedScenario.name}</h2>
              <p className="text-sm text-slate-400">
                第 {currentQuestionIndex + 1} / {questions.length} 题
              </p>
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 border-b border-slate-700">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-600/20 rounded-lg flex-shrink-0">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-orange-300">情境描述</h3>
                <p className="text-slate-300 leading-relaxed">
                  {currentQuestion.situation}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-xl font-bold mb-6">
              {currentQuestion.question}
            </h4>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => selectOption(option.id)}
                  className={cn(
                    'w-full text-left p-4 rounded-xl border-2 transition-all',
                    selectedOptionId === option.id
                      ? 'border-orange-500 bg-orange-600/20'
                      : 'border-slate-600 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                      selectedOptionId === option.id
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-slate-500'
                    )}>
                      {selectedOptionId === option.id && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-slate-200">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {currentQuestion.hint && (
              <div className="mt-6">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
                >
                  <HelpCircle className="w-4 h-4" />
                  {showHint ? '隐藏提示' : '查看提示'}
                </button>
                {showHint && (
                  <div className="mt-3 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-yellow-200 text-sm">{currentQuestion.hint}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={nextQuestion}
            disabled={!selectedOptionId || submitting}
            className={cn(
              'px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2',
              selectedOptionId && !submitting
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-500 hover:to-red-500'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            )}
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                提交中...
              </>
            ) : currentQuestionIndex < questions.length - 1 ? (
              <>
                下一题 <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                提交答案 <CheckCircle className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  if (gameState === 'result' && result && selectedScenario) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600/20 border border-orange-600/30 rounded-full mb-6">
            <Trophy className="w-5 h-5 text-orange-400" />
            <span className="text-orange-300 font-medium">挑战完成</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {result.scenarioName}
          </h1>
          <p className="text-slate-400">生存模拟器评分结果</p>
        </div>

        <div className={`bg-gradient-to-br ${gradeBgColors[result.grade]} rounded-2xl p-8 text-center`}>
          <div className="text-8xl font-bold mb-4 text-white">
            {result.grade}
          </div>
          <div className="text-2xl font-semibold text-white mb-2">
            {result.survivalRating}
          </div>
          <div className="text-white/80 text-lg mb-6">
            得分: {result.totalScore} / {result.maxScore} ({result.percentage}%)
          </div>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-8 h-8',
                  result.percentage >= star * 20
                    ? 'text-yellow-300 fill-yellow-300'
                    : 'text-white/30'
                )}
              />
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            综合评估
          </h3>
          <p className="text-slate-300 leading-relaxed">
            {result.overallFeedback}
          </p>
        </div>

        {result.improvementTips.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              改进建议
            </h3>
            <ul className="space-y-3">
              {result.improvementTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-600/20 text-yellow-400 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-slate-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              答题详情
            </h3>
          </div>
          <div className="divide-y divide-slate-700">
            {result.answers.map((answer, index) => {
              const isCorrect = answer.score === answer.maxScore
              const isExpanded = expandedAnswer === index

              return (
                <div key={answer.questionId}>
                  <button
                    onClick={() => setExpandedAnswer(isExpanded ? null : index)}
                    className="w-full p-6 flex items-center justify-between hover:bg-slate-700/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                        isCorrect ? 'bg-green-600/20' : 'bg-red-600/20'
                      )}>
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 mb-1">第 {index + 1} 题</p>
                        <p className="font-medium line-clamp-1">
                          {questions[index]?.question}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'text-sm font-medium',
                        isCorrect ? 'text-green-400' : 'text-red-400'
                      )}>
                        {answer.score} / {answer.maxScore}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-4">
                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <p className="text-sm text-slate-400 mb-2">情境描述</p>
                        <p className="text-slate-300 text-sm">
                          {questions[index]?.situation}
                        </p>
                      </div>

                      <div className="grid gap-3">
                        <div className={cn(
                          'p-4 rounded-lg border-2',
                          !isCorrect
                            ? 'border-red-500 bg-red-600/10'
                            : 'border-green-500 bg-green-600/10'
                        )}>
                          <p className="text-sm text-slate-400 mb-1">
                            {isCorrect ? '✓ 你的选择（正确）' : '✗ 你的选择'}
                          </p>
                          <p className="text-slate-200">{answer.userChoice}</p>
                        </div>

                        {!isCorrect && (
                          <div className="p-4 rounded-lg border-2 border-green-500 bg-green-600/10">
                            <p className="text-sm text-slate-400 mb-1">✓ 最佳选择</p>
                            <p className="text-slate-200">{answer.bestChoice}</p>
                          </div>
                        )}
                      </div>

                      <div className="bg-slate-700/30 rounded-lg p-4">
                        <p className="text-sm text-orange-400 mb-2">反馈</p>
                        <p className="text-slate-300 text-sm mb-3">{answer.feedback}</p>
                        <p className="text-sm text-slate-400 mb-1">可能的后果:</p>
                        <p className="text-slate-300 text-sm mb-3">{answer.consequences}</p>
                        {answer.improvement && (
                          <>
                            <p className="text-sm text-yellow-400 mb-1">改进建议:</p>
                            <p className="text-slate-300 text-sm">{answer.improvement}</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => startScenario(selectedScenario)}
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-red-500 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            再次挑战
          </button>
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
          >
            <Gamepad2 className="w-4 h-4" />
            选择其他场景
          </button>
          <Link
            to="/knowledge"
            className="px-8 py-3 border border-slate-600 text-slate-200 font-semibold rounded-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            学习生存知识
          </Link>
        </div>
      </div>
    )
  }

  return null
}
