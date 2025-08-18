type Product = {
  id: string
  name: string
  description?: string
  category: string
  status: 'active' | 'inactive' | 'out_of_stock'
  product_options: {
    option_name: string
    price: number
    stock: number
  }[]
  created_at: string
  updated_at: string
  images?: ProductImage[]
}

type ProductImage = {
  id: string
  product_id: string
  image_url: string
  alt_text?: string
  sort_order: number
  created_at: string
}

export type { Product, ProductImage }
