import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, XCircle, ChevronRight, AlertCircle, Play } from 'lucide-react'
import { api } from '@/lib/api'
import type { KnowledgeItem } from '@/types'
import { cn } from '@/lib/utils'

const levelColors: Record<string, string> = {
  beginner: 'bg-green-600',
  intermediate: 'bg-yellow-600',
  advanced: 'bg-red-600'
}

const levelNames: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级'
}

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

export default function KnowledgeDetail() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<KnowledgeItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQuiz, setShowQuiz] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const [quizResult, setQuizResult] = useState<{
    score: number
    passed: boolean
    correctCount: number
    totalQuestions: number
    results: { questionId: string; isCorrect: boolean; correctAnswerIndex: number; explanation: string }[]
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      loadKnowledge()
    }
  }, [id])

  async function loadKnowledge() {
    try {
      const data = await api.knowledge.get(id!)
      setItem(data as KnowledgeItem)
      if ((data as KnowledgeItem).quiz) {
        setAnswers(new Array((data as KnowledgeItem).quiz!.questions.length).fill(-1))
      }
    } catch (error) {
      console.error('Failed to load knowledge item:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleAnswerChange(questionIndex: number, answerIndex: number) {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  async function submitQuiz() {
    if (!item?.quiz || submitting) return
    
    const unanswered = answers.findIndex(a => a === -1)
    if (unanswered !== -1) {
      alert(`请完成第 ${unanswered + 1} 题`)
      return
    }

    setSubmitting(true)
    try {
      const result = await api.knowledge.submitQuiz(id!, answers)
      setQuizResult(result as typeof quizResult)
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      alert('提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  function resetQuiz() {
    if (item?.quiz) {
      setAnswers(new Array(item.quiz.questions.length).fill(-1))
    }
    setQuizResult(null)
  }

  function renderContent(content: string) {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-orange-400">{line.replace('## ', '')}</h2>
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-slate-200">{line.replace('### ', '')}</h3>
      }
      if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*：(.+)/)
        if (match) {
          return (
            <li key={index} className="ml-6 mb-2">
              <strong className="text-orange-300">{match[1]}：</strong>
              <span className="text-slate-300">{match[2]}</span>
            </li>
          )
        }
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="ml-6 mb-2 list-disc text-slate-300">
            {line.replace('- ', '')}
          </li>
        )
      }
      if (line.trim() === '') {
        return <br key={index} />
      }
      return <p key={index} className="mb-3 text-slate-300 leading-relaxed">{line}</p>
    })
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-400">加载中...</div>
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">知识点不存在</p>
        <Link to="/knowledge" className="text-orange-400 hover:text-orange-300">
          返回知识列表
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        to="/knowledge"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回知识列表
      </Link>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="relative aspect-video">
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-3 py-1 ${levelColors[item.level]} text-white text-sm rounded-full font-medium`}>
                {levelNames[item.level]}
              </span>
              <span className="px-3 py-1 bg-slate-800/80 text-white text-sm rounded-full">
                {scenarioIcons[item.scenario]} {scenarioNames[item.scenario]}
              </span>
              <span className="px-3 py-1 bg-slate-800/80 text-white text-sm rounded-full">
                {item.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{item.title}</h1>
            <div className="flex items-center gap-4 text-slate-300">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {item.estimatedTime}分钟学习
              </span>
              {item.quiz && (
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  含 {item.quiz.questions.length} 道自测题
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {item.videoUrl && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center gap-2">
            <Play className="w-5 h-5 text-red-500" />
            <span className="font-medium">视频演示</span>
          </div>
          <div className="aspect-video bg-slate-900 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>视频演示区域（示例视频）</p>
              <p className="text-sm mt-2">实际使用时嵌入真实视频</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 md:p-8">
        <p className="text-lg text-slate-300 mb-6 leading-relaxed">{item.description}</p>
        <div className="prose prose-invert max-w-none">
          {renderContent(item.content)}
        </div>
      </div>

      {item.quiz && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  知识自测
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  共 {item.quiz.questions.length} 题，及格分数 {item.quiz.passingScore} 分
                </p>
              </div>
              {!showQuiz && (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
                >
                  开始测试
                </button>
              )}
            </div>
          </div>

          {showQuiz && !quizResult && (
            <div className="p-6 space-y-8">
              {item.quiz.questions.map((question, qIndex) => (
                <div key={question.id} className="space-y-3">
                  <h3 className="text-lg font-medium flex items-start gap-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm">
                      {qIndex + 1}
                    </span>
                    <span>{question.question}</span>
                  </h3>
                  <div className="ml-10 grid gap-2">
                    {question.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        onClick={() => handleAnswerChange(qIndex, oIndex)}
                        className={cn(
                          'p-4 rounded-lg border text-left transition-all text-sm',
                          answers[qIndex] === oIndex
                            ? 'border-orange-500 bg-orange-600/20 text-orange-200'
                            : 'border-slate-600 hover:border-slate-500 text-slate-300'
                        )}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + oIndex)}.</span>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowQuiz(false)}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  稍后再测
                </button>
                <button
                  onClick={submitQuiz}
                  disabled={submitting}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50"
                >
                  {submitting ? '提交中...' : '提交答案'}
                </button>
              </div>
            </div>
          )}

          {quizResult && (
            <div className="p-6 space-y-6">
              <div className={cn(
                'p-6 rounded-xl text-center',
                quizResult.passed ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
              )}>
                {quizResult.passed ? (
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                )}
                <div className="text-4xl font-bold mb-2">{quizResult.score}分</div>
                <p className={cn('text-lg', quizResult.passed ? 'text-green-300' : 'text-red-300')}>
                  {quizResult.passed ? '恭喜你，通过测试！' : '很遗憾，没有及格'}
                </p>
                <p className="text-slate-400 mt-2">
                  答对 {quizResult.correctCount} / {quizResult.totalQuestions} 题
                </p>
              </div>

              <div className="space-y-4">
                {item.quiz.questions.map((question, qIndex) => {
                  const result = quizResult.results[qIndex]
                  return (
                    <div 
                      key={question.id} 
                      className={cn(
                        'p-4 rounded-lg border',
                        result.isCorrect ? 'border-green-700 bg-green-900/20' : 'border-red-700 bg-red-900/20'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {result.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                        )}
                        <div>
                          <p className="font-medium">{qIndex + 1}. {question.question}</p>
                          <p className="text-sm text-slate-400 mt-2">
                            你的答案：<span className={result.isCorrect ? 'text-green-400' : 'text-red-400'}>
                              {String.fromCharCode(65 + answers[qIndex])}. {question.options[answers[qIndex]]}
                            </span>
                          </p>
                          {!result.isCorrect && (
                            <p className="text-sm text-green-400 mt-1">
                              正确答案：{String.fromCharCode(65 + result.correctAnswerIndex)}. {question.options[result.correctAnswerIndex]}
                            </p>
                          )}
                          <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                            <div className="flex items-center gap-1 text-sm text-slate-400 mb-1">
                              <AlertCircle className="w-4 h-4" />
                              解析
                            </div>
                            <p className="text-sm text-slate-300">{result.explanation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
                {!quizResult.passed && (
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    重新测试
                  </button>
                )}
                <Link
                  to="/knowledge"
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors inline-flex items-center gap-1"
                >
                  继续学习 <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
