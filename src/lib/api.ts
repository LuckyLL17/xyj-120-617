const API_BASE = '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || '请求失败')
  }

  return data.data as T
}

export const api = {
  knowledge: {
    list: (params?: {
      level?: string
      scenario?: string
      category?: string
      search?: string
    }) => {
      const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
      return request('/knowledge' + query)
    },
    categories: () => request('/knowledge/categories'),
    get: (id: string) => request(`/knowledge/${id}`),
    submitQuiz: (id: string, answers: number[]) => 
      request(`/knowledge/${id}/quiz/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      }),
  },

  equipment: {
    categories: () => request('/equipment/categories'),
    list: (params?: {
      categoryId?: string
      search?: string
      minPrice?: string
      maxPrice?: string
      minRating?: string
    }) => {
      const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
      return request('/equipment' + query)
    },
    compare: (ids: string[]) => request(`/equipment/compare?ids=${ids.join(',')}`),
    get: (id: string) => request(`/equipment/${id}`),
    getReviews: (id: string) => request(`/equipment/${id}/reviews`),
    addReview: (id: string, review: {
      userName: string
      rating: number
      title: string
      content: string
      usageDuration?: string
    }) => request(`/equipment/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    }),
  },

  checklist: {
    categories: () => request('/checklist/categories'),
    list: (params?: { categoryId?: string }) => {
      const query = params?.categoryId ? `?categoryId=${params.categoryId}` : ''
      return request('/checklist' + query)
    },
    get: (id: string) => request(`/checklist/${id}`),
    generate: (params: {
      scenario: string
      duration: string
      peopleCount?: number
    }) => request('/checklist/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
    export: (templateId: string) => request('/checklist/export', {
      method: 'POST',
      body: JSON.stringify({ templateId }),
    }),
  },

  community: {
    list: (params?: {
      category?: string
      region?: string
      tag?: string
      search?: string
      sortBy?: string
    }) => {
      const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
      return request('/community' + query)
    },
    regions: () => request('/community/regions'),
    get: (id: string) => request(`/community/${id}`),
    create: (post: {
      userName: string
      title: string
      content: string
      category: 'experience' | 'discussion' | 'question' | 'regional'
      region?: string
      tags?: string[]
      isEmergency?: boolean
    }) => request('/community', {
      method: 'POST',
      body: JSON.stringify(post),
    }),
    like: (id: string) => request(`/community/${id}/like`, {
      method: 'POST',
    }),
    getComments: (id: string) => request(`/community/${id}/comments`),
    addComment: (id: string, comment: {
      userName: string
      content: string
    }) => request(`/community/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    }),
    likeComment: (id: string) => request(`/community/comment/${id}/like`, {
      method: 'POST',
    }),
  },

  checkSensitive: (text: string) => request('/sensitive-check', {
    method: 'POST',
    body: JSON.stringify({ text }),
  }),

  simulator: {
    scenarios: (params?: {
      scenario?: string
      difficulty?: string
    }) => {
      const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
      return request('/simulator/scenarios' + query)
    },
    getScenario: (id: string) => request(`/simulator/scenarios/${id}`),
    getQuestions: (scenarioId: string) => request(`/simulator/scenarios/${scenarioId}/questions`),
    submit: (submission: {
      scenarioId: string
      answers: {
        questionId: string
        optionId: string
      }[]
    }) => request('/simulator/submit', {
      method: 'POST',
      body: JSON.stringify(submission),
    }),
  },

  exchange: {
    list: (params?: {
      type?: string
      category?: string
      location?: string
      search?: string
      sortBy?: string
      status?: string
    }) => {
      const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
      return request('/exchange' + query)
    },
    categories: (params?: { type?: string }) => {
      const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''
      return request('/exchange/categories' + query)
    },
    locations: () => request('/exchange/locations'),
    get: (id: string) => request(`/exchange/${id}`),
    create: (item: {
      type: 'skill' | 'equipment'
      userName: string
      title: string
      description: string
      category: string
      images?: string[]
      condition?: 'new' | 'excellent' | 'good' | 'fair' | 'poor'
      experienceLevel?: 'beginner' | 'intermediate' | 'advanced'
      location?: string
      exchangePreference: string
      availability: string
      tags?: string[]
    }) => request('/exchange', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
    sendRequest: (id: string, requestData: {
      requesterName: string
      contactInfo: string
      message: string
      offerDetails: string
    }) => request(`/exchange/${id}/request`, {
      method: 'POST',
      body: JSON.stringify(requestData),
    }),
    getRequests: (id: string) => request(`/exchange/${id}/requests`),
    updateStatus: (id: string, status: string) => request(`/exchange/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
    updateRequestStatus: (requestId: string, status: string) => request(`/exchange/requests/${requestId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  },
}
