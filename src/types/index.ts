export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export type SurvivalScenario = 
  | 'urban' 
  | 'wilderness' 
  | 'vehicle' 
  | 'home' 
  | 'disaster' 
  | 'medical'

export interface KnowledgeItem {
  id: string
  title: string
  description: string
  level: DifficultyLevel
  scenario: SurvivalScenario
  category: string
  content: string
  imageUrl?: string
  videoUrl?: string
  estimatedTime: number
  quiz?: Quiz
  createdAt: string
}

export interface Quiz {
  id: string
  questions: QuizQuestion[]
  passingScore: number
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
}

export interface EquipmentCategory {
  id: string
  name: string
  icon: string
  description: string
}

export interface Equipment {
  id: string
  name: string
  categoryId: string
  brand: string
  price: number
  rating: number
  pros: string[]
  cons: string[]
  scenarios: SurvivalScenario[]
  valueScore: number
  imageUrl: string
  description: string
  specs: Record<string, string>
  reviews: EquipmentReview[]
  createdAt: string
}

export interface EquipmentReview {
  id: string
  equipmentId: string
  userId: string
  userName: string
  rating: number
  title: string
  content: string
  usageDuration: string
  createdAt: string
  verified: boolean
}

export interface ChecklistCategory {
  id: string
  name: string
  scenario: SurvivalScenario
  description: string
  icon: string
}

export interface ChecklistTemplate {
  id: string
  name: string
  categoryId: string
  description: string
  duration: string
  items: ChecklistItem[]
  icon: string
}

export interface ChecklistItem {
  id: string
  name: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  quantity: string
  notes?: string
}

export interface CommunityPost {
  id: string
  userId: string
  userName: string
  userAvatar: string
  title: string
  content: string
  category: 'experience' | 'discussion' | 'question' | 'regional'
  region?: string
  tags: string[]
  likes: number
  comments: number
  createdAt: string
  isEmergency?: boolean
}

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  likes: number
  createdAt: string
}

export interface SimulatorScenario {
  id: string
  name: string
  description: string
  scenario: SurvivalScenario
  difficulty: DifficultyLevel
  duration: string
  icon: string
  imageUrl: string
  totalQuestions: number
}

export interface SimulatorQuestion {
  id: string
  scenarioId: string
  order: number
  situation: string
  question: string
  options: SimulatorOption[]
  hint?: string
}

export interface SimulatorOption {
  id: string
  text: string
  score: number
  feedback: string
  improvement?: string
  consequences: string
}

export interface SimulatorSubmission {
  scenarioId: string
  answers: {
    questionId: string
    optionId: string
  }[]
}

export interface SimulatorAnswerResult {
  questionId: string
  userOptionId: string
  bestOptionId: string
  score: number
  maxScore: number
  feedback: string
  improvement?: string
  userChoice: string
  bestChoice: string
  consequences: string
}

export interface SimulatorResult {
  scenarioId: string
  scenarioName: string
  totalScore: number
  maxScore: number
  percentage: number
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F'
  survivalRating: string
  answers: SimulatorAnswerResult[]
  overallFeedback: string
  improvementTips: string[]
}

export type ExchangeItemType = 'skill' | 'equipment'

export type ExchangeStatus = 'open' | 'pending' | 'completed' | 'cancelled'

export interface ExchangeItem {
  id: string
  type: ExchangeItemType
  userId: string
  userName: string
  userAvatar: string
  title: string
  description: string
  category: string
  images: string[]
  condition?: 'new' | 'excellent' | 'good' | 'fair' | 'poor'
  experienceLevel?: DifficultyLevel
  location?: string
  exchangePreference: string
  availability: string
  tags: string[]
  views: number
  requests: number
  status: ExchangeStatus
  createdAt: string
}

export interface ExchangeRequest {
  id: string
  exchangeItemId: string
  requesterId: string
  requesterName: string
  requesterAvatar: string
  contactInfo: string
  message: string
  offerDetails: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
