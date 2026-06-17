import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { ArrowLeft, Star, ThumbsUp, ThumbsDown, DollarSign, TrendingUp, Award, Target, Shield, Zap, GitCompare } from 'lucide-react'
import { api } from '@/lib/api'
import type { Equipment } from '@/types'
import { cn } from '@/lib/utils'

const scenarioNames: Record<string, string> = {
  urban: '城市',
  wilderness: '野外',
  vehicle: '车辆',
  home: '家庭',
  disaster: '灾难',
  medical: '医疗'
}

const colors = [
  { bg: 'bg-orange-500', stroke: '#f97316', fill: 'rgba(249, 115, 22, 0.3)' },
  { bg: 'bg-blue-500', stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.3)' },
  { bg: 'bg-green-500', stroke: '#22c55e', fill: 'rgba(34, 197, 94, 0.3)' },
  { bg: 'bg-purple-500', stroke: '#a855f7', fill: 'rgba(168, 85, 247, 0.3)' }
]

interface RadarDataPoint {
  dimension: string
  fullMark: number
  [key: string]: string | number
}

export default function EquipmentCompare() {
  const [searchParams] = useSearchParams()
  const [items, setItems] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)

  const ids = searchParams.get('ids')?.split(',') || []

  useEffect(() => {
    if (ids.length > 0) {
      loadComparison()
    }
  }, [ids.join(',')])

  async function loadComparison() {
    try {
      setLoading(true)
      const data = await api.equipment.compare(ids) as { items: Equipment[] }
      setItems(data.items)
    } catch (error) {
      console.error('Failed to load comparison:', error)
    } finally {
      setLoading(false)
    }
  }

  function calculateRadarData(): RadarDataPoint[] {
    const dimensions = [
      { key: '性价比', icon: TrendingUp },
      { key: '综合评分', icon: Star },
      { key: '功能丰富度', icon: Zap },
      { key: '场景适应性', icon: Target },
      { key: '用户口碑', icon: Award },
      { key: '价格优势', icon: DollarSign }
    ]

    const maxPrice = Math.max(...items.map(i => i.price))
    const maxSpecs = Math.max(...items.map(i => Object.keys(i.specs).length))

    return dimensions.map(dim => {
      const point: RadarDataPoint = {
        dimension: dim.key,
        fullMark: 100
      }

      items.forEach((item, index) => {
        let score = 0
        switch (dim.key) {
          case '性价比':
            score = item.valueScore * 20
            break
          case '综合评分':
            score = item.rating * 20
            break
          case '功能丰富度':
            score = (Object.keys(item.specs).length / maxSpecs) * 100
            break
          case '场景适应性':
            score = (item.scenarios.length / 6) * 100
            break
          case '用户口碑':
            score = item.rating * 18 + (item.reviews.length > 0 ? 10 : 0)
            break
          case '价格优势':
            score = ((maxPrice - item.price + 100) / (maxPrice + 100)) * 100
            break
        }
        point[`item${index}`] = Math.min(100, Math.round(score))
      })

      return point
    })
  }

  function getAllSpecKeys(): string[] {
    const keys = new Set<string>()
    items.forEach(item => {
      Object.keys(item.specs).forEach(key => keys.add(key))
    })
    return Array.from(keys)
  }

  function getBestValue(field: string): { value: number; isMax: boolean } {
    const values = items.map(i => i[field as keyof Equipment] as number)
    if (field === 'price') {
      return { value: Math.min(...values), isMax: false }
    }
    return { value: Math.max(...values), isMax: true }
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-400">加载中...</div>
  }

  if (items.length < 2) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">请至少选择2个装备进行对比</p>
        <Link
          to="/equipment"
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回装备列表
        </Link>
      </div>
    )
  }

  const radarData = calculateRadarData()
  const specKeys = getAllSpecKeys()
  const bestPrice = getBestValue('price')
  const bestRating = getBestValue('rating')
  const bestValueScore = getBestValue('valueScore')

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to="/equipment"
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <GitCompare className="w-8 h-8 text-orange-500" />
            装备对比分析
          </h1>
          <p className="text-slate-400">
            共 {items.length} 款装备进行多维对比
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              'bg-slate-800/50 border rounded-xl p-4 flex items-center gap-4',
              `border-l-4`,
              colors[index].bg.replace('bg-', 'border-l-')
            )}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-500">{item.brand}</p>
              <p className="font-semibold truncate">{item.name}</p>
              <p className={cn('font-bold', colors[index].bg.replace('bg-', 'text-'))}>
                ¥{item.price}
              </p>
            </div>
            <div className={cn('w-3 h-3 rounded-full', colors[index].bg)} />
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-500" />
          综合能力雷达图
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#475569" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 10 }}
              />
              {items.map((item, index) => (
                <Radar
                  key={item.id}
                  name={item.name}
                  dataKey={`item${index}`}
                  stroke={colors[index].stroke}
                  fill={colors[index].fill}
                  fillOpacity={0.5}
                  strokeWidth={2}
                />
              ))}
              <Legend
                content={({ payload }) => (
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {payload?.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-slate-300">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <h2 className="text-xl font-bold p-6 border-b border-slate-700 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          核心参数对比
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="text-left p-4 text-slate-400 font-medium w-32">对比项</th>
                {items.map((item, index) => (
                  <th
                    key={item.id}
                    className={cn('p-4 font-semibold min-w-40', colors[index].bg.replace('bg-', 'text-'))}
                  >
                    {item.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 text-slate-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  价格
                </td>
                {items.map(item => (
                  <td
                    key={item.id}
                    className={cn(
                      'p-4 font-bold',
                      item.price === bestPrice.value && !bestPrice.isMax
                        ? 'text-green-400'
                        : 'text-white'
                    )}
                  >
                    ¥{item.price}
                    {item.price === bestPrice.value && !bestPrice.isMax && (
                      <span className="ml-2 text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
                        最优
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 text-slate-400 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  综合评分
                </td>
                {items.map(item => (
                  <td
                    key={item.id}
                    className={cn(
                      'p-4 font-bold',
                      item.rating === bestRating.value && bestRating.isMax
                        ? 'text-yellow-400'
                        : 'text-white'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      {item.rating}
                      {item.rating === bestRating.value && bestRating.isMax && (
                        <span className="text-xs bg-yellow-900/50 text-yellow-400 px-2 py-0.5 rounded">
                          最高
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 text-slate-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  性价比
                </td>
                {items.map(item => (
                  <td
                    key={item.id}
                    className={cn(
                      'p-4 font-bold',
                      item.valueScore === bestValueScore.value && bestValueScore.isMax
                        ? 'text-green-400'
                        : 'text-white'
                    )}
                  >
                    {item.valueScore.toFixed(1)}
                    {item.valueScore === bestValueScore.value && bestValueScore.isMax && (
                      <span className="ml-2 text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
                        最优
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 text-slate-400">品牌</td>
                {items.map(item => (
                  <td key={item.id} className="p-4">{item.brand}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-900/30">
                <td className="p-4 text-slate-400">评价数</td>
                {items.map(item => (
                  <td key={item.id} className="p-4">{item.reviews.length} 条</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <h2 className="text-xl font-bold p-6 border-b border-slate-700 flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-500" />
          规格参数对比
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="text-left p-4 text-slate-400 font-medium w-32">参数</th>
                {items.map((item, index) => (
                  <th
                    key={item.id}
                    className={cn('p-4 font-semibold min-w-40', colors[index].bg.replace('bg-', 'text-'))}
                  >
                    {item.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {specKeys.map(key => (
                <tr key={key} className="hover:bg-slate-900/30">
                  <td className="p-4 text-slate-400">{key}</td>
                  {items.map(item => (
                    <td key={item.id} className="p-4">
                      {item.specs[key] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <h2 className="text-xl font-bold p-6 border-b border-slate-700 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-green-500" />
            优点对比
          </h2>
          <div className="p-6 space-y-6">
            {items.map((item, index) => (
              <div key={item.id}>
                <h3 className={cn('font-semibold mb-3', colors[index].bg.replace('bg-', 'text-'))}>
                  {item.name}
                </h3>
                <ul className="space-y-2">
                  {item.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ThumbsUp className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <h2 className="text-xl font-bold p-6 border-b border-slate-700 flex items-center gap-2">
            <ThumbsDown className="w-5 h-5 text-red-500" />
            缺点对比
          </h2>
          <div className="p-6 space-y-6">
            {items.map((item, index) => (
              <div key={item.id}>
                <h3 className={cn('font-semibold mb-3', colors[index].bg.replace('bg-', 'text-'))}>
                  {item.name}
                </h3>
                <ul className="space-y-2">
                  {item.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ThumbsDown className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <h2 className="text-xl font-bold p-6 border-b border-slate-700 flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-500" />
          适用场景对比
        </h2>
        <div className="p-6">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4">
                <span className={cn('w-24 font-semibold', colors[index].bg.replace('bg-', 'text-'))}>
                  {item.name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {item.scenarios.map(s => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-full"
                    >
                      {scenarioNames[s]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-900/30 to-slate-800/50 border border-orange-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-orange-500" />
          对比总结
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">💰 性价比之选</p>
            <p className="font-bold text-green-400 text-lg">
              {items.find(i => i.valueScore === bestValueScore.value)?.name}
            </p>
            <p className="text-sm text-slate-500">
              性价比评分 {bestValueScore.value.toFixed(1)}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">⭐ 用户口碑最佳</p>
            <p className="font-bold text-yellow-400 text-lg">
              {items.find(i => i.rating === bestRating.value)?.name}
            </p>
            <p className="text-sm text-slate-500">
              用户评分 {bestRating.value} 分
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">🏷️ 价格最优</p>
            <p className="font-bold text-blue-400 text-lg">
              {items.find(i => i.price === bestPrice.value)?.name}
            </p>
            <p className="text-sm text-slate-500">
              仅需 ¥{bestPrice.value}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link
          to="/equipment"
          className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          返回装备列表
        </Link>
      </div>
    </div>
  )
}
