import type { 
  KnowledgeItem, 
  Equipment, 
  EquipmentCategory, 
  ChecklistCategory, 
  ChecklistTemplate, 
  CommunityPost,
  Comment,
  SimulatorScenario,
  SimulatorQuestion,
  ExchangeItem,
  ExchangeRequest
} from '../../src/types'

export const sensitiveWords = [
  '违禁词', '敏感词', '暴力', '恐怖', '极端',
  'fuck', 'shit', 'bitch', 'cunt', 'nigger',
  '毒品', '赌博', '色情', '诈骗', '传销'
]

export const knowledgeItems: KnowledgeItem[] = [
  {
    id: 'k1',
    title: '城市应急包怎么配',
    description: '学习如何配置一个基础的城市应急包，应对常见城市突发事件',
    level: 'beginner',
    scenario: 'urban',
    category: '应急准备',
    content: `
## 为什么需要城市应急包

在城市生活中，我们可能会遇到各种突发状况：地震、火灾、暴雨内涝、公共卫生事件等。一个准备充分的应急包可以在关键时刻挽救生命。

## 核心物品清单

### 1. 基础生存物品
- **水**：每人每天至少2升，准备3天量
- **食物**：高热量、不易变质的压缩饼干、能量棒
- **多功能工具**：瑞士军刀或多功能钳
- **手电筒**：带备用电池，建议手摇式
- **口哨**：用于求救，声音传得更远

### 2. 医疗用品
- 创可贴、纱布、医用胶带
- 碘伏、酒精棉片
- 常用药品：感冒药、止泻药、止痛药
- 个人特殊药品

### 3. 个人物品
- 备用衣物和保暖毯
- 个人卫生用品
- 重要证件复印件
- 现金和硬币

### 4. 通讯设备
- 备用手机电池或充电宝
- 收音机（手摇式最佳）

## 存放建议

应急包应放在易于取用的地方，如家门口、办公室抽屉。每6个月检查更换一次食物和药品。
`,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=emergency%20preparedness%20kit%20urban%20survival%20backpack%20with%20supplies&image_size=square_hd',
    estimatedTime: 30,
    quiz: {
      id: 'q1',
      questions: [
        {
          id: 'qq1',
          question: '城市应急包中，每人每天至少需要准备多少水？',
          options: ['0.5升', '1升', '2升', '5升'],
          correctAnswerIndex: 2,
          explanation: '每人每天至少需要2升水用于饮用和基本卫生需求。'
        },
        {
          id: 'qq2',
          question: '应急包中的食物和药品应该多久检查更换一次？',
          options: ['1个月', '3个月', '6个月', '1年'],
          correctAnswerIndex: 2,
          explanation: '建议每6个月检查一次，确保食物和药品在有效期内。'
        },
        {
          id: 'qq3',
          question: '以下哪种物品不建议放在应急包中？',
          options: ['口哨', '打火机', '重要证件复印件', '玻璃瓶饮料'],
          correctAnswerIndex: 3,
          explanation: '玻璃瓶饮料重量大且易破碎，不适合放入应急包。'
        }
      ],
      passingScore: 60
    },
    createdAt: '2024-01-15'
  },
  {
    id: 'k2',
    title: '野外取火全攻略',
    description: '掌握多种野外取火方法，应对不同环境条件',
    level: 'intermediate',
    scenario: 'wilderness',
    category: '野外生存',
    content: `
## 火在野外生存中的作用

火不仅能提供温暖，还能烹饪食物、净化水源、驱赶野兽、发出求救信号。

## 取火三要素

1. **燃料**：干草、枯叶、树皮
2. **氧气**：保证空气流通
3. **热量**：达到燃点

## 取火方法

### 1. 摩擦取火
- **钻木取火**：需要干燥的木材和耐心
- **弓弦取火**：提高效率的改良方法
- **火犁法**：适用于较软的木材

### 2. 聚焦取火
- 利用凸透镜、放大镜
- 冰透镜（在寒冷环境中）

### 3. 化学取火
- 火柴、打火机
- 火石和镁棒（最可靠）

### 4. 其他方法
- 电池短路产生火花
- 撞击坚硬岩石产生火星

## 安全注意事项

- 选择合适的地点，远离易燃物
- 准备好灭火措施
- 离开时确保火完全熄灭
`,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wilderness%20survival%20campfire%20bushcraft%20flint%20and%20steel&image_size=square_hd',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    estimatedTime: 45,
    quiz: {
      id: 'q2',
      questions: [
        {
          id: 'qq4',
          question: '取火三要素是什么？',
          options: ['木柴、氧气、温度', '燃料、氧气、热量', '干草、火石、风', '燃料、温度、压力'],
          correctAnswerIndex: 1,
          explanation: '取火需要三个基本条件：燃料（可燃物）、氧气（助燃剂）、热量（达到燃点）。'
        },
        {
          id: 'qq5',
          question: '以下哪种取火方法最可靠？',
          options: ['钻木取火', '放大镜取火', '火石和镁棒', '电池短路'],
          correctAnswerIndex: 2,
          explanation: '火石和镁棒防水、耐用，是最可靠的野外取火工具。'
        }
      ],
      passingScore: 50
    },
    createdAt: '2024-02-20'
  },
  {
    id: 'k3',
    title: '水源净化技术',
    description: '学习如何在野外找到并净化安全饮用水',
    level: 'intermediate',
    scenario: 'wilderness',
    category: '野外生存',
    content: `
## 为什么水的净化很重要

不干净的水中可能含有细菌、病毒、寄生虫和化学污染物，会导致严重疾病。

## 寻找水源

### 可能的水源
- 流动的溪流和河流（首选）
- 泉水
- 雨水收集
- 露水
- 植物中的水分

### 避免的水源
- 静止的池塘（尤其是有蓝藻的）
- 有异味或颜色异常的水
- 动物尸体附近的水

## 净化方法

### 1. 煮沸法
- 煮沸1-3分钟
- 海拔每升高1000米，延长1分钟

### 2. 过滤法
- 陶瓷过滤器
- 活性炭过滤
- 自制沙滤器

### 3. 化学法
- 漂白粉
- 净水药片
- 碘酊（不建议长期使用）

### 4. 紫外线法
- 专用紫外线消毒器
- 阳光照射6小时以上

## 自制简易过滤器

1. 底部放一层细沙
2. 中间放一层活性炭
3. 上层放一层细沙和碎石
4. 底部钻孔让水流出
`,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=water%20purification%20outdoor%20survival%20filter%20system%20nature&image_size=square_hd',
    estimatedTime: 40,
    quiz: {
      id: 'q3',
      questions: [
        {
          id: 'qq6',
          question: '在平原地区，水煮沸后需要保持沸腾多久才能安全饮用？',
          options: ['30秒', '1-3分钟', '5-10分钟', '15分钟以上'],
          correctAnswerIndex: 1,
          explanation: '在平原地区，煮沸1-3分钟足以杀死大多数病原体。'
        },
        {
          id: 'qq7',
          question: '以下哪种水源相对最安全？',
          options: ['静止的池塘', '流动的溪流', '路边的水坑', '动物脚印中的积水'],
          correctAnswerIndex: 1,
          explanation: '流动的溪流相对更安全，但仍需净化后饮用。'
        }
      ],
      passingScore: 50
    },
    createdAt: '2024-03-10'
  },
  {
    id: 'k4',
    title: '应急医疗处理',
    description: '学习常见伤害和突发疾病的应急处理方法',
    level: 'advanced',
    scenario: 'medical',
    category: '急救医疗',
    content: `
## 急救的基本原则

### 黄金时间
- 心跳骤停：4-6分钟内开始心肺复苏
- 严重出血：10分钟内止血
- 中毒：1小时内就医

## 常见伤害处理

### 1. 外伤出血
- **加压止血**：用干净布料按压伤口
- **抬高患肢**：高于心脏位置
- **止血带**：仅在肢体严重受伤时使用

### 2. 骨折和脱臼
- 不要随意移动伤员
- 固定伤处，避免活动
- 冰敷减轻肿胀

### 3. 烧伤
- 一度烧伤（红肿）：冷水冲洗15分钟
- 二度烧伤（水泡）：不要挑破水泡
- 三度烧伤：覆盖干净敷料，立即就医

### 4. 中暑
- 转移到阴凉处
- 降温处理
- 补充水分和电解质

### 5. 低温症
- 转移到温暖处
- 缓慢复温（不要用热水）
- 给予温热饮料

## CPR（心肺复苏）步骤

1. 确认环境安全
2. 检查意识和呼吸
3. 拨打急救电话
4. 胸外按压（100-120次/分钟）
5. 人工呼吸（每30次按压后2次呼吸）
`,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=emergency%20medical%20first%20aid%20kit%20supplies%20professional&image_size=square_hd',
    estimatedTime: 60,
    quiz: {
      id: 'q4',
      questions: [
        {
          id: 'qq8',
          question: '对于严重外伤出血，首先应该怎么做？',
          options: ['拨打120', '加压止血', '检查伤口', '抬高患肢'],
          correctAnswerIndex: 1,
          explanation: '严重出血可能在几分钟内致命，应立即加压止血。'
        },
        {
          id: 'qq9',
          question: 'CPR胸外按压的频率是多少？',
          options: ['60-80次/分钟', '80-100次/分钟', '100-120次/分钟', '120-140次/分钟'],
          correctAnswerIndex: 2,
          explanation: '胸外按压频率应为100-120次/分钟，深度5-6厘米。'
        },
        {
          id: 'qq10',
          question: '对于二度烧伤的水泡，应该怎么处理？',
          options: ['挑破放水', '不要挑破', '涂抹牙膏', '用酒精消毒'],
          correctAnswerIndex: 1,
          explanation: '水泡可以保护伤口，挑破可能导致感染，应让其自行吸收。'
        }
      ],
      passingScore: 60
    },
    createdAt: '2024-04-05'
  },
  {
    id: 'k5',
    title: '家庭应急物资储备',
    description: '如何为家庭储备足够的应急物资',
    level: 'beginner',
    scenario: 'home',
    category: '应急准备',
    content: `
## 为什么需要家庭储备

自然灾害、公共卫生事件等突发情况可能导致停水停电、物资供应中断。建议家庭至少储备72小时的应急物资。

## 物资清单

### 1. 饮用水
- 每人每天2升
- 储备14天用量
- 瓶装水或储水容器

### 2. 食物
- 不易变质的罐头食品
- 压缩饼干、方便面
- 干果、坚果
- 婴儿和老人的特殊食物

### 3. 照明和通讯
- 手电筒和备用电池
- 应急蜡烛和打火机
- 手摇收音机
- 充电宝

### 4. 卫生用品
- 卫生纸、湿纸巾
- 垃圾袋
- 个人卫生用品
- 消毒用品

### 5. 工具
- 多功能工具
- 开罐器
- 打火机或火柴
- 绳索

## 定期检查

每月检查一次物资保质期，轮换更新。建议建立家庭紧急预案，确定集合地点和联系方式。
`,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=home%20emergency%20supply%20kit%20food%20water%20storage%20disaster%20preparedness&image_size=square_hd',
    estimatedTime: 25,
    createdAt: '2024-05-12'
  },
  {
    id: 'k6',
    title: '车辆应急装备配置',
    description: '在车辆中准备必要的应急装备',
    level: 'beginner',
    scenario: 'vehicle',
    category: '应急准备',
    content: `
## 为什么需要车载应急装备

车辆故障、交通事故、恶劣天气被困等情况都可能发生。车载应急装备可以帮助你在等待救援时保持安全。

## 必备装备清单

### 1. 安全装备
- 三角警示牌
- 反光背心
- 灭火器（定期检查压力）
- 安全锤

### 2. 自救装备
- 千斤顶和轮胎扳手
- 备胎（检查胎压）
- 搭电线
- 拖车绳
- 工兵铲

### 3. 生存装备
- 饮用水和高热量食物
- 急救包
- 保暖毯
- 手电筒和备用电池
- 手机充电宝

### 4. 应对不同季节
- **夏季**：遮阳伞、降温用品
- **冬季**：防滑链、雪地靴、雪铲

## 使用注意事项

定期检查装备是否完好有效，特别是灭火器、急救包等有保质期的物品。
`,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=car%20emergency%20kit%20vehicle%20safety%20equipment%20roadside%20assistance&image_size=square_hd',
    estimatedTime: 20,
    createdAt: '2024-06-01'
  }
]

