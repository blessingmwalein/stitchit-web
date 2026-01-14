import { apiRequest } from './client';

export interface FinishedProduct {
    id: number;
    reference: string;
    product_name: string;
    description: string;
    dimensions: string;
    length: string | null;
    width: string | null;
    unit: string;
    status: string;
    status_label: string;
    quality_status: string;
    primary_image: string;
    images: string[];
    order_reference: string | null;
    published_at: string;
    notes: string | null;
}

export interface ProductsResponse {
    success: boolean;
    data: FinishedProduct[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface ProductsFilters {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
}

export const productsApi = {
    getFinishedProducts: (filters?: ProductsFilters) => {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.per_page) params.append('per_page', filters.per_page.toString());
        if (filters?.search) params.append('search', filters.search);
        if (filters?.status) params.append('status', filters.status);

        const queryString = params.toString();
        const endpoint = queryString ? `finished-products?${queryString}` : 'finished-products';

        return apiRequest<ProductsResponse>(endpoint, {
            method: 'GET',
            skipAuth: true, // Public endpoint
        });
    },
};
