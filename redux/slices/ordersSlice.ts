import { createSlice } from "@reduxjs/toolkit"
import type { Order } from "@/types"

// Sample data
const initialOrders: Order[] = [
  {
    id: "ORD12345",
    date: "2024-05-01T10:30:00Z",
    status: "Delivered",
    total: 45,
    items: [
      {
        id: "2",
        name: "Modern Rectangle",
        price: 45,
        image: "/placeholder.svg?height=300&width=300",
        quantity: 1,
        options: {
          type: "rectangle",
          dimensions: "80cm x 120cm",
          useLocation: "bedroom",
        },
      },
    ],
  },
  {
    id: "ORD12346",
    date: "2024-05-10T14:45:00Z",
    status: "Production",
    total: 60,
    items: [
      {
        id: "3",
        name: "Abstract Art",
        price: 60,
        image: "/placeholder.svg?height=300&width=300",
        quantity: 1,
        options: {
          type: "rectangle",
          dimensions: "120cm x 180cm",
          useLocation: "livingroom",
        },
      },
    ],
  },
  {
    id: "ORD12347",
    date: "2024-05-15T09:15:00Z",
    status: "Processing",
    total: 65,
    items: [
      {
        id: "4",
        name: "Minimalist Circle",
        price: 25,
        image: "/placeholder.svg?height=300&width=300",
        quantity: 1,
        options: {
          type: "circle",
          dimensions: "45cm diameter",
          useLocation: "bathroom",
        },
      },
      {
        id: "5",
        name: "Luxury Car Mat",
        price: 40,
        image: "/placeholder.svg?height=300&width=300",
        quantity: 1,
        options: {
          type: "custom",
          dimensions: "60cm x 40cm",
          useLocation: "carmat",
        },
      },
    ],
  },
]

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: initialOrders,
  },
  reducers: {
    // Add reducers if needed
  },
})

export default ordersSlice.reducer