export const equipmentCategories: EquipmentCategory[] = [
  { id: 'ec1', name: '背包与收纳', icon: 'backpack', description: '各种容量的生存背包和收纳系统' },
  { id: 'ec2', name: '取火工具', icon: 'flame', description: '打火机、火石、镁棒等取火装备' },
  { id: 'ec3', name: '水具与净化', icon: 'droplets', description: '水壶、净水器等饮水相关装备' },
  { id: 'ec4', name: '刀具与工具', icon: 'axe', description: '生存刀、多功能工具、斧头' },
  { id: 'ec5', name: '急救医疗', icon: 'heart-pulse', description: '急救包、药品、医疗用品' },
  { id: 'ec6', name: '照明设备', icon: 'flashlight', description: '手电筒、头灯、营地灯' },
  { id: 'ec7', name: '通讯设备', icon: 'radio', description: '对讲机、收音机、卫星定位' },
  { id: 'ec8', name: '户外服装', icon: 'shirt', description: '冲锋衣、登山鞋、保暖装备' }
]

export const equipments: Equipment[] = [
  {
    id: 'e1',
    name: '生存者72小时应急背包',
    categoryId: 'ec1',
    brand: 'SurvivalPro',
    price: 899,
    rating: 4.6,
    pros: ['空间设计合理', '防水材质', '背负系统舒适', '附多处外挂点'],
    cons: ['重量略大', '价格偏高', '颜色选择少'],
    scenarios: ['urban', 'wilderness', 'disaster'],
    valueScore: 4.2,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tactical%20survival%20backpack%20military%20green%20outdoor%20gear&image_size=square_hd',
    description: '这款45L应急背包采用500D防水尼龙材质，专为72小时生存设计。主仓容量大，分隔合理，可容纳水、食物、急救包等物资。',
    specs: {
      '容量': '45L',
      '材质': '500D防水尼龙',
      '重量': '1.8kg',
      '尺寸': '55x30x25cm',
      '颜色': '军绿色/黑色'
    },
    reviews: [
      {
        id: 'er1',
        equipmentId: 'e1',
        userId: 'u1',
        userName: '荒野求生者',
        rating: 5,
        title: '非常实用的生存背包',
        content: '用了半年，背负系统很舒服，长时间背也不累。防水性能很好，下雨天里面东西都没湿。',
        usageDuration: '6个月',
        createdAt: '2024-03-15',
        verified: true
      },
      {
        id: 'er2',
        equipmentId: 'e1',
        userId: 'u2',
        userName: '城市预备者',
        rating: 4,
        title: '性价比不错',
        content: '空间足够放3天的物资，只是自重有点大。整体来说还是很满意的。',
        usageDuration: '3个月',
        createdAt: '2024-04-20',
        verified: true
      }
    ],
    createdAt: '2024-01-10'
  },
  {
    id: 'e2',
    name: '镁棒打火石套装',
    categoryId: 'ec2',
    brand: 'FireMaster',
    price: 89,
    rating: 4.8,
    pros: ['防水防潮', '使用寿命长', '适用各种天气', '价格实惠'],
    cons: ['需要练习掌握技巧', '低温下火花稍弱'],
    scenarios: ['wilderness', 'disaster'],
    valueScore: 4.9,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=magnesium%20fire%20starter%20flint%20rod%20bushcraft%20tool&image_size=square_hd',
    description: '专业级镁棒打火石，可产生3000℃高温火花，在任何天气条件下都能可靠点火。套装包含刮片和防失手绳。',
    specs: {
      '长度': '12.7cm',
      '直径': '1.27cm',
      '材质': '镁合金',
      '点火次数': '约12000次',
      '工作温度': '-40℃至800℃'
    },
    reviews: [
      {
        id: 'er3',
        equipmentId: 'e2',
        userId: 'u3',
        userName: '丛林探险家',
        rating: 5,
        title: '户外必备神器',
        content: '在雨中也能轻松点火，比打火机可靠多了。新手需要多练习几次就能掌握。',
        usageDuration: '1年',
        createdAt: '2024-02-28',
        verified: true
      }
    ],
    createdAt: '2024-01-15'
  },
  {
    id: 'e3',
    name: '便携式户外净水器',
    categoryId: 'ec3',
    brand: 'PureH2O',
    price: 399,
    rating: 4.5,
    pros: ['过滤精度高', '重量轻便', '无需电力', '出水量大'],
    cons: ['滤芯需要定期更换', '低温环境可能结冰', '价格较高'],
    scenarios: ['wilderness', 'disaster'],
    valueScore: 4.3,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portable%20water%20filter%20outdoor%20survival%20purification%20system&image_size=square_hd',
    description: '采用0.1微米中空纤维超滤膜，可滤除99.9999%的细菌和99.9%的寄生虫。一分钟可净化1.5升水。',
    specs: {
      '过滤精度': '0.1微米',
      '重量': '110g',
      '滤芯寿命': '4000升',
      '流速': '1.5L/分钟',
      '尺寸': '16x3.8cm'
    },
    reviews: [
      {
        id: 'er4',
        equipmentId: 'e3',
        userId: 'u4',
        userName: '徒步爱好者',
        rating: 5,
        title: '救了我一命',
        content: '上次徒步水源喝完了，靠这个过滤器喝了溪流水，完全没问题。',
        usageDuration: '8个月',
        createdAt: '2024-05-10',
        verified: true
      }
    ],
    createdAt: '2024-02-01'
  },
  {
    id: 'e4',
    name: '多功能生存刀具',
    categoryId: 'ec4',
    brand: 'BladeMaster',
    price: 599,
    rating: 4.7,
    pros: ['钢材硬度高', '做工精良', '手感舒适', '功能多样'],
    cons: ['价格偏高', '需要定期保养', '不适合新手'],
    scenarios: ['wilderness', 'urban', 'disaster'],
    valueScore: 4.4,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=survival%20knife%20bushcraft%20tactical%20blade%20outdoor%20tool&image_size=square_hd',
    description: '采用440C不锈钢，硬度达到HRC58-60。刀柄采用防滑G10材质，附打火石、磨刀器、哨子等多功能配件。',
    specs: {
      '全长': '23cm',
      '刃长': '10.5cm',
      '材质': '440C不锈钢',
      '硬度': 'HRC58-60',
      '重量': '220g'
    },
    reviews: [
      {
        id: 'er5',
        equipmentId: 'e4',
        userId: 'u5',
        userName: '刀具收藏者',
        rating: 5,
        title: '性价比很高的生存刀',
        content: '钢材不错，保持性很好。刀柄手感一流，长时间使用也不累。',
        usageDuration: '6个月',
        createdAt: '2024-04-15',
        verified: true
      }
    ],
    createdAt: '2024-02-20'
  },
  {
    id: 'e5',
    name: '专业急救包(200件)',
    categoryId: 'ec5',
    brand: 'MedCare',
    price: 259,
    rating: 4.6,
    pros: ['物品齐全', '分类清晰', '防水包装', '质量可靠'],
    cons: ['体积较大', '部分物品可能用不上', '重量偏重'],
    scenarios: ['urban', 'wilderness', 'home', 'vehicle', 'disaster', 'medical'],
    valueScore: 4.7,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=first%20aid%20kit%20medical%20supplies%20emergency%20bag&image_size=square_hd',
    description: '包含200件急救用品，覆盖外伤处理、心肺复苏、烧伤处理等多种场景。采用防水牛津布包装。',
    specs: {
      '件数': '200件',
      '尺寸': '22x15x8cm',
      '重量': '0.8kg',
      '材质': '防水牛津布',
      '保质期': '3年'
    },
    reviews: [
      {
        id: 'er6',
        equipmentId: 'e5',
        userId: 'u6',
        userName: '户外领队',
        rating: 5,
        title: '领队必备',
        content: '带队员出去徒步必备，上次有队员受伤，里面用品很全，处理得很及时。',
        usageDuration: '1年',
        createdAt: '2024-03-20',
        verified: true
      }
    ],
    createdAt: '2024-03-05'
  },
  {
    id: 'e6',
    name: '强光战术手电筒',
    categoryId: 'ec6',
    brand: 'BrightPro',
    price: 199,
    rating: 4.5,
    pros: ['亮度高', '续航时间长', '防水耐用', '多功能模式'],
    cons: ['体积较大', '重量偏重', '价格偏高'],
    scenarios: ['urban', 'wilderness', 'home', 'vehicle', 'disaster'],
    valueScore: 4.5,
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tactical%20flashlight%20led%20bright%20rechargeable%20outdoor&image_size=square_hd',
    description: '1200流明强光，射程300米。IPX6防水等级，支持强光、弱光、爆闪、SOS四种模式。USB充电。',
    specs: {
      '亮度': '1200流明',
      '射程': '300米',
      '续航': '8小时(弱光)',
      '防水等级': 'IPX6',
      '重量': '180g'
    },
    reviews: [],
    createdAt: '2024-03-15'
  }
]

export const checklistCategories: ChecklistCategory[] = [
  { id: 'cc1', name: '应急生存包', scenario: 'disaster', description: '应对各种灾难的生存包清单', icon: 'backpack' },
  { id: 'cc2', name: '户外探险', scenario: 'wilderness', description: '野外活动必备物品清单', icon: 'tent' },
  { id: 'cc3', name: '车辆应急', scenario: 'vehicle', description: '车载应急装备清单', icon: 'car' },
  { id: 'cc4', name: '家庭储备', scenario: 'home', description: '家庭应急物资储备清单', icon: 'home' }
]

