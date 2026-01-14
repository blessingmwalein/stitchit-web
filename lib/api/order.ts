import { apiRequest } from './client';

export interface PricingRequest {
    width_cm: number;
    height_cm: number;
}

export interface PricingResponse {
    success: boolean;
    data: {
        dimensions: {
            width_cm: number;
            height_cm: number;
            area_sqcm: number;
        };
        pricing: {
            production_cost: number;
            profit_margin_percentage: string | null;
            profit_amount: number;
            final_price: number;
            currency: string;
        };
    };
}

export const orderApi = {
    calculateRugPrice: (data: PricingRequest) => {
        return apiRequest<PricingResponse>('rug-pricing/calculate', {
            method: 'POST',
            body: data,
        });
    },

    createOrder: (formData: FormData) => {
        return apiRequest<any>('orders', {
            method: 'POST',
            body: formData,
        });
    },

    getOrders: () => {
        return apiRequest<OrderListResponse>('orders', {
            method: 'GET',
        });
    },
};

export interface OrderItem {
    id: number;
    description: string;
    width: string;
    height: string;
    quantity: number;
    price_per_item: string;
    total_price: number;
    design_image_url: string | null;
}

export interface Order {
    id: number;
    reference: string;
    state: string;
    state_label: string;
    total_amount: string;
    paid_amount: string | null;
    balance: string | null;
    items_count: number;
    delivery_address: string;
    delivery_date: string | null;
    notes: string | null;
    created_at: string;
    items: OrderItem[];
}

export interface OrderListResponse {
    success: boolean;
    data: Order[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}
