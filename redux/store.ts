import { configureStore } from "@reduxjs/toolkit"
import rugsReducer from "./slices/rugsSlice"
import cartReducer from "./slices/cartSlice"
import authReducer from "./slices/authSlice"
import ordersReducer from "./slices/ordersSlice"
import paymentsReducer from "./slices/paymentsSlice"
import snackbarReducer from "./slices/snackbarSlice"

export const store = configureStore({
  reducer: {
    rugs: rugsReducer,
    cart: cartReducer,
    auth: authReducer,
    orders: ordersReducer,
    payments: paymentsReducer,
    snackbar: snackbarReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