export const checklistTemplates: ChecklistTemplate[] = [
  {
    id: 'ct1',
    name: '72小时求生包',
    categoryId: 'cc1',
    description: '应对突发灾难，能够独立生存72小时的必备物品',
    duration: '3天',
    icon: 'clock',
    items: [
      { id: 'ci1', name: '饮用水', description: '每人每天2升', priority: 'critical', quantity: '6升/人', notes: '瓶装水或储水袋' },
      { id: 'ci2', name: '高热量食物', description: '压缩饼干、能量棒等', priority: 'critical', quantity: '3天量', notes: '注意保质期' },
      { id: 'ci3', name: '急救包', description: '包含常用药品和包扎用品', priority: 'critical', quantity: '1个', notes: '定期检查更新' },
      { id: 'ci4', name: '手电筒', description: '带备用电池', priority: 'critical', quantity: '1个', notes: '建议手摇式' },
      { id: 'ci5', name: '多功能工具', description: '瑞士军刀或类似工具', priority: 'high', quantity: '1个' },
      { id: 'ci6', name: '口哨', description: '用于发出求救信号', priority: 'high', quantity: '1个' },
      { id: 'ci7', name: '应急毯', description: '保暖和急救使用', priority: 'high', quantity: '1条' },
      { id: 'ci8', name: '重要证件复印件', description: '身份证、银行卡等', priority: 'high', quantity: '1套', notes: '防水袋密封' },
      { id: 'ci9', name: '现金', description: '小额钞票和硬币', priority: 'medium', quantity: '500-1000元' },
      { id: 'ci10', name: '备用衣物', description: '保暖内衣、外套', priority: 'medium', quantity: '1套' },
      { id: 'ci11', name: '卫生用品', description: '卫生纸、湿纸巾', priority: 'low', quantity: '适量' }
    ]
  },
  {
    id: 'ct2',
    name: '车上常备物',
    categoryId: 'cc3',
    description: '车辆必备的应急和安全装备',
    duration: '长期',
    icon: 'car',
    items: [
      { id: 'ci12', name: '三角警示牌', description: '车辆故障时放置', priority: 'critical', quantity: '1个' },
      { id: 'ci13', name: '反光背心', description: '车外作业时穿着', priority: 'critical', quantity: '2件' },
      { id: 'ci14', name: '车载灭火器', description: '初期火灾扑救', priority: 'critical', quantity: '1个', notes: '定期检查压力' },
      { id: 'ci15', name: '安全锤', description: '紧急破窗逃生', priority: 'critical', quantity: '1个' },
      { id: 'ci16', name: '搭电线', description: '电瓶亏电时使用', priority: 'high', quantity: '1套' },
      { id: 'ci17', name: '拖车绳', description: '车辆脱困使用', priority: 'high', quantity: '1条' },
      { id: 'ci18', name: '千斤顶和扳手', description: '更换备胎', priority: 'high', quantity: '1套' },
      { id: 'ci19', name: '车载急救包', description: '简单医疗用品', priority: 'high', quantity: '1个' },
      { id: 'ci20', name: '工兵铲', description: '车辆陷车时使用', priority: 'medium', quantity: '1把' },
      { id: 'ci21', name: '饮用水和食物', description: '等待救援时用', priority: 'medium', quantity: '适量' }
    ]
  },
  {
    id: 'ct3',
    name: '城市应急包',
    categoryId: 'cc1',
    description: '适合城市居民的应急包配置',
    duration: '3天',
    icon: 'building-2',
    items: [
      { id: 'ci22', name: '防毒面具/口罩', description: '防止烟雾和有害气体', priority: 'critical', quantity: '2个/人' },
      { id: 'ci23', name: '防滑鞋', description: '在废墟中行走', priority: 'high', quantity: '1双' },
      { id: 'ci24', name: '安全帽', description: '防止坠物砸伤', priority: 'high', quantity: '1个' },
      { id: 'ci25', name: '瓶装水', description: '应急饮用', priority: 'critical', quantity: '6升/人' },
      { id: 'ci26', name: '压缩食品', description: '高热量应急食品', priority: 'critical', quantity: '3天量' },
      { id: 'ci27', name: '急救包', description: '医疗急救用品', priority: 'critical', quantity: '1个' },
      { id: 'ci28', name: '手电筒', description: '停电时照明', priority: 'critical', quantity: '1个' },
      { id: 'ci29', name: '手摇收音机', description: '获取应急信息', priority: 'high', quantity: '1个' },
      { id: 'ci30', name: '哨子', description: '求救信号', priority: 'high', quantity: '1个' },
      { id: 'ci31', name: '多功能工具', description: '应急工具', priority: 'medium', quantity: '1个' },
      { id: 'ci32', name: '雨衣', description: '雨天应急', priority: 'low', quantity: '1件' }
    ]
  },
  {
    id: 'ct4',
    name: '一日徒步装备',
    categoryId: 'cc2',
    description: '单日户外徒步所需装备',
    duration: '1天',
    icon: 'footprints',
    items: [
      { id: 'ci33', name: '徒步鞋', description: '舒适防滑', priority: 'critical', quantity: '1双' },
      { id: 'ci34', name: '背包', description: '20-30L容量', priority: 'critical', quantity: '1个' },
      { id: 'ci35', name: '饮用水', description: '至少2升', priority: 'critical', quantity: '2-3升' },
      { id: 'ci36', name: '能量补给', description: '能量棒、巧克力', priority: 'high', quantity: '适量' },
      { id: 'ci37', name: '防晒用品', description: '帽子、防晒霜', priority: 'high', quantity: '1套' },
      { id: 'ci38', name: '雨具', description: '雨衣或雨伞', priority: 'high', quantity: '1件' },
      { id: 'ci39', name: '头灯', description: '备用照明', priority: 'medium', quantity: '1个' },
      { id: 'ci40', name: '急救包', description: '简单外伤处理', priority: 'medium', quantity: '1个' },
      { id: 'ci41', name: '登山杖', description: '减轻腿部负担', priority: 'low', quantity: '1-2根' },
      { id: 'ci42', name: '手机和充电宝', description: '通讯和导航', priority: 'high', quantity: '1套' }
    ]
  }
]

export const communityPosts: CommunityPost[] = [
  {
    id: 'cp1',
    userId: 'u1',
    userName: '硬核生存者',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=survivor1',
    title: '2023年北京暴雨被困24小时真实经历',
    content: '去年7月那场暴雨，我被困在公司地下停车场。水涨得很快，幸好我平时车上备有应急包。分享一下当时的情况和经验：\n\n1. 不要试图驾车通过积水区，我的车就是因为这个熄火的\n2. 车窗留一点缝隙，防止水压太大无法开门\n3. 应急包一定要放在随手能拿到的地方\n4. 保持手机电量，不要一直刷视频\n5. 不要慌张，耐心等待救援\n\n最后救援队用皮划艇把我们救出来的。从那以后，我车上的应急装备又增加了好几样。',
    category: 'experience',
    tags: ['暴雨', '城市内涝', '真实经历', '北京'],
    region: '北京',
    likes: 328,
    comments: 56,
    createdAt: '2024-05-15 14:30',
    isEmergency: false
  },
  {
    id: 'cp2',
    userId: 'u2',
    userName: '户外老驴',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hiker',
    title: '穿越秦岭时迷路了，靠这些技能脱险',
    content: '上个月和朋友穿越秦岭，中途走错路迷路了。手机没有信号，天也快黑了。\n\n幸好我学过野外生存知识：\n- 找到水源，沿着河流走（河流通常会通向有人的地方）\n- 用手表和太阳辨别方向\n- 晚上在背风处生火取暖\n- 用哨子发出求救信号\n\n第二天中午被护林员发现了。提醒大家：户外探险一定要做好功课，不要单独行动。',
    category: 'experience',
    tags: ['野外生存', '迷路', '秦岭', '户外经验'],
    likes: 512,
    comments: 89,
    createdAt: '2024-05-20 09:15'
  },
  {
    id: 'cp3',
    userId: 'u3',
    userName: '上海预备者',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shanghai',
    title: '上海地区的朋友，你们的应急包准备好了吗？',
    content: '最近台风季节快到了，提醒上海的小伙伴们检查一下应急物资。\n\n上海经常遇到的情况：\n1. 台风导致停水停电\n2. 地铁停运\n3. 超市抢购\n\n建议准备：\n- 至少3天的饮用水和食物\n- 手电筒和备用电池\n- 充电宝\n- 常用药品\n\n上海的朋友可以来交流一下你们的准备情况。',
    category: 'regional',
    tags: ['台风', '上海', '应急准备', '区域讨论'],
    region: '上海',
    likes: 178,
    comments: 45,
    createdAt: '2024-06-01 16:45'
  },
  {
    id: 'cp4',
    userId: 'u4',
    userName: '装备测评师',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reviewer',
    title: '讨论：国产生存装备真的不如进口的吗？',
    content: '最近看到很多人说国产的生存装备质量不好，我有些不同看法。\n\n我用过的国产装备中，很多质量并不比进口的差，价格却便宜很多。比如某品牌的打火石，我用了两年多，点火依然很顺。\n\n当然，确实有些小品牌质量参差不齐。大家可以分享一下用过的靠谱国产装备品牌，避避坑。',
    category: 'discussion',
    tags: ['装备讨论', '国产装备', '性价比'],
    likes: 245,
    comments: 78,
    createdAt: '2024-06-05 11:20'
  },
  {
    id: 'cp5',
    userId: 'u5',
    userName: '新手小白',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=newbie',
    title: '新手求助：第一次露营需要准备什么？',
    content: '大家好，我是新手，最近想和朋友去露营，但是完全不知道该准备什么。\n\n想问一下：\n1. 帐篷选哪种比较好？（预算1000以内）\n2. 睡袋需要买什么样的？\n3. 有没有什么必带的小物件容易被忽略？\n4. 需要学习什么基础技能？\n\n希望老玩家指点一下，谢谢！',
    category: 'question',
    tags: ['新手求助', '露营', '装备推荐'],
    likes: 89,
    comments: 34,
    createdAt: '2024-06-08 20:10'
  },
  {
    id: 'cp6',
    userId: 'u6',
    userName: '广东生存党',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guangdong',
    title: '【紧急】广东地区台风预警，请做好准备',
    content: '紧急通知：今年第X号台风预计明天登陆广东沿海，风力可达12级以上。\n\n请广东的朋友们：\n1. 储备足够的饮用水和食物（建议3-5天）\n2. 检查门窗，做好防风措施\n3. 不要去海边活动\n4. 充电宝充好电\n5. 把阳台上的花盆等物品移到室内\n\n希望大家都平安！',
    category: 'regional',
    tags: ['台风', '紧急通知', '广东', '预警'],
    region: '广东',
    likes: 567,
    comments: 123,
    createdAt: '2024-06-10 08:00',
    isEmergency: true
  }
]

