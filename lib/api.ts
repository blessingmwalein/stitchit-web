const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://stitchit.test/api/client'

export interface ApiResponse<T> {
  success: boolean
  message: string
  response: T // Changed from 'data' to 'response' to match actual API
}

export interface FinishedProduct {
  id: number
  name: string
  description: string
  default_image: string
  total_price: number
  unit: string
  shape: string
  use_case: string
  use_case_display_name: string
  size_display_name: string
  length: number
  width: number
  created_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
}

export interface GroupedProducts {
  [key: string]: {
    use_case: string
    display_name: string
    products: FinishedProduct[]
  }
}

export interface FilterOptions {
  [key: string]: string
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const url = `${BASE_URL}${endpoint}`
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async getFinishedProducts(params?: {
    search?: string
    size?: string
    type?: string
    use_case?: string
    page?: number
  }): Promise<ApiResponse<PaginatedResponse<FinishedProduct>>> {
    const searchParams = new URLSearchParams()
    
    if (params?.search) searchParams.append('search', params.search)
    if (params?.size) searchParams.append('size', params.size)
    if (params?.type) searchParams.append('type', params.type)
    if (params?.use_case) searchParams.append('use_case', params.use_case)
    if (params?.page) searchParams.append('page', params.page.toString())

    const queryString = searchParams.toString()
    const endpoint = `/finished-products${queryString ? `?${queryString}` : ''}`
    
    return this.request<PaginatedResponse<FinishedProduct>>(endpoint)
  }

  async getGroupedProducts(params?: {
    search?: string
    size?: string
    type?: string
  }): Promise<ApiResponse<GroupedProducts>> {
    const searchParams = new URLSearchParams()
    
    if (params?.search) searchParams.append('search', params.search)
    if (params?.size) searchParams.append('size', params.size)
    if (params?.type) searchParams.append('type', params.type)

    const queryString = searchParams.toString()
    const endpoint = `/finished-products/grouped${queryString ? `?${queryString}` : ''}`
    
    return this.request<GroupedProducts>(endpoint)
  }

  async getUseCases(): Promise<ApiResponse<FilterOptions>> {
    return this.request<FilterOptions>('/use-cases')
  }

  async getSizes(): Promise<ApiResponse<FilterOptions>> {
    return this.request<FilterOptions>('/sizes')
  }

  async getTypes(): Promise<ApiResponse<FilterOptions>> {
    return this.request<FilterOptions>('/types')
  }
}

export const apiService = new ApiService() 