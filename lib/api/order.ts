import { apiRequest } from './client';

// ── Pricing ──────────────────────────────────────────────────────────────────

export type ComplexityLevel = 'SIMPLE' | 'MEDIUM' | 'COMPLEX' | 'VERY_COMPLEX';
export type ShapeType = 'RECTANGLE' | 'RUNNER' | 'ROUND' | 'OVAL' | 'IRREGULAR' | 'CUSTOM';

export interface PricingRequest {
  widthCm: number;
  heightCm: number;
  complexity?: ComplexityLevel;
  shape?: ShapeType;
  isRush?: boolean;
}

// Normalized shape for backward-compat with orderSlice
export interface PricingResponse {
  data: {
    dimensions: { widthCm: number; heightCm: number; areaSqCm: number };
    pricing: { finalPrice: number; basePrice: number; currency: string };
  };
}

// Raw shape from NestJS
interface NestPricingResult {
  widthCm: number;
  heightCm: number;
  areaSqCm: number;
  basePrice: number;
  finalPrice: number;
  currency: string;
}

// ── Orders ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  rugName?: string | null;
  widthCm?: number | null;
  heightCm?: number | null;
  quantity: number;
  unitPrice: string;
  lineTotal: number;
  designFileId?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  depositAmount?: string | null;
  balance?: string | null;
  deliveryAddress?: string | null;
  requiredDate?: string | null;
  notes?: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

// ── API object ────────────────────────────────────────────────────────────────

export const orderApi = {
  calculateRugPrice(data: PricingRequest): Promise<PricingResponse> {
    const params = new URLSearchParams({
      widthCm: String(data.widthCm),
      heightCm: String(data.heightCm),
      ...(data.complexity ? { complexity: data.complexity } : {}),
      ...(data.shape ? { shape: data.shape } : {}),
      ...(data.isRush ? { isRush: 'true' } : {}),
    });
    return apiRequest<NestPricingResult>(`/public/pricing/estimate?${params}`, {
      method: 'GET',
      skipAuth: true,
    }).then((raw): PricingResponse => ({
      data: {
        dimensions: { widthCm: raw.widthCm, heightCm: raw.heightCm, areaSqCm: raw.areaSqCm },
        pricing: { finalPrice: raw.finalPrice, basePrice: raw.basePrice, currency: raw.currency },
      },
    }));
  },

  // For authenticated portal customers — creates an order from FormData
  createOrder(formData: FormData): Promise<any> {
    return apiRequest<any>('/portal/orders', { method: 'POST', body: formData });
  },

  // For unauthenticated visitors — submits a quick-order as a lead
  submitPublicEnquiry(formData: FormData): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/public/leads', {
      method: 'POST',
      skipAuth: true,
      body: formData,
    });
  },

  getOrders(page = 1): Promise<OrderListResponse> {
    return apiRequest<OrderListResponse>(`/portal/orders?page=${page}`, { method: 'GET' });
  },

  getOrder(id: string): Promise<Order> {
    return apiRequest<Order>(`/portal/orders/${id}`, { method: 'GET' });
  },
};
