'use server'

import { createClient } from '@/utils/supabase/client'

export interface DashboardStats {
  totalRevenue: number
  revenueGrowth: number
  newOrders: number
  ordersGrowth: number
  totalProducts: number
  productsGrowth: number
  newCustomers: number
  customersGrowth: number
}

export interface BestSellingProduct {
  id: string
  name: string
  unitsSold: number
  totalRevenue: number
}

export interface MonthlySalesData {
  month: string
  sales: number
  year: number
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const supabase = createClient()

  try {
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const { data: currentRevenue } = await supabase
      .from('orders')
      .select('total_amount')
      .gte('created_at', currentMonthStart.toISOString())
      .neq('status', 'cancelled')

    const { data: lastMonthRevenue } = await supabase
      .from('orders')
      .select('total_amount')
      .gte('created_at', lastMonthStart.toISOString())
      .lt('created_at', currentMonthStart.toISOString())
      .neq('status', 'cancelled')

    const totalRevenue =
      currentRevenue?.reduce(
        (sum, order) => sum + Number(order.total_amount),
        0,
      ) || 0
    const lastMonthTotal =
      lastMonthRevenue?.reduce(
        (sum, order) => sum + Number(order.total_amount),
        0,
      ) || 0
    const revenueGrowth =
      lastMonthTotal > 0
        ? ((totalRevenue - lastMonthTotal) / lastMonthTotal) * 100
        : 0

    const { data: currentOrders } = await supabase
      .from('orders')
      .select('id')
      .gte('created_at', currentMonthStart.toISOString())
      .neq('status', 'cancelled')

    const { data: lastMonthOrders } = await supabase
      .from('orders')
      .select('id')
      .gte('created_at', lastMonthStart.toISOString())
      .lt('created_at', currentMonthStart.toISOString())
      .neq('status', 'cancelled')

    const newOrders = currentOrders?.length || 0
    const lastMonthOrdersCount = lastMonthOrders?.length || 0
    const ordersGrowth =
      lastMonthOrdersCount > 0
        ? ((newOrders - lastMonthOrdersCount) / lastMonthOrdersCount) * 100
        : 0

    const { data: currentProducts } = await supabase
      .from('products')
      .select('id')
      .eq('status', 'active')

    const { data: lastMonthProducts } = await supabase
      .from('products')
      .select('id')
      .eq('status', 'active')
      .lt('created_at', currentMonthStart.toISOString())

    const totalProducts = currentProducts?.length || 0
    const lastMonthProductsCount = lastMonthProducts?.length || 0
    const productsGrowth =
      lastMonthProductsCount > 0
        ? ((totalProducts - lastMonthProductsCount) / lastMonthProductsCount) *
          100
        : 0

    const { data: currentCustomers } = await supabase
      .from('customers')
      .select('id')
      .gte('created_at', currentMonthStart.toISOString())

    const { data: lastMonthCustomers } = await supabase
      .from('customers')
      .select('id')
      .gte('created_at', lastMonthStart.toISOString())
      .lt('created_at', currentMonthStart.toISOString())

    const newCustomers = currentCustomers?.length || 0
    const lastMonthCustomersCount = lastMonthCustomers?.length || 0
    const customersGrowth =
      lastMonthCustomersCount > 0
        ? ((newCustomers - lastMonthCustomersCount) / lastMonthCustomersCount) *
          100
        : 0

    return {
      totalRevenue,
      revenueGrowth,
      newOrders,
      ordersGrowth,
      totalProducts,
      productsGrowth,
      newCustomers,
      customersGrowth,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw new Error('Failed to fetch dashboard statistics')
  }
}

export const getBestSellingProducts = async (
  limit: number = 5,
): Promise<BestSellingProduct[]> => {
  const supabase = createClient()

  try {
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const { data, error } = await supabase
      .from('order_items')
      .select(
        `
        product_id,
        product_name,
        quantity,
        total_price,
        orders!inner(
          created_at,
          status
        )
      `,
      )
      .gte('orders.created_at', currentMonthStart.toISOString())
      .neq('orders.status', 'cancelled')

    if (error) {
      console.error('Error fetching best selling products:', error)
      throw new Error('Failed to fetch best selling products')
    }

    const productMap = new Map<
      string,
      {
        id: string
        name: string
        totalQuantity: number
        totalRevenue: number
      }
    >()

    data.forEach((item) => {
      const existing = productMap.get(item.product_id)
      if (existing) {
        existing.totalQuantity += item.quantity
        existing.totalRevenue += Number(item.total_price)
      } else {
        productMap.set(item.product_id, {
          id: item.product_id,
          name: item.product_name,
          totalQuantity: item.quantity,
          totalRevenue: Number(item.total_price),
        })
      }
    })

    const bestSellers = Array.from(productMap.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit)
      .map((product) => ({
        id: product.id,
        name: product.name,
        unitsSold: product.totalQuantity,
        totalRevenue: product.totalRevenue,
      }))

    return bestSellers
  } catch (error) {
    console.error('Error fetching best selling products:', error)
    throw new Error('Failed to fetch best selling products')
  }
}

export const getMonthlySalesData = async (
  months: number = 12,
): Promise<MonthlySalesData[]> => {
  const supabase = createClient()

  try {
    const now = new Date()
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - months + 1,
      1,
    )

    const { data, error } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', startDate.toISOString())
      .neq('status', 'cancelled')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching monthly sales data:', error)
      throw new Error('Failed to fetch monthly sales data')
    }

    const monthlyData = new Map<string, number>()

    data.forEach((order) => {
      const date = new Date(order.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const current = monthlyData.get(monthKey) || 0
      monthlyData.set(monthKey, current + Number(order.total_amount))
    })

    const result: MonthlySalesData[] = []
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleString('en-US', { month: 'short' })

      result.push({
        month: monthName,
        year: date.getFullYear(),
        sales: monthlyData.get(monthKey) || 0,
      })
    }

    return result
  } catch (error) {
    console.error('Error fetching monthly sales data:', error)
    throw new Error('Failed to fetch monthly sales data')
  }
}

export const getRecentOrders = async (limit: number = 10) => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        order_number,
        total_amount,
        status,
        created_at,
        customers (
          full_name,
          email
        )
      `,
      )
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent orders:', error)
      throw new Error('Failed to fetch recent orders')
    }

    return data
  } catch (error) {
    console.error('Error fetching recent orders:', error)
    throw new Error('Failed to fetch recent orders')
  }
}

export const getProductPerformance = async () => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        stock,
        status,
        category
      `,
      )
      .eq('status', 'active')
      .order('stock', { ascending: true })

    if (error) {
      console.error('Error fetching product performance:', error)
      throw new Error('Failed to fetch product performance')
    }

    return data
  } catch (error) {
    console.error('Error fetching product performance:', error)
    throw new Error('Failed to fetch product performance')
  }
}
