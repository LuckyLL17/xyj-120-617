import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Backpack, 
  ClipboardList, 
  Users,
  Shield,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Flame,
  Droplets,
  HeartPulse,
  Gamepad2
} from 'lucide-react'
import { api } from '@/lib/api'
import type { KnowledgeItem, Equipment, CommunityPost } from '@/types'

const features = [
  {
    icon: BookOpen,
    title: '分级生存知识',
    description: '从入门到精通，系统学习生存技能，图文视频结合，学完自测巩固',
    path: '/knowledge',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Backpack,
    title: '装备真实测评',
    description: '覆盖全品类装备，真实用户测评，横向对比，不恰饭！',
    path: '/equipment',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: ClipboardList,
    title: '场景化生存清单',
    description: '按场景生成采购清单，优先级标注，再也不会漏买',
    path: '/checklist',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Gamepad2,
    title: '生存模拟器',
    description: '沉浸式场景模拟，考验你的生存决策，获取专业评估和改进建议',
    path: '/simulator',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: Users,
    title: '生存者社区',
    description: '真实经历分享，区域化讨论，和同好一起进步',
    path: '/community',
    color: 'from-purple-500 to-pink-500'
  }
]

const scenarioIcons = {
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

export default function Home() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [knowledgeData, equipmentData, communityData] = await Promise.all([
        api.knowledge.list(),
        api.equipment.list(),
        api.community.list({ sortBy: 'emergency' })
      ])
      setKnowledgeItems(knowledgeData as KnowledgeItem[])
      setEquipments(equipmentData as Equipment[])
      setCommunityPosts(communityData as CommunityPost[])
    } catch (error) {
      console.error('Failed to load home data:', error)
    } finally {
      setLoading(false)
    }
  }

  const featuredKnowledge = knowledgeItems.slice(0, 3)
  const featuredEquipment = equipments.slice(0, 3)
  const emergencyPost = communityPosts.find(p => p.isEmergency)

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>加载中...</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {emergencyPost && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-medium">
                  紧急通知
                </span>
                <span className="text-red-300 text-sm">{emergencyPost.region}</span>
              </div>
              <Link 
                to={`/community/${emergencyPost.id}`}
                className="block mt-1 text-white font-medium hover:text-red-300 truncate"
              >
                {emergencyPost.title}
              </Link>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </div>
        </div>
      )}

      <section className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600/20 border border-orange-600/30 rounded-full mb-6">
          <Shield className="w-5 h-5 text-orange-400" />
          <span className="text-orange-300 font-medium">中国领先的生存者社区</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
            时刻准备着
          </span>
          <br />
          <span className="text-slate-200">为了明天的生存</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
          学习专业生存知识，装备真实测评，和志同道合的伙伴一起
          <br className="hidden md:block" />
          提升生存技能，为任何可能的情况做好准备
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/knowledge"
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-red-500 transition-all transform hover:scale-105 shadow-lg shadow-orange-600/25"
          >
            开始学习
          </Link>
          <Link
            to="/community"
            className="px-8 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all border border-slate-600"
          >
            加入社区
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Link
              key={index}
              to={feature.path}
              className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-500 transition-all hover:transform hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
              <div className="mt-4 flex items-center text-orange-400 text-sm font-medium">
                了解更多 <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )
        })}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-orange-500" />
              热门生存知识
            </h2>
            <p className="text-slate-400 mt-1">系统学习，从入门到精通</p>
          </div>
          <Link to="/knowledge" className="text-orange-400 hover:text-orange-300 flex items-center gap-1">
            查看全部 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredKnowledge.map((item: KnowledgeItem) => (
            <Link
              key={item.id}
              to={`/knowledge/${item.id}`}
              className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-all group"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">{scenarioIcons[item.scenario]}</span>
                  <span className="text-slate-400 text-sm">{scenarioNames[item.scenario]}</span>
                  <span className={`px-2 py-0.5 ${levelColors[item.level]} text-white text-xs rounded-full`}>
                    {levelNames[item.level]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2">{item.description}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {item.estimatedTime}分钟
                  </span>
                  {item.quiz && (
                    <span className="flex items-center gap-1 text-green-400">
                      ✓ 含自测题
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Backpack className="w-6 h-6 text-orange-500" />
              精选装备推荐
            </h2>
            <p className="text-slate-400 mt-1">真实测评，不恰饭</p>
          </div>
          <Link to="/equipment" className="text-orange-400 hover:text-orange-300 flex items-center gap-1">
            查看全部 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredEquipment.map((item: Equipment) => (
            <Link
              key={item.id}
              to={`/equipment/${item.id}`}
              className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-all group"
            >
              <div className="aspect-square overflow-hidden bg-slate-800">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-slate-500">{item.brand}</p>
                    <h3 className="text-lg font-semibold group-hover:text-orange-400 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-400">¥{item.price}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-yellow-400">★</span>
                      <span>{item.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded">
                    性价比 {item.valueScore.toFixed(1)}
                  </span>
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded">
                    {item.reviews.length} 条测评
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">生存技能快速入门</h2>
          <p className="text-slate-400">掌握核心技能，关键时刻能救命</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 rounded-lg bg-orange-600/20 flex items-center justify-center mb-4">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">野外取火</h3>
            <p className="text-slate-400 text-sm mb-4">
              学习多种取火方法，在恶劣环境下也能生火取暖、烹饪食物
            </p>
            <Link to="/knowledge/k2" className="text-orange-400 hover:text-orange-300 text-sm">
              学习取火技巧 →
            </Link>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 rounded-lg bg-cyan-600/20 flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">水源净化</h3>
            <p className="text-slate-400 text-sm mb-4">
              掌握寻找和净化水源的方法，确保饮水安全
            </p>
            <Link to="/knowledge/k3" className="text-cyan-400 hover:text-cyan-300 text-sm">
              学习净化技术 →
            </Link>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
            <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center mb-4">
              <HeartPulse className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">应急医疗</h3>
            <p className="text-slate-400 text-sm mb-4">
              学习急救知识，处理常见伤病，在黄金时间内自救互救
            </p>
            <Link to="/knowledge/k4" className="text-red-400 hover:text-red-300 text-sm">
              学习急救知识 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
