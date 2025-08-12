import crypto from 'crypto'

export interface CartItem {
  product_id: string
  quantity: number
  unit_price: number
}

export const generateCartHash = (items: CartItem[]) => {
  const sortedItems = items
    .map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))
    .sort((a, b) => a.product_id.localeCompare(b.product_id))

  const cartString = JSON.stringify(sortedItems)
  return crypto.createHash('md5').update(cartString).digest('hex')
}

export const isCartSame = (items1: CartItem[], items2: CartItem[]): boolean => {
  if (items1.length !== items2.length) {
    return false
  }

  const hash1 = generateCartHash(items1)
  const hash2 = generateCartHash(items2)

  return hash1 === hash2
}
