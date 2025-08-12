import {
  getDashboardStats,
  getBestSellingProducts,
  getMonthlySalesData,
  getRecentOrders,
  getProductPerformance,
} from '@/actions/dashboard'
import { useQuery } from '@tanstack/react-query'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  bestSellers: (limit?: number) =>
    [...dashboardKeys.all, 'bestSellers', limit] as const,
  monthlySales: (months?: number) =>
    [...dashboardKeys.all, 'monthlySales', months] as const,
  recentOrders: (limit?: number) =>
    [...dashboardKeys.all, 'recentOrders', limit] as const,
  productPerformance: () =>
    [...dashboardKeys.all, 'productPerformance'] as const,
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: 3,
  })
}

export const useBestSellingProducts = (limit: number = 5) => {
  return useQuery({
    queryKey: dashboardKeys.bestSellers(limit),
    queryFn: () => getBestSellingProducts(limit),
    staleTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    retry: 3,
  })
}

export const useMonthlySalesData = (months: number = 12) => {
  return useQuery({
    queryKey: dashboardKeys.monthlySales(months),
    queryFn: () => getMonthlySalesData(months),
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 15 * 60 * 1000,
    retry: 3,
  })
}

export const useRecentOrders = (limit: number = 10) => {
  return useQuery({
    queryKey: dashboardKeys.recentOrders(limit),
    queryFn: () => getRecentOrders(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 2 * 60 * 1000,
    retry: 3,
  })
}

export const useProductPerformance = () => {
  return useQuery({
    queryKey: dashboardKeys.productPerformance(),
    queryFn: getProductPerformance,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    retry: 3,
  })
}