export const comments: Comment[] = [
  {
    id: 'cm1',
    postId: 'cp1',
    userId: 'u7',
    userName: '天津车友',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tianjin',
    content: '太惊险了！我车上也有应急包，但是很多东西都过期了，今晚就回去检查。',
    likes: 23,
    createdAt: '2024-05-15 15:00'
  },
  {
    id: 'cm2',
    postId: 'cp1',
    userId: 'u8',
    userName: '安全员小李',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=safety',
    content: '补充一点：如果被困在车里，不要一直开空调，会消耗电瓶电量。可以每隔一段时间发动一下车。',
    likes: 45,
    createdAt: '2024-05-15 15:30'
  },
  {
    id: 'cm3',
    postId: 'cp2',
    userId: 'u9',
    userName: '救援队老王',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rescue',
    content: '楼主的做法很正确。补充一点：迷路后最好在原地等待，不要乱走，这样更容易被救援人员找到。',
    likes: 67,
    createdAt: '2024-05-20 10:00'
  },
  {
    id: 'cm4',
    postId: 'cp3',
    userId: 'u10',
    userName: '浦东居民',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pudong',
    content: '上海徐汇的，我家已经备了10桶5升的水，还有两箱压缩饼干。今年准备得特别充分。',
    likes: 12,
    createdAt: '2024-06-01 17:00'
  },
  {
    id: 'cm5',
    postId: 'cp4',
    userId: 'u11',
    userName: '国货支持者',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=madeinchina',
    content: '我用的都是国产的，质量真的不错。比如汉道的刀、神火的手电，性价比很高。',
    likes: 34,
    createdAt: '2024-06-05 12:00'
  }
]

export const simulatorScenarios: SimulatorScenario[] = [
  {
    id: 's1',
    name: '城市地震求生',
    description: '一场突如其来的7级地震袭击了你所在的城市，高楼晃动、尘土飞扬，你需要在接下来的72小时内做出正确决策以求生存。',
    scenario: 'urban',
    difficulty: 'intermediate',
    duration: '72小时',
    icon: '🏙️',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=city%20earthquake%20survival%20debris%20emergency%20disaster&image_size=square_hd',
    totalQuestions: 5
  },
  {
    id: 's2',
    name: '野外迷失生存',
    description: '你在徒步旅行时不慎与同伴走散，手机没有信号，天色渐暗，气温开始下降，你必须在原始森林中生存3天直到救援到来。',
    scenario: 'wilderness',
    difficulty: 'advanced',
    duration: '3天',
    icon: '🏕️',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wilderness%20lost%20forest%20survival%20bushcraft%20night&image_size=square_hd',
    totalQuestions: 5
  },
  {
    id: 's3',
    name: '车辆暴雪被困',
    description: '你驾车在高速公路上遭遇罕见暴雪，能见度几乎为零，所有车辆都被困住，救援可能需要24小时才能到达，车内温度正在快速下降。',
    scenario: 'vehicle',
    difficulty: 'intermediate',
    duration: '24小时',
    icon: '🚗',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=car%20stuck%20blizzard%20snowstorm%20highway%20emergency&image_size=square_hd',
    totalQuestions: 5
  },
  {
    id: 's4',
    name: '家庭停水停电',
    description: '极端暴雨导致城市大面积内涝，水电供应中断，预计需要7天才能恢复。你需要在家中利用现有物资保障全家3口人的基本生存。',
    scenario: 'home',
    difficulty: 'beginner',
    duration: '7天',
    icon: '🏠',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=home%20blackout%20flood%20candlelight%20family%20emergency&image_size=square_hd',
    totalQuestions: 5
  },
  {
    id: 's5',
    name: '户外急救应对',
    description: '你和朋友在爬山时，同伴不慎失足摔伤，疑似骨折且有外伤出血。手机信号微弱，救护车需要至少2小时才能到达，你需要立即进行急救处理。',
    scenario: 'medical',
    difficulty: 'advanced',
    duration: '2小时',
    icon: '🏥',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=outdoor%20first%20aid%20mountain%20rescue%20emergency%20injury&image_size=square_hd',
    totalQuestions: 5
  }
]

