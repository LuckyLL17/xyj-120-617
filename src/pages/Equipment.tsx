import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Backpack, Star, ThumbsUp, ThumbsDown, GitCompare, Filter, DollarSign } from 'lucide-react'
import { api } from '@/lib/api'
import type { Equipment, EquipmentCategory } from '@/types'
import { cn } from '@/lib/utils'

const scenarioNames: Record<string, string> = {
  urban: '城市',
  wilderness: '野外',
  vehicle: '车辆',
  home: '家庭',
  disaster: '灾难',
  medical: '医疗'
}

export default function Equipment() {
  const [items, setItems] = useState<Equipment[]>([])
  const [categories, setCategories] = useState<EquipmentCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('')
  const [compareList, setCompareList] = useState<string[]>([])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadItems()
    }, 300)
    return () => clearTimeout(timer)
  }, [search, selectedCategory, minPrice, maxPrice, minRating])

  async function loadData() {
    try {
      const [itemsData, categoriesData] = await Promise.all([
        api.equipment.list(),
        api.equipment.categories()
      ])
      setItems(itemsData as Equipment[])
      setCategories(categoriesData as EquipmentCategory[])
    } catch (error) {
      console.error('Failed to load equipment data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadItems() {
    try {
      const params: Record<string, string> = {}
      if (selectedCategory) params.categoryId = selectedCategory
      if (search) params.search = search
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice
      if (minRating) params.minRating = minRating
      
      const data = await api.equipment.list(params)
      setItems(data as Equipment[])
    } catch (error) {
      console.error('Failed to load equipment items:', error)
    }
  }

  function toggleCompare(id: string) {
    setCompareList(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id)
      }
      if (prev.length >= 3) {
        alert('最多只能对比3个装备')
        return prev
      }
      return [...prev, id]
    })
  }

  function clearFilters() {
    setSearch('')
    setSelectedCategory('')
    setMinPrice('')
    setMaxPrice('')
    setMinRating('')
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Backpack className="w-10 h-10 text-orange-500" />
          装备库与测评
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          覆盖全品类生存装备，每件装备写明优缺点、适用场景和性价比。
          真实用户测评，横向对比，不恰饭！
        </p>
      </div>

      {compareList.length > 0 && (
        <div className="bg-orange-900/30 border border-orange-700 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitCompare className="w-5 h-5 text-orange-400" />
            <span>已选择 {compareList.length} 个装备进行对比</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/equipment/compare?ids=${compareList.join(',')}`}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
            >
              开始对比
            </Link>
            <button
              onClick={() => setCompareList([])}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索装备名称、品牌..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="">全部分类</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <input
                type="number"
                placeholder="最低价"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-20 bg-transparent focus:outline-none text-sm"
              />
              <span className="text-slate-500">-</span>
              <input
                type="number"
                placeholder="最高价"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-20 bg-transparent focus:outline-none text-sm"
              />
            </div>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="">全部评分</option>
              <option value="4">4星以上</option>
              <option value="4.5">4.5星以上</option>
            </select>
            {(minPrice || maxPrice || minRating) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm">分类：</span>
        </div>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? '' : cat.id)}
            className={cn(
              'px-3 py-1 rounded-full text-sm transition-all',
              selectedCategory === cat.id
                ? 'bg-orange-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">加载中...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          没有找到相关装备，试试调整筛选条件
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-all group"
            >
              <div className="aspect-square overflow-hidden bg-slate-800 relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => toggleCompare(item.id)}
                  className={cn(
                    'absolute top-3 right-3 p-2 rounded-lg transition-all',
                    compareList.includes(item.id)
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white'
                  )}
                  title="添加到对比"
                >
                  <GitCompare className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-slate-500">{item.brand}</p>
                    <Link 
                      to={`/equipment/${item.id}`}
                      className="text-lg font-semibold hover:text-orange-400 transition-colors block"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-400">¥{item.price}</p>
                    <div className="flex items-center gap-1 text-sm justify-end">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm line-clamp-2 mb-4">{item.description}</p>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-green-400 text-sm mb-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>优点</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.pros.slice(0, 3).map((pro, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded">
                          {pro}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-red-400 text-sm mb-1">
                      <ThumbsDown className="w-3 h-3" />
                      <span>缺点</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.cons.slice(0, 2).map((con, i) => (
                        <span key={i} className="px-2 py-0.5 bg-red-900/30 text-red-400 text-xs rounded">
                          {con}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {item.scenarios.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">
                        {scenarioNames[s]}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-green-400 font-medium">
                    性价比 {item.valueScore.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
