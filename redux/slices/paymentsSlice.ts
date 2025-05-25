import { createSlice } from "@reduxjs/toolkit"
import type { Payment } from "@/types"

// Sample data
const initialPayments: Payment[] = [
  {
    id: "PAY12345",
    date: "2024-05-01T10:35:00Z",
    amount: 45,
    method: "Ecocash",
    status: "Completed",
    orderId: "ORD12345",
  },
  {
    id: "PAY12346",
    date: "2024-05-10T14:50:00Z",
    amount: 60,
    method: "Bank Transfer",
    status: "Pending",
    orderId: "ORD12346",
  },
  {
    id: "PAY12347",
    date: "2024-05-15T09:20:00Z",
    amount: 65,
    method: "USD Cash on Delivery",
    status: "Pending",
    orderId: "ORD12347",
  },
]

const paymentsSlice = createSlice({
  name: "payments",
  initialState: {
    items: initialPayments,
  },
  reducers: {
    // Add reducers if needed
  },
})

export default paymentsSlice.reducer