export const simulatorQuestions: SimulatorQuestion[] = [
  {
    id: 'sq1',
    scenarioId: 's1',
    order: 1,
    situation: '地震发生时，你正在15楼的办公室中。大楼剧烈晃动，办公家具纷纷倒下，天花板的石灰块开始掉落，周围的同事惊慌失措地尖叫。',
    question: '此时此刻，你应该怎么做？',
    options: [
      {
        id: 'sq1_o1',
        text: '立即冲向电梯，尽快下楼逃生',
        score: 0,
        feedback: '这是一个非常危险的选择！',
        improvement: '地震时电梯可能断电、变形，是最危险的地方之一。',
        consequences: '你可能被困在电梯中，甚至遭遇电梯坠落。'
      },
      {
        id: 'sq1_o2',
        text: '立刻躲到结实的办公桌下，双手护住头部',
        score: 100,
        feedback: '非常正确的选择！',
        consequences: '桌子为你挡住掉落的物体，你安全度过了最剧烈的震动期。'
      },
      {
        id: 'sq1_o3',
        text: '跟着人群冲向楼梯，拼命往下跑',
        score: 30,
        feedback: '这是一个有风险的选择。',
        improvement: '震动期间奔跑容易摔倒或被掉落物砸中，应先躲避，等震动停止后再撤离。',
        consequences: '你在楼梯上被慌乱的人群挤倒，受了轻伤。'
      },
      {
        id: 'sq1_o4',
        text: '跑到窗户边，观察外面的情况并大声呼救',
        score: 20,
        feedback: '这是一个危险的选择。',
        improvement: '窗户附近容易被玻璃碎片伤害，也容易被外墙掉落物砸中。',
        consequences: '窗户玻璃碎裂，你被碎片划伤。'
      }
    ],
    hint: '记住地震应对的"伏地、遮挡、手抓牢"三原则。'
  },
  {
    id: 'sq2',
    scenarioId: 's1',
    order: 2,
    situation: '第一次震动暂时停止了。你从桌子下爬出来，发现走廊里烟雾弥漫，应急灯已经亮起。周围有人受伤哭喊，电梯显示"停止运行"。',
    question: '接下来你应该优先做什么？',
    options: [
      {
        id: 'sq2_o1',
        text: '帮助受伤的同事简单处理伤口，然后一起撤离',
        score: 100,
        feedback: '非常好的决策！',
        consequences: '你帮助受伤的同事进行了简单包扎，然后互相搀扶着从安全通道撤离。'
      },
      {
        id: 'sq2_o2',
        text: '收拾自己的贵重物品，然后独自撤离',
        score: 10,
        feedback: '这是一个自私且危险的选择。',
        improvement: '生命安全永远比财物重要，耽误的时间可能让你遭遇余震。',
        consequences: '你收拾物品耽误了时间，撤离时遭遇了较强余震。'
      },
      {
        id: 'sq2_o3',
        text: '用手机拍照发朋友圈，记录现场情况',
        score: 0,
        feedback: '这是一个非常错误的选择！',
        improvement: '紧急情况下应该专注于逃生，而不是社交媒体。',
        consequences: '你只顾拍照，没有注意到头顶松动的天花板，被砸伤。'
      },
      {
        id: 'sq2_o4',
        text: '立即从安全通道快速撤离，不要管其他人',
        score: 40,
        feedback: '你确保了自身安全，但可以做得更好。',
        improvement: '在确保自身安全的前提下，应该帮助有需要的人。',
        consequences: '你安全撤离了，但受伤的同事因为无人帮助延误了救治。'
      }
    ],
    hint: '先确保自身安全，然后尽可能帮助他人。'
  },
  {
    id: 'sq3',
    scenarioId: 's1',
    order: 3,
    situation: '你成功撤离到了开阔地带。余震不断，周围建筑损毁严重，街道上到处都是瓦砾。手机通讯中断，你听到有人在废墟下呼救。',
    question: '你应该怎么做？',
    options: [
      {
        id: 'sq3_o1',
        text: '立即徒手挖掘废墟，营救被困者',
        score: 30,
        feedback: '你的勇气值得肯定，但方法不对。',
        improvement: '没有专业工具和知识，盲目挖掘可能造成二次坍塌，也可能伤到被困者。',
        consequences: '你的挖掘导致废墟松动，被困者的处境更加危险。'
      },
      {
        id: 'sq3_o2',
        text: '先评估环境安全，然后呼喊回应被困者，稳定其情绪',
        score: 100,
        feedback: '非常专业的应对！',
        consequences: '你确认了周围没有立即坍塌的风险，然后与被困者对话，告诉他不要慌，救援正在赶来。'
      },
      {
        id: 'sq3_o3',
        text: '远离废墟，找一个安全的地方等待官方救援',
        score: 50,
        feedback: '你的选择很谨慎，但可以更积极。',
        improvement: '在确保安全的前提下，可以为被困者提供力所能及的帮助。',
        consequences: '你找到了安全的地方，但被困者因为无人回应而感到绝望。'
      },
      {
        id: 'sq3_o4',
        text: '组织周围有能力的人，在确保安全的前提下展开救援',
        score: 90,
        feedback: '很好的做法！',
        consequences: '你组织了几名志愿者，在确保安全的前提下，成功救出了被困者。'
      }
    ],
    hint: '先确保自身安全，然后评估情况，科学救助。'
  },
  {
    id: 'sq4',
    scenarioId: 's1',
    order: 4,
    situation: '地震过去6小时了。夜幕降临，气温开始下降。你随身携带的物品有：手机（没电了）、钱包、钥匙、半包饼干、一瓶500ml的水。',
    question: '你应该如何分配水和食物？',
    options: [
      {
        id: 'sq4_o1',
        text: '一次性吃光喝光，补充体力',
        score: 10,
        feedback: '非常错误的做法！',
        improvement: '你不知道救援什么时候能到，物资需要合理分配。',
        consequences: '你很快就吃完了所有东西，接下来的时间饥寒交迫。'
      },
      {
        id: 'sq4_o2',
        text: '把水全部留着，饼干现在吃掉',
        score: 40,
        feedback: '有一定道理，但还可以更合理。',
        improvement: '食物也需要分配，干吃饼干会消耗更多水分。',
        consequences: '饼干吃完了，但没有足够的水，你感到非常口渴。'
      },
      {
        id: 'sq4_o3',
        text: '按72小时生存需求，少量多次分配食物和水',
        score: 100,
        feedback: '非常正确的分配方式！',
        consequences: '你将水分成12份，每6小时喝一份；饼干分成6份，每12小时吃一份，保持了基本的体力。'
      },
      {
        id: 'sq4_o4',
        text: '把水和食物都留给更需要的老人和孩子',
        score: 80,
        feedback: '你的精神令人敬佩！',
        improvement: '同时也要确保自己能活下去，这样才能帮助更多人。',
        consequences: '你的慷慨帮助了需要的人，但你自己的体力有所下降。'
      }
    ],
    hint: '城市地震后，黄金救援时间是72小时，要做好打持久战的准备。'
  },
  {
    id: 'sq5',
    scenarioId: 's1',
    order: 5,
    situation: '地震后24小时，你在临时避难所。有陌生人说他知道一条安全的路线，可以带大家去附近的救灾物资领取点，但需要穿过几条损坏的街道。',
    question: '你应该怎么做？',
    options: [
      {
        id: 'sq5_o1',
        text: '立即跟随他去领取物资',
        score: 20,
        feedback: '这是一个危险的选择。',
        improvement: '在混乱环境中，不要轻易相信陌生人，也不要前往危险区域。',
        consequences: '你跟随他前往，途中遭遇了建筑物坍塌，处境危险。'
      },
      {
        id: 'sq5_o2',
        text: '留在避难所，等待官方统一组织发放物资',
        score: 100,
        feedback: '最安全可靠的选择！',
        consequences: '你留在避难所，几小时后官方救援队伍到达，带来了充足的物资和医疗援助。'
      },
      {
        id: 'sq5_o3',
        text: '叫上几个熟悉的人一起去，互相有个照应',
        score: 50,
        feedback: '比独自前往安全，但仍有风险。',
        improvement: '损坏的街道随时可能坍塌，最好等待专业人员清理。',
        consequences: '你们一行人小心翼翼地穿过街道，虽然有些惊险，但最终领到了物资。'
      },
      {
        id: 'sq5_o4',
        text: '先向避难所的负责人报告，由他们来评估决定',
        score: 90,
        feedback: '非常稳妥的做法！',
        consequences: '负责人联系了救援指挥部，确认了那条路线确实危险，禁止大家前往。'
      }
    ],
    hint: '灾难环境中，官方渠道的信息最可靠，不要盲目行动。'
  },
  {
    id: 'sq6',
    scenarioId: 's2',
    order: 1,
    situation: '你发现自己迷路了，手机没有信号，天开始变暗，周围是茂密的原始森林。你背着一个登山包，里面有一些基本装备。',
    question: '你的第一个决策应该是什么？',
    options: [
      {
        id: 'sq6_o1',
        text: '凭感觉往一个方向走，尽快找到出路',
        score: 0,
        feedback: '这是最糟糕的选择！',
        improvement: '迷路后盲目乱走只会让你更加迷失，甚至可能走到更危险的地方。',
        consequences: '你走了几个小时，发现自己回到了原点，体力消耗巨大。'
      },
      {
        id: 'sq6_o2',
        text: '停下来，保持冷静，评估当前状况',
        score: 100,
        feedback: '非常正确！冷静是生存的第一要素。',
        consequences: '你找了一个相对开阔的地方坐下，深呼吸，冷静地回忆走过的路线。'
      },
      {
        id: 'sq6_o3',
        text: '大声呼喊，希望同伴能听到',
        score: 40,
        feedback: '可以尝试，但不是最优选择。',
        improvement: '呼喊会消耗体力，而且在森林中声音传播距离有限。',
        consequences: '你喊了很久，嗓子都哑了，但没有得到任何回应。'
      },
      {
        id: 'sq6_o4',
        text: '立即爬树，观察周围地形',
        score: 60,
        feedback: '有一定帮助，但要注意安全。',
        improvement: '爬树有跌落风险，而且如果周围都是大树，视野仍然受限。',
        consequences: '你爬上一棵大树，看到远处有山峰，但不确定该往哪个方向走。'
      }
    ],
    hint: '迷路后的第一原则是：停、思、观，不要乱跑。'
  },
  {
    id: 'sq7',
    scenarioId: 's2',
    order: 2,
    situation: '你意识到自己确实迷路了。天色越来越暗，气温开始下降。你检查背包，发现有：打火机、多功能刀、急救包、一根50米长的绳子、一件薄雨衣、一小包压缩饼干、一个空水瓶。',
    question: '你应该优先做什么？',
    options: [
      {
        id: 'sq7_o1',
        text: '立刻出发，趁着还有点光赶路',
        score: 10,
        feedback: '这是非常危险的。',
        improvement: '夜间在不熟悉的森林中行走，很容易摔倒受伤或遇到危险动物。',
        consequences: '你在黑暗中行走，不慎摔下一个陡坡，腿部受伤。'
      },
      {
        id: 'sq7_o2',
        text: '找一个合适的地点搭建临时庇护所',
        score: 100,
        feedback: '非常正确的决策！',
        consequences: '你找到了一棵有低垂树枝的大树，利用树枝和雨衣搭建了一个能遮风挡雨的简易庇护所。'
      },
      {
        id: 'sq7_o3',
        text: '先生火取暖并发出求救信号',
        score: 80,
        feedback: '火很重要，但应该先有庇护所。',
        consequences: '你成功生起了火，但突然下起了小雨，你没有地方躲避，浑身湿透。'
      },
      {
        id: 'sq7_o4',
        text: '先找水源，解决饮水问题',
        score: 60,
        feedback: '水很重要，但不是此刻最紧急的。',
        improvement: '夜间找水危险，而且在当前环境下，失温比缺水更致命。',
        consequences: '你找到了一条小溪，但天完全黑了，你找不到回来的路。'
      }
    ],
    hint: '野外生存的优先级是：庇护所 > 火 > 水 > 食物。'
  },
  {
    id: 'sq8',
    scenarioId: 's2',
    order: 3,
    situation: '第二天早上，你需要找到水源。你记得一些找水的知识，周围有不同的地形特征。',
    question: '你应该向哪个方向寻找水源？',
    options: [
      {
        id: 'sq8_o1',
        text: '向高处的山顶走',
        score: 10,
        feedback: '错误的方向。',
        improvement: '水往低处流，高处很难找到水源。',
        consequences: '你爬到山顶，累得气喘吁吁，但没有找到任何水源。'
      },
      {
        id: 'sq8_o2',
        text: '沿着低洼的山谷走',
        score: 100,
        feedback: '非常正确！',
        consequences: '你沿着山谷向下走了约20分钟，听到了潺潺的流水声，找到了一条清澈的小溪。'
      },
      {
        id: 'sq8_o3',
        text: '观察鸟类飞行方向，跟着鸟走',
        score: 70,
        feedback: '有一定科学依据，但不是最可靠的。',
        improvement: '鸟类早晚可能会飞向水源，但方向不一定稳定。',
        consequences: '你跟着一群鸟走了一段时间，确实找到了水源，但走了不少冤枉路。'
      },
      {
        id: 'sq8_o4',
        text: '寻找茂盛的绿色植被区域',
        score: 80,
        feedback: '很好的判断方法！',
        consequences: '你发现远处有一片格外翠绿的植被，走过去后发现了一处泉水。'
      }
    ],
    hint: '水往低处流，山谷和低地是寻找水源的最佳方向。'
  },
  {
    id: 'sq9',
    scenarioId: 's2',
    order: 4,
    situation: '你找到了水源，喝了足够的水。现在你需要想办法发出求救信号。你看到远处的山坡上有一片开阔地。',
    question: '以下哪种求救方式最有效？',
    options: [
      {
        id: 'sq9_o1',
        text: '持续大声呼喊求救',
        score: 20,
        feedback: '效率很低。',
        improvement: '人的声音传播距离有限，而且持续呼喊会消耗大量体力和水分。',
        consequences: '你喊了几个小时，嗓子都哑了，但没有人听到。'
      },
      {
        id: 'sq9_o2',
        text: '在开阔地用石头或树枝摆出SOS字样',
        score: 90,
        feedback: '非常好的方法！',
        consequences: '你花了一个小时，在开阔地上摆出了大大的SOS字样，等待空中救援发现。'
      },
      {
        id: 'sq9_o3',
        text: '在开阔地生三堆火，呈三角形排列',
        score: 100,
        feedback: '这是国际通用的求救信号！',
        consequences: '你生起了三堆火，浓烟升到高空。几小时后，一架救援直升机发现了你的信号，成功救援。'
      },
      {
        id: 'sq9_o4',
        text: '用镜子（或刀面）反射阳光',
        score: 80,
        feedback: '白天很有效的方法，但有局限性。',
        improvement: '这种方法只能在晴天有阳光时使用，而且需要对准救援飞机的方向。',
        consequences: '你用刀面反射阳光，成功引起了远处一架飞机的注意。'
      }
    ],
    hint: '国际通用的求救信号：三堆火呈三角形，或三次声响/三次闪光。'
  },
  {
    id: 'sq10',
    scenarioId: 's2',
    order: 5,
    situation: '第三天，救援还没有到。你的食物已经吃完了，周围有一些野果和蘑菇，你需要判断哪些可以吃。',
    question: '关于野外觅食，你应该遵循什么原则？',
    options: [
      {
        id: 'sq10_o1',
        text: '颜色鲜艳的蘑菇不能吃，朴素颜色的可以吃',
        score: 20,
        feedback: '这是一个常见的误区！',
        improvement: '很多有毒蘑菇颜色朴素，而一些可食用蘑菇颜色鲜艳。不能仅凭颜色判断。',
        consequences: '你吃了一些看起来"安全"的白蘑菇，结果食物中毒，上吐下泻。'
      },
      {
        id: 'sq10_o2',
        text: '只要是动物吃过的果子，人就可以吃',
        score: 30,
        feedback: '这是非常危险的误区！',
        improvement: '很多动物能吃的植物对人类是有毒的。',
        consequences: '你看到松鼠在吃一种坚果，也跟着吃了，结果舌头发麻、头晕。'
      },
      {
        id: 'sq10_o3',
        text: '除非100%确定，否则绝对不吃不认识的野生植物',
        score: 100,
        feedback: '这是最安全的原则！',
        consequences: '你强忍着饥饿，没有吃不认识的野果和蘑菇。当天下午，救援队伍终于找到了你。'
      },
      {
        id: 'sq10_o4',
        text: '先小量尝试，观察2小时有无反应',
        score: 70,
        feedback: '这是万不得已时的做法，有一定风险。',
        improvement: '这种方法也不是100%安全，有些毒素可能延迟发作或累积中毒。',
        consequences: '你尝试了少量野果，2小时后没有反应，于是吃了一些，暂时缓解了饥饿。'
      }
    ],
    hint: '野外觅食的黄金法则：当有疑问时，就不要吃！'
  },
  {
    id: 'sq11',
    scenarioId: 's3',
    order: 1,
    situation: '你被困在高速公路上，暴雪还在继续，能见度不足10米。前后都有大量车辆被困，根本无法移动。你的车还有大半箱油，电量充足。',
    question: '你应该怎么做？',
    options: [
      {
        id: 'sq11_o1',
        text: '弃车步行，尝试走到最近的服务区',
        score: 0,
        feedback: '这是致命的错误！',
        improvement: '暴风雪中步行很容易迷失方向，体温会快速下降，几分钟就可能失温。',
        consequences: '你下车走了不到50米，就迷失了方向，很快就失去了意识。'
      },
      {
        id: 'sq11_o2',
        text: '留在车内，关闭车窗，保持密封',
        score: 80,
        feedback: '基本正确，但还要注意通风。',
        consequences: '你留在车内，但由于长时间关窗，空气逐渐变得浑浊，你感到头晕。'
      },
      {
        id: 'sq11_o3',
        text: '留在车内，车窗留一条小缝通风，每隔一段时间发动车辆取暖',
        score: 100,
        feedback: '非常正确的做法！',
        consequences: '你留在车内，车窗留了一条缝隙防止一氧化碳中毒，每隔半小时发动车辆10分钟取暖。'
      },
      {
        id: 'sq11_o4',
        text: '一直开着发动机和暖气，保持车内温暖',
        score: 50,
        feedback: '这样有很大风险。',
        improvement: '长时间怠速可能导致一氧化碳中毒，也会耗尽燃油。',
        consequences: '你一直开着暖气，几小时后燃油耗尽，车内温度开始急剧下降。'
      }
    ],
    hint: '车辆被困暴风雪中，待在车里是最安全的，但要注意通风和合理使用燃油。'
  },
  {
    id: 'sq12',
    scenarioId: 's3',
    order: 2,
    situation: '你注意到前面的车里有一位老人在挥手呼救，他说他的车电瓶没电了，无法发动，而且他有心脏病，感觉身体不适。',
    question: '你应该如何帮助他？',
    options: [
      {
        id: 'sq12_o1',
        text: '立即下车，冒着风雪跑过去帮助他',
        score: 30,
        feedback: '你的精神可嘉，但方法危险。',
        improvement: '暴风雪中外出太危险，你可能自己也会出事。',
        consequences: '你在暴风雪中艰难前行，好不容易到达老人的车边，但自己已经冻得说不出话了。'
      },
      {
        id: 'sq12_o2',
        text: '按喇叭引起周围人的注意，一起想办法',
        score: 80,
        feedback: '很好的做法！',
        consequences: '你按喇叭引起了周围车辆的注意，大家一起商量出了一个安全的救援方案。'
      },
      {
        id: 'sq12_o3',
        text: '用你的车帮他搭电，注意做好防冻措施',
        score: 100,
        feedback: '专业且安全的做法！',
        consequences: '你让老人把车开到你车旁边（距离很近，可以互相传递东西），然后用搭电线成功帮他的车发动了。'
      },
      {
        id: 'sq12_o4',
        text: '让他拨打救援电话，你帮不了什么',
        score: 40,
        feedback: '你有些冷漠，其实你可以做得更多。',
        improvement: '在确保自身安全的前提下，应该尽可能帮助有需要的人。',
        consequences: '老人只能自己打电话求助，但救援可能需要很长时间才能到达。'
      }
    ],
    hint: '帮助别人的前提是确保自己的安全。'
  },
  {
    id: 'sq13',
    scenarioId: 's3',
    order: 3,
    situation: '被困12小时后，雪还在下。你车里有：两瓶500ml矿泉水、半包饼干、一个急救包、一条毛毯、一部手机（还有50%电量）、一个打火机。',
    question: '你应该如何使用手机？',
    options: [
      {
        id: 'sq13_o1',
        text: '不停地刷手机，看新闻了解灾情',
        score: 0,
        feedback: '非常错误的做法！',
        improvement: '这样会很快耗尽电量，在关键时刻无法使用。',
        consequences: '你的手机电量很快耗尽，当救援队伍试图联系你时，无法接通。'
      },
      {
        id: 'sq13_o2',
        text: '立即关机，只在需要联系外界时开机使用',
        score: 100,
        feedback: '非常正确的节电策略！',
        consequences: '你关闭了手机，只在每隔2小时开机查看信号和拨打救援电话，电量可以维持很长时间。'
      },
      {
        id: 'sq13_o3',
        text: '开启省电模式，降低屏幕亮度',
        score: 80,
        feedback: '不错的做法，但还可以更极端。',
        consequences: '手机电量可以维持更久，但如果被困时间超过预期，仍有可能耗尽。'
      },
      {
        id: 'sq13_o4',
        text: '一直拨打救援电话，直到打通为止',
        score: 30,
        feedback: '这会快速耗尽电量。',
        improvement: '应该间隔一段时间尝试一次，不要连续拨打。',
        consequences: '你不停地拨打电话，但线路一直忙，电量很快耗尽了。'
      }
    ],
    hint: '紧急情况下，手机电量是宝贵的资源，必须节约使用。'
  },
  {
    id: 'sq14',
    scenarioId: 's3',
    order: 4,
    situation: '被困18小时，你感到有些无聊和焦虑。旁边车上的司机邀请你一起喝酒打发时间，他说车里有几瓶白酒。',
    question: '你应该怎么做？',
    options: [
      {
        id: 'sq14_o1',
        text: '接受邀请，喝一点酒暖暖身子、打发时间',
        score: 0,
        feedback: '这是非常危险的！',
        improvement: '喝酒会扩张血管，加速体温流失，还会影响判断力，是极端环境下的大忌。',
        consequences: '你喝了酒后感觉浑身发热，但很快体温开始快速下降，意识也变得模糊。'
      },
      {
        id: 'sq14_o2',
        text: '礼貌拒绝，但可以和他聊天解闷',
        score: 100,
        feedback: '非常明智的选择！',
        consequences: '你拒绝了喝酒的邀请，但通过车窗和他聊天，互相鼓励，缓解了焦虑情绪。'
      },
      {
        id: 'sq14_o3',
        text: '直接拒绝，不和他有任何交流',
        score: 50,
        feedback: '虽然保证了安全，但可以做得更好。',
        improvement: '在被困的环境中，保持良好的心态也很重要，与人交流有助于缓解压力。',
        consequences: '你独自待在车里，时间长了感到越来越焦虑和恐惧。'
      },
      {
        id: 'sq14_o4',
        text: '只喝一点点，意思一下',
        score: 20,
        feedback: '即使少量也有风险。',
        improvement: '酒精对身体的影响是累积的，哪怕一点点也会影响你的判断能力。',
        consequences: '你只喝了一小口，但还是感到有些头晕，反应变慢了。'
      }
    ],
    hint: '极端环境下绝对不能饮酒，酒精会加速失温，影响判断力。'
  },
  {
    id: 'sq15',
    scenarioId: 's3',
    order: 5,
    situation: '被困24小时，救援车辆终于到达。工作人员开始疏散被困人员，但需要步行1公里到临时安置点，外面雪还在下，天气非常寒冷。',
    question: '在出发前，你应该做什么准备？',
    options: [
      {
        id: 'sq15_o1',
        text: '什么都不用带，赶紧上车最重要',
        score: 10,
        feedback: '这是不明智的。',
        improvement: '你应该带上必要的保暖物品和水，以防路上发生意外。',
        consequences: '你没有带任何东西就出发了，走到半路感到又冷又渴，非常难受。'
      },
      {
        id: 'sq15_o2',
        text: '带上毛毯、水和剩余的食物，做好保暖措施',
        score: 100,
        feedback: '准备充分，非常正确！',
        consequences: '你用毛毯把自己裹得严严实实，带上水和食物，在救援人员的带领下安全到达了安置点。'
      },
      {
        id: 'sq15_o3',
        text: '把车内所有贵重物品都带上',
        score: 40,
        feedback: '重点错了。',
        improvement: '这种情况下，生命安全最重要，财物应该放在次要位置。',
        consequences: '你拎了好几个袋子，行动不便，走得很慢，差点跟不上队伍。'
      },
      {
        id: 'sq15_o4',
        text: '先活动身体，做好热身再出发',
        score: 90,
        feedback: '很好的准备工作！',
        consequences: '你在车内做了一些简单的热身运动，活动开了筋骨，走起来不那么容易受伤。'
      }
    ],
    hint: '撤离时要带上必要的生存物资，但不要被财物所累。'
  },
  {
    id: 'sq16',
    scenarioId: 's4',
    order: 1,
    situation: '城市内涝严重，水电中断，你知道可能需要7天才能恢复。你家里储存了一些物资，现在需要清点和规划。',
    question: '你首先应该做什么？',
    options: [
      {
        id: 'sq16_o1',
        text: '立即开始大量消耗食物，反正放久了也会坏',
        score: 0,
        feedback: '这是非常短视的行为！',
        improvement: '物资必须有计划地使用，否则后面会陷入困境。',
        consequences: '前几天你们吃得很好，但后面几天只能饿肚子了。'
      },
      {
        id: 'sq16_o2',
        text: '清点所有物资，按7天需求量进行分配',
        score: 100,
        feedback: '非常正确的做法！',
        consequences: '你清点了家里的食物、饮用水和药品，按7天时间做了详细的分配计划。'
      },
      {
        id: 'sq16_o3',
        text: '把门窗都封死，防止洪水进入',
        score: 70,
        feedback: '有必要，但不是最紧急的。',
        improvement: '先了解自己有多少物资，再考虑其他问题。',
        consequences: '你花了很多时间封门窗，但还没来得及清点物资。'
      },
      {
        id: 'sq16_o4',
        text: '打电话向亲戚朋友求助',
        score: 50,
        feedback: '可以做，但不能指望别人。',
        improvement: '这种情况大家都可能遇到困难，要先做好自救准备。',
        consequences: '你打了几个电话，但朋友们也都在为物资发愁，帮不上什么忙。'
      }
    ],
    hint: '凡事预则立，先清点物资，做好计划。'
  },
  {
    id: 'sq17',
    scenarioId: 's4',
    order: 2,
    situation: '你家住在5楼，洪水已经涨到了2楼。你的物资中，饮用水相对紧张，只有3桶5升的瓶装水，而你家有3口人。',
    question: '你应该如何分配饮用水？',
    options: [
      {
        id: 'sq17_o1',
        text: '每人每天1升，保证基本需求',
        score: 100,
        feedback: '非常合理的分配！',
        consequences: '你严格按照每人每天1升的标准分配，15升水正好可以使用5天，剩下2天可以收集雨水补充。'
      },
      {
        id: 'sq17_o2',
        text: '想喝就喝，反正只是7天',
        score: 20,
        feedback: '这是不负责任的做法。',
        improvement: '如果不加节制，水会很快用完，而恢复供水的时间可能比预期更长。',
        consequences: '你们毫不节制地用水，第4天就把水喝完了，后面只能喝不太干净的雨水。'
      },
      {
        id: 'sq17_o3',
        text: '优先保证孩子喝水，大人尽量少喝',
        score: 80,
        feedback: '体现了对孩子的关爱，但也要注意大人的健康。',
        improvement: '大人也需要足够的水来维持健康，否则会生病，反而更麻烦。',
        consequences: '你和妻子尽量少喝水，把水留给孩子，但到第5天你们都感到严重脱水。'
      },
      {
        id: 'sq17_o4',
        text: '用容器收集雨水，作为补充水源',
        score: 90,
        feedback: '非常好的开源措施！',
        consequences: '你用盆和桶收集雨水，经过简单过滤和煮沸后使用，大大节约了瓶装水。'
      }
    ],
    hint: '成年人每天至少需要1.5升水，紧急情况下最少不能低于500毫升。'
  },
  {
    id: 'sq18',
    scenarioId: 's4',
    order: 3,
    situation: '停水已经3天了，马桶无法冲水，家里的气味越来越难闻。你需要想办法解决卫生问题。',
    question: '以下哪种做法最合理？',
    options: [
      {
        id: 'sq18_o1',
        text: '用宝贵的饮用水冲马桶',
        score: 10,
        feedback: '太浪费了！',
        improvement: '饮用水是用来喝的，冲马桶应该用其他水。',
        consequences: '你用了很多饮用水冲马桶，导致饮水更加紧张。'
      },
      {
        id: 'sq18_o2',
        text: '用收集的雨水或洗完手的水冲马桶',
        score: 100,
        feedback: '非常好的节水方法！',
        consequences: '你专门准备了一个桶，收集各种用过的废水用来冲马桶，既解决了卫生问题，又节约了饮用水。'
      },
      {
        id: 'sq18_o3',
        text: '干脆不用马桶，使用塑料袋',
        score: 60,
        feedback: '可以作为应急方法，但不是长久之计。',
        improvement: '塑料袋处理不当会造成环境污染，而且不如马桶卫生。',
        consequences: '你们用塑料袋解决问题，但气味问题没有根本解决，而且塑料袋的处理也成了问题。'
      },
      {
        id: 'sq18_o4',
        text: '定期在马桶和下水道口倒入少量消毒水，防止异味和病菌',
        score: 90,
        feedback: '很重要的卫生措施！',
        consequences: '你定期用消毒水消毒，有效防止了异味和病菌滋生。'
      }
    ],
    hint: '要学会"一水多用"，珍惜每一滴水。'
  },
  {
    id: 'sq19',
    scenarioId: 's4',
    order: 4,
    situation: '停电已经4天了，冰箱里的食物开始变质。你需要判断哪些食物还能吃，哪些必须丢弃。',
    question: '关于停电后的食品安全，以下哪种说法是正确的？',
    options: [
      {
        id: 'sq19_o1',
        text: '只要闻着没有异味，食物就可以吃',
        score: 20,
        feedback: '非常危险的误区！',
        improvement: '很多致病细菌是没有异味的，不能仅凭气味判断。',
        consequences: '你吃了一些看起来和闻起来都正常的食物，结果食物中毒，上吐下泻。'
      },
      {
        id: 'sq19_o2',
        text: '停电超过4小时，冰箱里的所有食物都不能吃了',
        score: 40,
        feedback: '太绝对了。',
        improvement: '如果冰箱门没有频繁打开，冷冻室的食物可以保存更久。',
        consequences: '你丢弃了很多其实还可以食用的食物，造成了不必要的浪费。'
      },
      {
        id: 'sq19_o3',
        text: '冷藏室食物在停电24小时内还能吃，冷冻室48小时内还能吃（不常开门的情况下）',
        score: 100,
        feedback: '正确的判断标准！',
        consequences: '你按照这个原则，合理处理了冰箱里的食物，既保证了安全，又避免了浪费。'
      },
      {
        id: 'sq19_o4',
        text: '把所有食物都煮熟了就可以安全食用',
        score: 50,
        feedback: '不完全正确。',
        improvement: '有些细菌产生的毒素即使经过高温烹煮也无法破坏。',
        consequences: '你把变质的食物煮熟后吃了，还是食物中毒了。'
      }
    ],
    hint: '当对食物安全有疑问时，记住：当有疑问，就扔掉！'
  },
  {
    id: 'sq20',
    scenarioId: 's4',
    order: 5,
    situation: '第7天，水位开始退去，但恢复水电可能还需要几天。有邻居说附近有商店在高价卖水和食物，是平时价格的10倍。',
    question: '你应该怎么做？',
    options: [
      {
        id: 'sq20_o1',
        text: '立即去买，不管多贵',
        score: 30,
        feedback: '不够理性。',
        improvement: '先评估自己的物资还能撑多久，再决定是否购买。',
        consequences: '你花了很多钱买了水和食物，但其实你的储备还够用3天。'
      },
      {
        id: 'sq20_o2',
        text: '先检查自己的物资储备，再做决定',
        score: 100,
        feedback: '非常理性的决策！',
        consequences: '你清点了物资，发现还能撑2天，于是买了少量物资作为补充，没有被过度宰割。'
      },
      {
        id: 'sq20_o3',
        text: '坚决不买，这种发国难财的商家不能惯着',
        score: 50,
        feedback: '有骨气，但也要考虑实际情况。',
        improvement: '原则很重要，但也要保证家人的基本生存需求。',
        consequences: '你坚决不买高价物资，但第8天你的水就喝完了，处境艰难。'
      },
      {
        id: 'sq20_o4',
        text: '向社区或有关部门举报这种哄抬物价的行为',
        score: 90,
        feedback: '维护市场秩序，值得肯定！',
        consequences: '你向市场监管部门举报了这家商店，他们很快就被查处了，物价恢复了正常。'
      }
    ],
    hint: '在保证基本生存的前提下，也要维护自己的合法权益。'
  },
  {
    id: 'sq21',
    scenarioId: 's5',
    order: 1,
    situation: '你的朋友从约2米高的地方摔下来，躺在地上痛苦呻吟，左腿小腿明显变形，大腿外侧有一个约10厘米长的伤口正在流血。',
    question: '你应该首先做什么？',
    options: [
      {
        id: 'sq21_o1',
        text: '立即把朋友扶起来，背到山下',
        score: 0,
        feedback: '这是致命的错误！',
        improvement: '怀疑有骨折时绝对不能随意移动伤者，可能造成二次损伤，甚至截瘫。',
        consequences: '你强行扶起朋友，他的骨折断端刺穿了血管和神经，造成了永久性损伤。'
      },
      {
        id: 'sq21_o2',
        text: '立即拨打急救电话，然后检查伤者的意识和呼吸',
        score: 100,
        feedback: '非常正确的急救流程！',
        consequences: '你立即拨打了120，然后检查发现朋友意识清醒，呼吸正常，没有生命危险。'
      },
      {
        id: 'sq21_o3',
        text: '先处理流血的伤口，再打电话',
        score: 60,
        feedback: '有一定道理，但顺序不对。',
        improvement: '应该先拨打急救电话，让专业救援尽快出发，然后再处理伤口。',
        consequences: '你花了15分钟处理伤口，才想起打电话，耽误了宝贵的救援时间。'
      },
      {
        id: 'sq21_o4',
        text: '跑去找人帮忙，留下伤者一人',
        score: 30,
        feedback: '这是不负责任的做法。',
        improvement: '不能让伤者独自留在原地，他可能因为疼痛或失血休克。',
        consequences: '你跑去找人，等你回来时，朋友已经因为失血过多休克了。'
      }
    ],
    hint: '急救的原则是：先打急救电话，然后检查生命体征，最后处理伤情。'
  },
  {
    id: 'sq22',
    scenarioId: 's5',
    order: 2,
    situation: '你已经拨打了急救电话，现在需要处理朋友的伤口。他的大腿伤口还在流血，血液呈暗红色，持续流出。',
    question: '你应该如何止血？',
    options: [
      {
        id: 'sq22_o1',
        text: '用干净的布料直接按压伤口',
        score: 100,
        feedback: '最正确有效的止血方法！',
        consequences: '你用急救包中的无菌纱布紧紧按压在伤口上，几分钟后，流血明显减少了。'
      },
      {
        id: 'sq22_o2',
        text: '在伤口上方用绳子绑紧止血带',
        score: 40,
        feedback: '止血带一般用于肢体严重出血，不是这种情况的首选。',
        improvement: '止血带使用不当可能导致肢体坏死，应该在直接按压无效时才考虑。',
        consequences: '你绑上了止血带，血止住了，但由于绑的时间太长，腿部肌肉坏死了。'
      },
      {
        id: 'sq22_o3',
        text: '用草药或泥土敷在伤口上',
        score: 10,
        feedback: '非常危险的做法！',
        improvement: '这会导致严重感染，应该用干净的敷料覆盖伤口。',
        consequences: '你在伤口上敷了草药，结果伤口严重感染，差点要了朋友的命。'
      },
      {
        id: 'sq22_o4',
        text: '抬高伤肢，同时按压伤口',
        score: 90,
        feedback: '很好的结合！',
        consequences: '你让朋友保持平躺，抬高他受伤的腿超过心脏位置，同时按压伤口，止血效果非常好。'
      }
    ],
    hint: '大多数外伤出血都可以通过直接按压有效止血。'
  },
  {
    id: 'sq23',
    scenarioId: 's5',
    order: 3,
    situation: '伤口的流血基本止住了。你怀疑朋友的左腿有骨折，需要进行固定处理。你有急救包，里面有夹板和绷带。',
    question: '关于骨折固定，以下哪种做法是正确的？',
    options: [
      {
        id: 'sq23_o1',
        text: '试图把变形的小腿拉直复位',
        score: 0,
        feedback: '绝对禁止！',
        improvement: '非专业人员不要尝试复位骨折，可能造成二次损伤。',
        consequences: '你试图拉直小腿，朋友痛得昏了过去，骨折断端刺穿了更多组织。'
      },
      {
        id: 'sq23_o2',
        text: '保持骨折部位的原样，用夹板固定伤处上下两个关节',
        score: 100,
        feedback: '非常正确的做法！',
        consequences: '你小心地将夹板放在小腿两侧，固定了膝关节和踝关节，避免了骨折部位的移动。'
      },
      {
        id: 'sq23_o3',
        text: '只固定骨折的部位即可',
        score: 50,
        feedback: '不全面。',
        improvement: '只固定骨折部位，关节的活动仍然会导致骨折断端移动。',
        consequences: '你只固定了小腿中间，但朋友稍微一动，骨折处就剧烈疼痛。'
      },
      {
        id: 'sq23_o4',
        text: '如果没有夹板，可以用树枝、杂志等硬物临时替代',
        score: 90,
        feedback: '正确的应急方法！',
        consequences: '你找了两根结实的树枝，用绷带绑在小腿两侧，起到了很好的固定作用。'
      }
    ],
    hint: '骨折固定的原则是：不复位、超关节、固定牢。'
  },
  {
    id: 'sq24',
    scenarioId: 's5',
    order: 4,
    situation: '朋友因为疼痛和惊吓，脸色苍白，出冷汗，呼吸急促，说自己感到头晕、恶心。你意识到他可能出现了休克。',
    question: '针对休克，你应该如何处理？',
    options: [
      {
        id: 'sq24_o1',
        text: '让他坐起来，给他喝水',
        score: 20,
        feedback: '这是错误的做法！',
        improvement: '休克时应该让伤者平躺，抬高下肢，不要喂水（可能需要手术）。',
        consequences: '你让朋友坐起来，他立刻感到眼前一黑，昏了过去。'
      },
      {
        id: 'sq24_o2',
        text: '让他平躺，下肢抬高约20-30厘米，注意保暖',
        score: 100,
        feedback: '标准的休克处理方法！',
        consequences: '你让朋友平躺，用背包垫在他的脚下，盖上保温毯，他的情况慢慢稳定了下来。'
      },
      {
        id: 'sq24_o3',
        text: '让他保持清醒，不要睡觉',
        score: 70,
        feedback: '有一定道理，但不是最核心的。',
        improvement: '保持呼吸道通畅和维持血液循环更重要。',
        consequences: '你一直和朋友说话，不让他睡着，但他的休克症状没有得到明显缓解。'
      },
      {
        id: 'sq24_o4',
        text: '密切观察他的意识、呼吸和脉搏变化',
        score: 90,
        feedback: '非常重要的监测工作！',
        consequences: '你每隔几分钟就检查一次朋友的生命体征，及时向急救人员报告了情况。'
      }
    ],
    hint: '休克处理的关键是：平躺、抬腿、保暖、不喂水。'
  },
  {
    id: 'sq25',
    scenarioId: 's5',
    order: 5,
    situation: '急救人员终于到达现场，准备将朋友送往医院。他们需要了解情况，同时让你签署一些文件。',
    question: '在医护人员到达后，你应该怎么做？',
    options: [
      {
        id: 'sq25_o1',
        text: '你的任务完成了，可以离开了',
        score: 30,
        feedback: '这样有些不负责任。',
        improvement: '你应该向医护人员说明你所做的处理，并联系伤者家属。',
        consequences: '你默默离开了，医护人员不了解情况，可能影响治疗。'
      },
      {
        id: 'sq25_o2',
        text: '向医护人员详细说明受伤经过和你所做的急救处理',
        score: 100,
        feedback: '非常专业的做法！',
        consequences: '你详细说明了受伤经过和处理过程，医护人员掌握了第一手资料，能够更好地进行治疗。'
      },
      {
        id: 'sq25_o3',
        text: '联系伤者的家属或紧急联系人',
        score: 90,
        feedback: '很重要的人文关怀！',
        consequences: '你联系了朋友的家人，他们正在赶往医院的路上，朋友也安心了很多。'
      },
      {
        id: 'sq25_o4',
        text: '把你的急救包送给伤者，让他带到医院去',
        score: 70,
        feedback: '你的慷慨值得称赞，但不是必须的。',
        improvement: '医院有专业的医疗设备，更重要的是提供信息和联系家属。',
        consequences: '你把急救包送给了朋友，虽然医院不需要，但你的心意让朋友很感动。'
      }
    ],
    hint: '急救结束后，要做好交接工作，提供准确的信息。'
  }
]

