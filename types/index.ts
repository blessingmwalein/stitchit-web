export interface Rug {
  id: string
  name: string
  description: string
  price: number
  image: string
  size: string
  type: string
  useCase: string
  dimensions: string
  materials: string
  productionTime: string
  createdAt: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  options?: {
    type: string
    dimensions: string
    useLocation: string
  }
}

export interface Order {
  id: string
  date: string
  status: string
  total: number
  items: CartItem[]
}

export interface Payment {
  id: string
  date: string
  amount: number
  method: string
  status: string
  orderId: string
}
