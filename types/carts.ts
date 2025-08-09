interface CartItem {
  id: string
  customer_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
}

interface CartSummary {
  cart_identifier: string
  customer_id: string
  total_items: number
  total_quantity: number
  total_amount: number
  last_updated: string
}

interface CartDetails {
  id: string
  customer_id: string
  product_id: string
  quantity: number
  product_name: string
  product_description: string | null
  product_price: number
  product_stock: number
  product_status: string
  product_category: string
  subtotal: number
  product_image: string | null
  image_count: number
  created_at: string
  updated_at: string
}

export type { CartItem, CartSummary, CartDetails }