export const exchangeItems: ExchangeItem[] = [
  {
    id: 'ex1',
    type: 'skill',
    userId: 'u1',
    userName: '野外生存达人',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=survival',
    title: '教授野外取火和水源净化技能',
    description: '本人有10年野外生存经验，精通各种取火方法（钻木取火、火石取火、凸透镜取火等），以及野外寻找和净化水源的专业技能。可以教授理论知识和实际操作。',
    category: '野外生存',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bushcraft%20fire%20making%20survival%20skill%20teaching&image_size=square_hd'
    ],
    experienceLevel: 'advanced',
    location: '北京',
    exchangePreference: '希望交换急救医疗知识或户外装备',
    availability: '周末全天，工作日晚上',
    tags: ['取火', '水源净化', '野外生存', '技能教学'],
    views: 245,
    requests: 8,
    status: 'open',
    createdAt: '2024-05-10 14:30'
  },
  {
    id: 'ex2',
    type: 'equipment',
    userId: 'u2',
    userName: '装备升级中',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gear',
    title: '9成新专业急救包（200件）交换',
    description: '闲置的专业急救包，包含200件急救用品，之前徒步用的，现在装备升级换下来的。物品齐全，有效期都在保质期内。',
    category: '急救医疗',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=first%20aid%20kit%20medical%20supplies%20exchange&image_size=square_hd'
    ],
    condition: 'excellent',
    location: '上海',
    exchangePreference: '想换一个好点的登山包或净水器',
    availability: '工作日下班后可面交',
    tags: ['急救包', '医疗用品', '急救医疗', '装备交换'],
    views: 178,
    requests: 5,
    status: 'open',
    createdAt: '2024-05-15 09:20'
  },
  {
    id: 'ex3',
    type: 'skill',
    userId: 'u3',
    userName: '急救培训师',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=firstaid',
    title: '专业急救和CPR培训',
    description: '持证急救培训师，可提供专业的急救培训，包括CPR心肺复苏、外伤处理、骨折固定、中暑冻伤处理等。有完整的培训教具。',
    category: '急救医疗',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CPR%20first%20aid%20training%20medical%20course&image_size=square_hd'
    ],
    experienceLevel: 'advanced',
    location: '广州',
    exchangePreference: '交换野外生存技能或导航知识',
    availability: '需提前预约',
    tags: ['急救', 'CPR', '医疗培训', '技能交换'],
    views: 312,
    requests: 12,
    status: 'open',
    createdAt: '2024-05-18 16:45'
  },
  {
    id: 'ex4',
    type: 'equipment',
    userId: 'u4',
    userName: '徒步爱好者',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hiker',
    title: '9成新镁棒打火石套装',
    description: '之前买的打火石套装，现在装备升级换了更好的。用过几次，功能完好，可产生3000℃高温火花。',
    category: '取火工具',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=magnesium%20fire%20starter%20flint%20rod%20bushcraft%20tool&image_size=square_hd'
    ],
    condition: 'good',
    location: '深圳',
    exchangePreference: '想换一把好的生存刀或多功能工具',
    availability: '周末可约面交',
    tags: ['打火石', '取火工具', '野外生存', '装备交换'],
    views: 156,
    requests: 4,
    status: 'open',
    createdAt: '2024-05-17 11:30'
  },
  {
    id: 'ex5',
    type: 'skill',
    userId: 'u5',
    userName: '导航专家',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=navigator',
    title: '地图与指南针导航教学',
    description: '精通地形图阅读、指南针使用、地形定位、导航定位、自然导航（太阳、星星、植物辨向）等。可以教授理论和实践。',
    category: '野外生存',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=map%20compass%20navigation%20orienteering%20survival%20skill&image_size=square_hd'
    ],
    experienceLevel: 'advanced',
    location: '成都',
    exchangePreference: '交换取火技能或急救培训',
    availability: '周末可安排户外实践教学',
    tags: ['导航', '地图', '指南针', '野外生存'],
    views: 189,
    requests: 6,
    status: 'open',
    createdAt: '2024-05-20 11:15'
  },
  {
    id: 'ex6',
    type: 'equipment',
    userId: 'u6',
    userName: '露营装备控',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=camping',
    title: '双人专业帐篷（3季）交换',
    description: '购买了新款帐篷，旧的处理。这款帐篷是牧高笛的冷山2，3季帐，使用了5次左右，功能完好，无破损。',
    category: '户外装备',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=camping%20tent%20outdoor%20gear%20hiking%20equipment&image_size=square_hd'
    ],
    condition: 'good',
    location: '杭州',
    exchangePreference: '想换一个质量好的睡袋或者炉具',
    availability: '周末可约',
    tags: ['帐篷', '露营', '户外装备', '装备交换'],
    views: 267,
    requests: 9,
    status: 'open',
    createdAt: '2024-05-22 14:00'
  },
  {
    id: 'ex7',
    type: 'skill',
    userId: 'u7',
    userName: '植物学家',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=botanist',
    title: '野外可食用植物识别教学',
    description: '植物学专业背景，可教授常见的可食用野生植物识别、常见有毒植物鉴别、野菜采摘和食用方法。',
    category: '野外生存',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wild%20edible%20plants%20foraging%20botany%20survival&image_size=square_hd'
    ],
    experienceLevel: 'intermediate',
    location: '昆明',
    exchangePreference: '希望交换搭建庇护所的技能或工具',
    availability: '季节合适时可组织野外实践',
    tags: ['植物识别', '可食用植物', '野外生存', '觅食'],
    views: 356,
    requests: 15,
    status: 'open',
    createdAt: '2024-05-25 09:30'
  },
  {
    id: 'ex8',
    type: 'equipment',
    userId: 'u8',
    userName: '预备者小明',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=prepper',
    title: '全新手摇发电收音机',
    description: '全新未拆封的手摇发电收音机，同时支持太阳能和USB充电，具备手电筒、警报功能。多一台，想换其他应急装备。',
    category: '通讯设备',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hand%20crank%20radio%20emergency%20survival%20gear&image_size=square_hd'
    ],
    condition: 'new',
    location: '武汉',
    exchangePreference: '换大容量充电宝或多功能工具',
    availability: '随时可约',
    tags: ['收音机', '应急装备', '通讯设备', '装备交换'],
    views: 145,
    requests: 7,
    status: 'open',
    createdAt: '2024-05-28 16:20'
  },
  {
    id: 'ex9',
    type: 'skill',
    userId: 'u9',
    userName: '绳索达人',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=climber',
    title: '绳结和绳索技术教学',
    description: '攀岩爱好者，精通各种实用绳结打法、绳索捆绑技术、简单的攀岩和速降基础。可以教学。',
    category: '野外生存',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rope%20knots%20climbing%20knot%20tying%20outdoor%20skill&image_size=square_hd'
    ],
    experienceLevel: 'intermediate',
    location: '深圳',
    exchangePreference: '交换植物识别知识或急救培训',
    availability: '周末有时间',
    tags: ['绳结', '绳索技术', '攀岩', '野外生存'],
    views: 223,
    requests: 8,
    status: 'open',
    createdAt: '2024-06-01 10:45'
  }
]

