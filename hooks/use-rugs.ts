import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/redux/store'
import { 
  fetchFinishedProducts, 
  fetchGroupedProducts, 
  fetchFilterOptions,
  clearError 
} from '@/redux/slices/rugsSlice'

export const useRugs = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    items,
    apiProducts,
    groupedProducts,
    filterOptions,
    loading,
    error,
    groupedLoading,
    groupedError,
    filtersLoading,
    filtersError
  } = useSelector((state: RootState) => state.rugs)

  const fetchProducts = (params?: {
    search?: string
    size?: string
    type?: string
    use_case?: string
    page?: number
  }) => {
    dispatch(fetchFinishedProducts(params))
  }

  const fetchGrouped = (params?: {
    search?: string
    size?: string
    type?: string
  }) => {
    dispatch(fetchGroupedProducts(params))
  }

  const fetchFilters = () => {
    dispatch(fetchFilterOptions())
  }

  const clearErrors = () => {
    dispatch(clearError())
  }

  return {
    // Data
    items,
    apiProducts,
    groupedProducts,
    filterOptions,
    
    // Loading states
    loading,
    groupedLoading,
    filtersLoading,
    
    // Error states
    error,
    groupedError,
    filtersError,
    
    // Actions
    fetchProducts,
    fetchGrouped,
    fetchFilters,
    clearErrors
  }
}

export const useFeaturedRugs = (size?: string) => {
  const { fetchProducts, loading, error, items } = useRugs()

  useEffect(() => {
    fetchProducts({ size, page: 1 })
  }, [size])

  return {
    items: items.filter(item => 
      size ? item.size.toLowerCase() === size.toLowerCase() : true
    ),
    loading,
    error
  }
}

export const useRecentRugs = () => {
  const { fetchProducts, loading, error, items } = useRugs()

  useEffect(() => {
    fetchProducts({ page: 1 })
  }, [])

  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  return {
    items: recentItems,
    loading,
    error
  }
}

export const useGroupedRugs = (params?: {
  search?: string
  size?: string
  type?: string
}) => {
  const { fetchGrouped, groupedProducts, groupedLoading, groupedError } = useRugs()

  useEffect(() => {
    fetchGrouped(params)
  }, [params?.search, params?.size, params?.type])

  return {
    groupedProducts,
    groupedLoading,
    groupedError
  }
}

export const useFilterOptions = () => {
  const { fetchFilters, filterOptions, filtersLoading, filtersError } = useRugs()

  useEffect(() => {
    fetchFilters()
  }, [])

  return {
    filterOptions,
    filtersLoading,
    filtersError
  }
} 