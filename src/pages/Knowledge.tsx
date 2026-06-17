import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Clock, CheckCircle, BookOpen } from 'lucide-react'
import { api } from '@/lib/api'
import type { KnowledgeItem, DifficultyLevel, SurvivalScenario } from '@/types'
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

const levels = [
  { value: '', label: '全部等级' },
  { value: 'beginner', label: '入门' },
  { value: 'intermediate', label: '进阶' },
  { value: 'advanced', label: '高级' }
]

const scenarios = [
  { value: '', label: '全部场景' },
  { value: 'urban', label: '城市' },
  { value: 'wilderness', label: '野外' },
  { value: 'vehicle', label: '车辆' },
  { value: 'home', label: '家庭' },
  { value: 'disaster', label: '灾难' },
  { value: 'medical', label: '医疗' }
]

export default function Knowledge() {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  const [selectedScenario, setSelectedScenario] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadItems()
    }, 300)
    return () => clearTimeout(timer)
  }, [search, selectedLevel, selectedScenario, selectedCategory])

  async function loadData() {
    try {
      const [itemsData, categoriesData] = await Promise.all([
        api.knowledge.list(),
        api.knowledge.categories()
      ])
      setItems(itemsData as KnowledgeItem[])
      setCategories(categoriesData as string[])
    } catch (error) {
      console.error('Failed to load knowledge data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadItems() {
    try {
      const params: Record<string, string> = {}
      if (selectedLevel) params.level = selectedLevel
      if (selectedScenario) params.scenario = selectedScenario
      if (selectedCategory) params.category = selectedCategory
      if (search) params.search = search
      
      const data = await api.knowledge.list(params)
      setItems(data as KnowledgeItem[])
    } catch (error) {
      console.error('Failed to load knowledge items:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <BookOpen className="w-10 h-10 text-orange-500" />
          生存知识教学
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          从入门到精通，系统学习生存技能。图文结合，视频演示，
          学完还有自测题巩固知识。
        </p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索生存知识..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
            >
              {levels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
            >
              {scenarios.map(scenario => (
                <option key={scenario.value} value={scenario.value}>{scenario.label}</option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="">全部分类</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm">难度：</span>
        </div>
        {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map(level => (
          <button
            key={level}
            onClick={() => setSelectedLevel(selectedLevel === level ? '' : level)}
            className={cn(
              'px-3 py-1 rounded-full text-sm transition-all',
              selectedLevel === level
                ? `${levelColors[level]} text-white`
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            )}
          >
            {levelNames[level]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm">场景：</span>
        </div>
        {(['urban', 'wilderness', 'vehicle', 'home', 'disaster', 'medical'] as SurvivalScenario[]).map(scenario => (
          <button
            key={scenario}
            onClick={() => setSelectedScenario(selectedScenario === scenario ? '' : scenario)}
            className={cn(
              'px-3 py-1 rounded-full text-sm transition-all flex items-center gap-1',
              selectedScenario === scenario
                ? 'bg-orange-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            )}
          >
            {scenarioIcons[scenario]} {scenarioNames[scenario]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">加载中...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          没有找到相关知识，试试调整筛选条件
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/knowledge/${item.id}`}
              className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-all group"
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-1 ${levelColors[item.level]} text-white text-xs rounded-full font-medium`}>
                    {levelNames[item.level]}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span>{scenarioIcons[item.scenario]}</span>
                  <span className="text-slate-400 text-sm">{scenarioNames[item.scenario]}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 text-sm">{item.category}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4">{item.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-4 h-4" />
                    {item.estimatedTime}分钟
                  </span>
                  {item.quiz && (
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      含自测
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