export const exchangeRequests: ExchangeRequest[] = [
  {
    id: 'er1',
    exchangeItemId: 'ex1',
    requesterId: 'u10',
    requesterName: '想学生存的小白',
    requesterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1',
    contactInfo: '微信: xiaobai123',
    message: '非常想学野外取火技能，我可以教你摄影技巧作为交换。周末都有时间。',
    offerDetails: '可以教授人像摄影、风光摄影后期处理，或者带你去户外实践摄影。',
    status: 'pending',
    createdAt: '2024-05-12 10:30'
  },
  {
    id: 'er2',
    exchangeItemId: 'ex1',
    requesterId: 'u11',
    requesterName: '急救员小王',
    requesterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=medic',
    contactInfo: '电话: 138****5678',
    message: '你好，我是急救员，可以教你急救知识，想学习取火技能。',
    offerDetails: '提供完整的急救培训，包括CPR和外伤处理。',
    status: 'accepted',
    createdAt: '2024-05-13 15:20'
  },
  {
    id: 'er3',
    exchangeItemId: 'ex2',
    requesterId: 'u12',
    requesterName: '背包客小李',
    requesterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backpacker',
    contactInfo: '微信: backpacker_li',
    message: '我有一个9成新的40L登山包，可以交换你的急救包。',
    offerDetails: '登山包是 osprey 的，购买不到一年，保养很好。',
    status: 'pending',
    createdAt: '2024-05-16 09:45'
  }
]
