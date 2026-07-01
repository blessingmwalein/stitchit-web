import { apiRequest } from './client';

// ── Quotes ────────────────────────────────────────────────────────────────────

export interface QuoteItem {
  id: string;
  lineNo: number;
  description: string;
  rugSpec?: Record<string, any>;
  quantity: string;
  unitPrice: string;
  discount: string;
  lineTotal: string;
}

export interface Quote {
  id: string;
  quotationNumber: string;
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  issueDate: string;
  expiryDate?: string | null;
  subtotal: string;
  discountTotal: string;
  taxTotal: string;
  total: string;
  notes?: string | null;
  items: QuoteItem[];
}

export interface QuoteListResponse {
  data: Quote[];
  total: number;
  page: number;
  limit: number;
}

// ── Invoices ──────────────────────────────────────────────────────────────────

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate?: string | null;
  total: string;
  amountPaid: string;
  balance: string;
}

export interface InvoiceListResponse {
  data: Invoice[];
  total: number;
  page: number;
  limit: number;
}

// ── Payments ──────────────────────────────────────────────────────────────────

export interface PortalPayment {
  id: string;
  paymentNumber: string;
  method: string;
  amount: string;
  paymentDate: string;
  isDeposit: boolean;
  gatewayStatus?: string | null;
}

export interface PaymentListResponse {
  data: PortalPayment[];
  total: number;
  page: number;
  limit: number;
}

// ── Documents ────────────────────────────────────────────────────────────────

export interface GeneratedDocument {
  id: string;
  docType: string;
  documentNumber: string;
  entityType: string;
  entityId: string;
  fileId: string;
  qrToken: string;
  generatedAt: string;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export interface PortalNotification {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  data?: Record<string, any> | null;
  readAt?: string | null;
  createdAt: string;
}

// ── Payment gateway ───────────────────────────────────────────────────────────

export interface InitiatePaynowRequest {
  invoiceId?: string;
  orderId?: string;
  amount: number;
  email: string;
  reference: string;
  isDeposit?: boolean;
}

export interface InitiateStripeRequest {
  invoiceId?: string;
  orderId?: string;
  amount: number;
  currency?: string;
  description: string;
  isDeposit?: boolean;
}

// ── API object ────────────────────────────────────────────────────────────────

export const portalApi = {
  // Quotes
  listQuotes(page = 1): Promise<QuoteListResponse> {
    return apiRequest<QuoteListResponse>(`/portal/quotes?page=${page}`);
  },
  getQuote(id: string): Promise<Quote> {
    return apiRequest<Quote>(`/portal/quotes/${id}`);
  },
  approveQuote(id: string, notes?: string): Promise<Quote> {
    return apiRequest<Quote>(`/portal/quotes/${id}/approve`, { method: 'POST', body: { notes } });
  },
  rejectQuote(id: string, reason?: string): Promise<Quote> {
    return apiRequest<Quote>(`/portal/quotes/${id}/reject`, { method: 'POST', body: { reason } });
  },

  // Invoices
  listInvoices(page = 1): Promise<InvoiceListResponse> {
    return apiRequest<InvoiceListResponse>(`/portal/invoices?page=${page}`);
  },

  // Payments
  listPayments(page = 1): Promise<PaymentListResponse> {
    return apiRequest<PaymentListResponse>(`/portal/payments?page=${page}`);
  },
  initiatePaynow(customerId: string, data: InitiatePaynowRequest) {
    return apiRequest<{ redirectUrl: string; pollUrl: string }>('/payments-gateway/paynow/initiate', {
      method: 'POST',
      body: { ...data, customerId },
    });
  },
  initiateStripe(customerId: string, data: InitiateStripeRequest) {
    return apiRequest<{ clientSecret: string; paymentIntentId: string }>('/payments-gateway/stripe/initiate', {
      method: 'POST',
      body: { ...data, customerId },
    });
  },

  // Documents
  getOrderDocuments(orderId: string): Promise<GeneratedDocument[]> {
    return apiRequest<GeneratedDocument[]>(`/portal/orders/${orderId}/documents`);
  },

  // Notifications
  listNotifications(page = 1): Promise<{ data: PortalNotification[]; total: number; unread: number }> {
    return apiRequest(`/portal/notifications?page=${page}`);
  },
  markNotificationRead(id: string): Promise<void> {
    return apiRequest(`/portal/notifications/${id}/read`, { method: 'PATCH' });
  },
  markAllNotificationsRead(): Promise<void> {
    return apiRequest('/portal/notifications/read-all', { method: 'PATCH' });
  },
};
