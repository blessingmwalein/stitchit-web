import { apiRequest } from './client';

export interface FinishedProduct {
  id: string;
  name: string;
  description?: string | null;
  widthCm?: number | null;
  heightCm?: number | null;
  primaryImage?: string | null;
  images: string[];
  status: string;
  publishedAt?: string | null;
  notes?: string | null;
}

export interface ProductsResponse {
  data: FinishedProduct[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductsFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export const productsApi = {
  getFinishedProducts(filters?: ProductsFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.pageSize) params.append('pageSize', String(filters.pageSize));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const endpoint = `/public/products${queryString ? `?${queryString}` : ''}`;

    return apiRequest<ProductsResponse>(endpoint, {
      method: 'GET',
      skipAuth: true,
    }).catch(() => ({ data: [], total: 0, page: 1, limit: 20 }));
  },
};
