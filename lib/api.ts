// API Configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stitchit.insigprojects.co.zw/api/client'

export interface ApiResponse<T> {
  success: boolean
  message: string
  response: T
}

export interface FinishedProduct {
  id: number
  name: string
  description: string
  total_price: number
  default_image: string
  size_display_name: string
  shape: string
  use_case: string
  use_case_display_name: string
  length: number
  width: number
  created_at: string
}

export interface GroupedProduct {
  id: number
  name: string
  description: string
  total_price: number
  default_image: string
  size_display_name: string
  shape: string
  use_case: string
  use_case_display_name: string
  length: number
  width: number
  created_at: string
}

export interface FilterOptions {
  sizes: string[]
  types: string[]
  use_cases: string[]
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = BASE_URL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: ApiResponse<T> = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'API request failed')
      }
      
      return data.response
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Get all finished products
  async getFinishedProducts(params?: { page?: number; use_case?: string }): Promise<FinishedProduct[]> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.use_case) queryParams.append('use_case', params.use_case)
    
    const queryString = queryParams.toString()
    const endpoint = `/finished-products${queryString ? `?${queryString}` : ''}`
    
    return this.request<FinishedProduct[]>(endpoint)
  }

  // Get grouped products
  async getGroupedProducts(): Promise<GroupedProduct[]> {
    return this.request<GroupedProduct[]>('/finished-products/grouped')
  }

  // Get filter options
  async getFilterOptions(): Promise<FilterOptions> {
    return this.request<FilterOptions>('/filter-options')
  }

  // Get sizes
  async getSizes(): Promise<string[]> {
    return this.request<string[]>('/sizes')
  }

  // Get types
  async getTypes(): Promise<string[]> {
    return this.request<string[]>('/types')
  }

  // Get use cases
  async getUseCases(): Promise<string[]> {
    return this.request<string[]>('/use-cases')
  }
}

export const apiService = new ApiService() 