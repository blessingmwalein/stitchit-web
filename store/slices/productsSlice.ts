import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productsApi, FinishedProduct, ProductsResponse, ProductsFilters } from '@/lib/api/products';
import { isApiError } from '@/lib/api/client';

export interface ProductsState {
    products: FinishedProduct[];
    loading: boolean;
    error: string | null;
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    } | null;
    filters: ProductsFilters;
}

const initialState: ProductsState = {
    products: [],
    loading: false,
    error: null,
    pagination: null,
    filters: {
        page: 1,
        per_page: 12,
    },
};

export const fetchProducts = createAsyncThunk<
    ProductsResponse,
    ProductsFilters | undefined,
    { rejectValue: string }
>('products/fetchProducts', async (filters, { rejectWithValue }) => {
    try {
        const res = await productsApi.getFinishedProducts(filters);
        return res;
    } catch (error) {
        if (isApiError(error)) return rejectWithValue(error.message);
        return rejectWithValue('Failed to fetch products');
    }
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<ProductsFilters>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.filters = { page: 1, per_page: 12 };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.data;
            state.pagination = action.payload.pagination;
        });
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to fetch products';
        });
    },
});

export const { setFilters, resetFilters } = productsSlice.actions;
export default productsSlice.reducer;
