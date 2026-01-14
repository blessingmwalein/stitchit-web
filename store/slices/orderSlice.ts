import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { orderApi, PricingRequest, PricingResponse, Order, OrderListResponse } from '@/lib/api/order';
import { isApiError } from '@/lib/api/client';

export interface ItemPricing {
  data: PricingResponse['data']['pricing'] | null;
  dimensions: PricingResponse['data']['dimensions'] | null;
  loading: boolean;
  error: string | null;
}

export interface OrderState {
  // Order History State
  ordersList: {
    data: Order[];
    loading: boolean;
    error: string | null;
  };

  // Quick Order State
  // Map of item ID (from form) to its pricing data
  pricing: Record<string, ItemPricing>;

  submission: {
    loading: boolean;
    success: boolean;
    error: string | null;
  };
}

const initialState: OrderState = {
  ordersList: {
    data: [],
    loading: false,
    error: null,
  },
  pricing: {},
  submission: {
    loading: false,
    success: false,
    error: null,
  },
};

export const fetchOrders = createAsyncThunk<
  OrderListResponse,
  void,
  { rejectValue: string }
>('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await orderApi.getOrders();
    return res;
  } catch (error) {
    if (isApiError(error)) return rejectWithValue(error.message);
    return rejectWithValue('Failed to fetch orders');
  }
});

export const calculatePrice = createAsyncThunk<
  PricingResponse,
  { id: string } & PricingRequest,
  { rejectValue: string }
>('orders/calculatePrice', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const res = await orderApi.calculateRugPrice(payload);
    return res;
  } catch (error) {
    if (isApiError(error)) return rejectWithValue(error.message);
    return rejectWithValue('Failed to calculate price');
  }
});

export const submitQuickOrder = createAsyncThunk<
  any,
  FormData,
  { rejectValue: string }
>('orders/submitQuickOrder', async (formData, { rejectWithValue }) => {
  try {
    const res = await orderApi.createOrder(formData);
    return res;
  } catch (error) {
    if (isApiError(error)) return rejectWithValue(error.message);
    return rejectWithValue('Failed to submit order');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.pricing = initialState.pricing;
      state.submission = initialState.submission;
    },
    clearPricing: (state) => {
      state.pricing = initialState.pricing;
    },
    removeItemPricing: (state, action: PayloadAction<string>) => {
      if (state.pricing[action.payload]) {
        delete state.pricing[action.payload];
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch Orders
    builder.addCase(fetchOrders.pending, (state) => {
      state.ordersList.loading = true;
      state.ordersList.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.ordersList.loading = false;
      state.ordersList.data = action.payload.data;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.ordersList.loading = false;
      state.ordersList.error = action.payload || 'Failed to fetch orders';
    });

    // Calculate Price
    builder.addCase(calculatePrice.pending, (state, action) => {
      const id = action.meta.arg.id;
      if (!state.pricing[id]) {
        state.pricing[id] = { data: null, dimensions: null, loading: true, error: null };
      }
      state.pricing[id].loading = true;
      state.pricing[id].error = null;
    });
    builder.addCase(calculatePrice.fulfilled, (state, action) => {
      const id = action.meta.arg.id;
      state.pricing[id] = {
        loading: false,
        data: action.payload.data.pricing,
        dimensions: action.payload.data.dimensions,
        error: null
      };
    });
    builder.addCase(calculatePrice.rejected, (state, action) => {
      const id = action.meta.arg.id;
      if (state.pricing[id]) {
        state.pricing[id].loading = false;
        state.pricing[id].error = action.payload || 'Calculation failed';
      }
    });

    // Submit Order
    builder.addCase(submitQuickOrder.pending, (state) => {
      state.submission.loading = true;
      state.submission.error = null;
      state.submission.success = false;
    });
    builder.addCase(submitQuickOrder.fulfilled, (state) => {
      state.submission.loading = false;
      state.submission.success = true;
    });
    builder.addCase(submitQuickOrder.rejected, (state, action) => {
      state.submission.loading = false;
      state.submission.error = action.payload || 'Submission failed';
    });
  },
});

export const { resetOrderState, clearPricing, removeItemPricing } = orderSlice.actions;
export default orderSlice.reducer;
