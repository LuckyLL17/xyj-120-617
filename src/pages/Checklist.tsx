import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Download, AlertTriangle, ChevronRight, Clock, Users, MapPin } from 'lucide-react'
import { api } from '@/lib/api'
import type { ChecklistTemplate, ChecklistCategory } from '@/types'
import { cn } from '@/lib/utils'

const priorityColors: Record<string, string> = {
  critical: 'bg-red-600',
  high: 'bg-orange-600',
  medium: 'bg-yellow-600',
  low: 'bg-slate-600'
}

const priorityLabels: Record<string, string> = {
  critical: '危急',
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级'
}

const priorityIcons: Record<string, string> = {
  critical: '★',
  high: '●',
  medium: '○',
  low: '◇'
}

const categoryIcons: Record<string, string> = {
  backpack: '🎒',
  tent: '⛺',
  car: '🚗',
  home: '🏠',
  clock: '⏰',
  'building-2': '🏢',
  footprints: '👣'
}

export default function Checklist() {
  const [categories, setCategories] = useState<ChecklistCategory[]>([])
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [showGenerator, setShowGenerator] = useState(false)
  const [generatorForm, setGeneratorForm] = useState({
    scenario: '野外生存',
    duration: '3天',
    peopleCount: 1
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadTemplates()
  }, [selectedCategory])

  async function loadData() {
    try {
      const [catsData, templatesData] = await Promise.all([
        api.checklist.categories(),
        api.checklist.list()
      ])
      setCategories(catsData as ChecklistCategory[])
      setTemplates(templatesData as ChecklistTemplate[])
    } catch (error) {
      console.error('Failed to load checklist data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadTemplates() {
    try {
      const params = selectedCategory ? { categoryId: selectedCategory } : undefined
      const data = await api.checklist.list(params)
      setTemplates(data as ChecklistTemplate[])
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  function toggleItem(itemId: string) {
    setCheckedItems(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  async function handleGenerate() {
    try {
      const data = await api.checklist.generate(generatorForm)
      setSelectedTemplate(data as ChecklistTemplate)
      setCheckedItems(new Set())
      setShowGenerator(false)
    } catch (error) {
      console.error('Failed to generate checklist:', error)
    }
  }

  async function handleExport(templateId: string) {
    try {
      const data = await api.checklist.export(templateId)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'survival-checklist.json'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export checklist:', error)
    }
  }

  function getProgress(template: ChecklistTemplate) {
    if (template.items.length === 0) return 0
    return Math.round((checkedItems.size / template.items.length) * 100)
  }

  const sortedItems = selectedTemplate?.items
    ? [...selectedTemplate.items].sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2, low: 3 }
        return order[a.priority] - order[b.priority]
      })
    : []

  if (loading) {
    return <div className="text-center py-12 text-slate-400">加载中...</div>
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <ClipboardList className="w-10 h-10 text-orange-500" />
          生存清单
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          按场景生成采购清单，每项标注优先级。
          再也不会漏买关键物资，为任何情况做好准备。
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => {
            setShowGenerator(true)
            setSelectedTemplate(null)
          }}
          className={cn(
            'px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2',
            showGenerator
              ? 'bg-orange-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
          )}
        >
          <Users className="w-5 h-5" />
          自定义生成清单
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)
              setSelectedTemplate(null)
              setShowGenerator(false)
            }}
            className={cn(
              'px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2',
              selectedCategory === cat.id && !showGenerator
                ? 'bg-orange-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            )}
          >
            <span>{categoryIcons[cat.icon] || '📋'}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {showGenerator && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            自定义生存清单
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">场景</label>
              <select
                value={generatorForm.scenario}
                onChange={(e) => setGeneratorForm({...generatorForm, scenario: e.target.value})}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
              >
                <option value="野外生存">野外生存</option>
                <option value="城市应急">城市应急</option>
                <option value="车辆应急">车辆应急</option>
                <option value="家庭储备">家庭储备</option>
                <option value="徒步旅行">徒步旅行</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">时长</label>
              <select
                value={generatorForm.duration}
                onChange={(e) => setGeneratorForm({...generatorForm, duration: e.target.value})}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
              >
                <option value="1天">1天</option>
                <option value="3天">3天</option>
                <option value="7天">7天</option>
                <option value="14天">14天</option>
                <option value="长期">长期</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">人数</label>
              <input
                type="number"
                min="1"
                max="10"
                value={generatorForm.peopleCount}
                onChange={(e) => setGeneratorForm({...generatorForm, peopleCount: parseInt(e.target.value) || 1})}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleGenerate}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
            >
              生成清单
            </button>
          </div>
        </div>
      )}

      {!selectedTemplate && !showGenerator && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-all cursor-pointer group"
              onClick={() => {
                setSelectedTemplate(template)
                setCheckedItems(new Set())
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl">
                    {categoryIcons[template.icon] || '📋'}
                  </div>
                  <span className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {template.duration}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                  {template.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4">{template.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{template.items.length} 项物品</span>
                  <span className="text-orange-400 flex items-center gap-1">
                    查看详情 <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTemplate && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ← 返回
                  </button>
                  <span className="text-3xl">{categoryIcons[selectedTemplate.icon] || '📋'}</span>
                  <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                </div>
                <p className="text-slate-400">{selectedTemplate.description}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-4 h-4" />
                    时长：{selectedTemplate.duration}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-4 h-4" />
                    共 {selectedTemplate.items.length} 项物品
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleExport(selectedTemplate.id)}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  导出
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-slate-400">完成进度</span>
                <span className="text-white font-medium">
                  {checkedItems.size} / {selectedTemplate.items.length} ({getProgress(selectedTemplate)}%)
                </span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-green-500 transition-all duration-500"
                  style={{ width: `${getProgress(selectedTemplate)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-3">
              {sortedItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all cursor-pointer',
                    checkedItems.has(item.id)
                      ? 'bg-green-900/20 border-green-700/50'
                      : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                  )}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                      checkedItems.has(item.id)
                        ? 'bg-green-500 border-green-500'
                        : 'border-slate-500'
                    )}>
                      {checkedItems.has(item.id) && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={cn(
                          'px-2 py-0.5 text-xs rounded-full text-white font-medium',
                          priorityColors[item.priority]
                        )}>
                          {priorityIcons[item.priority]} {priorityLabels[item.priority]}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">
                          数量：{item.quantity}
                        </span>
                      </div>
                      <h4 className={cn(
                        'font-medium transition-colors',
                        checkedItems.has(item.id) ? 'text-slate-400 line-through' : 'text-white'
                      )}>
                        {item.name}
                      </h4>
                      <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                      {item.notes && (
                        <p className="text-orange-400 text-sm mt-2">📝 {item.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <h4 className="font-medium mb-3">优先级说明</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(priorityLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={cn('w-3 h-3 rounded-full', priorityColors[key])} />
                    <span className="text-sm text-slate-400">
                      {priorityIcons[key]} {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
