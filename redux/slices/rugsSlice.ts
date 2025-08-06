import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Rug } from "@/types";
import { apiService, type FinishedProduct } from "@/lib/api";

// Async thunk for fetching finished products
export const fetchFinishedProducts = createAsyncThunk(
  "rugs/fetchFinishedProducts",
  async (params?: {
    search?: string;
    size?: string;
    type?: string;
    use_case?: string;
    page?: number;
  }) => {
    const response = await apiService.getFinishedProducts(params);
    return response.response;
  }
);

// Async thunk for fetching grouped products
export const fetchGroupedProducts = createAsyncThunk(
  "rugs/fetchGroupedProducts",
  async (params?: { search?: string; size?: string; type?: string }) => {
    const response = await apiService.getGroupedProducts(params);
    return response.response;
  }
);

// Async thunk for fetching filter options
export const fetchFilterOptions = createAsyncThunk(
  "rugs/fetchFilterOptions",
  async () => {
    const [useCasesResponse, sizesResponse, typesResponse] = await Promise.all([
      apiService.getUseCases(),
      apiService.getSizes(),
      apiService.getTypes(),
    ]);

    return {
      useCases: useCasesResponse.response,
      sizes: sizesResponse.response,
      types: typesResponse.response,
    };
  }
);

// Helper function to convert API product to Rug type
const convertApiProductToRug = (product: FinishedProduct): Rug => {
  // Transform image URL to include storage base URL
  const imageUrl = product.default_image.startsWith("http")
    ? product.default_image
    : `https://stitchit.insigprojects.co.zw/storage/${product.default_image}`;

  return {
    id: product.id.toString(),
    name: product.name,
    description: product.description,
    price: product.total_price,
    image: imageUrl,
    size: product.size_display_name.toLowerCase(),
    type: product.shape,
    useCase: product.use_case,
    useCaseDisplayName: product.use_case_display_name,
    dimensions: `${product.length}cm x ${product.width}cm`,
    materials: "Premium Materials", // Default value since API doesn't provide materials
    productionTime: "3-5 days", // Default value since API doesn't provide production time
    createdAt: product.created_at,
  };
};

interface RugsState {
  items: Rug[];
  apiProducts: FinishedProduct[];
  groupedProducts: {
    [key: string]: {
      use_case: string;
      display_name: string;
      products: FinishedProduct[];
    };
  };
  filterOptions: {
    useCases: { [key: string]: string };
    sizes: { [key: string]: string };
    types: { [key: string]: string };
  };
  loading: boolean;
  error: string | null;
  groupedLoading: boolean;
  groupedError: string | null;
  filtersLoading: boolean;
  filtersError: string | null;
}

const initialState: RugsState = {
  items: [],
  apiProducts: [],
  groupedProducts: {},
  filterOptions: {
    useCases: {},
    sizes: {},
    types: {},
  },
  loading: false,
  error: null,
  groupedLoading: false,
  groupedError: null,
  filtersLoading: false,
  filtersError: null,
};

const rugsSlice = createSlice({
  name: "rugs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.groupedError = null;
      state.filtersError = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchFinishedProducts
    builder
      .addCase(fetchFinishedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinishedProducts.fulfilled, (state, action) => {
        state.loading = false;

        // Handle the actual API response structure
        if (Array.isArray(action.payload)) {
          // Direct array of products
          state.apiProducts = action.payload;
          state.items = action.payload.map(convertApiProductToRug);
        } else if (
          action.payload &&
          action.payload.data &&
          Array.isArray(action.payload.data)
        ) {
          // Paginated response structure
          state.apiProducts = action.payload.data;
          state.items = action.payload.data.map(convertApiProductToRug);
        } else {
          console.error("Unexpected payload structure:", action.payload);
          state.error = "Invalid API response structure";
        }
      })
      .addCase(fetchFinishedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });

    // Handle fetchGroupedProducts
    builder
      .addCase(fetchGroupedProducts.pending, (state) => {
        state.groupedLoading = true;
        state.groupedError = null;
      })
      .addCase(fetchGroupedProducts.fulfilled, (state, action) => {
        state.groupedLoading = false;
        state.groupedProducts = action.payload;
      })
      .addCase(fetchGroupedProducts.rejected, (state, action) => {
        state.groupedLoading = false;
        state.groupedError =
          action.error.message || "Failed to fetch grouped products";
      });

    // Handle fetchFilterOptions
    builder
      .addCase(fetchFilterOptions.pending, (state) => {
        state.filtersLoading = true;
        state.filtersError = null;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filtersLoading = false;
        state.filterOptions = action.payload;
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        state.filtersLoading = false;
        state.filtersError =
          action.error.message || "Failed to fetch filter options";
      });
  },
});

export const { clearError } = rugsSlice.actions;
export default rugsSlice.reducer;
