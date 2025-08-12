'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  useDashboardStats,
  useBestSellingProducts,
  useMonthlySalesData,
} from '@/hooks/use-dashboard'
import { Package, Receipt, TrendingUp, Users, Loader2 } from 'lucide-react'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(amount)
}

const formatPercentage = (value: number) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

const LoadingCard = () => (
  <Card>
    <CardContent className='flex h-24 items-center justify-center'>
      <Loader2 className='h-6 w-6 animate-spin' />
    </CardContent>
  </Card>
)

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats()
  const { data: bestSellers, isLoading: bestSellersLoading } =
    useBestSellingProducts(3)
  const { data: monthlySales, isLoading: salesLoading } = useMonthlySalesData(6)

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <p className='text-muted-foreground'>Overview of your online store</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {statsLoading ? (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : statsError ? (
          <div className='col-span-4'>
            <Card>
              <CardContent className='flex h-24 items-center justify-center'>
                <p className='text-muted-foreground'>
                  Error loading dashboard stats
                </p>
              </CardContent>
            </Card>
          </div>
        ) : stats ? (
          <>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Revenue
                </CardTitle>
                <TrendingUp className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formatCurrency(stats.totalRevenue)}
                </div>
                <p
                  className={`text-xs ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatPercentage(stats.revenueGrowth)} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  New Orders
                </CardTitle>
                <Receipt className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats.newOrders.toLocaleString()}
                </div>
                <p
                  className={`text-xs ${stats.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatPercentage(stats.ordersGrowth)} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Products
                </CardTitle>
                <Package className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats.totalProducts.toLocaleString()}
                </div>
                <p
                  className={`text-xs ${stats.productsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatPercentage(stats.productsGrowth)} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  New Customers
                </CardTitle>
                <Users className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats.newCustomers.toLocaleString()}
                </div>
                <p
                  className={`text-xs ${stats.customersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatPercentage(stats.customersGrowth)} from last month
                </p>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent className='pl-2'>
            {salesLoading ? (
              <div className='flex h-[200px] items-center justify-center'>
                <Loader2 className='h-6 w-6 animate-spin' />
              </div>
            ) : monthlySales && monthlySales.length > 0 ? (
              <div className='h-[200px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={monthlySales}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='month'
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        'Sales',
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Line
                      type='monotone'
                      dataKey='sales'
                      stroke='#2563eb'
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className='bg-muted/50 flex h-[200px] items-center justify-center rounded-lg'>
                <p className='text-muted-foreground'>No sales data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Best Sellers</CardTitle>
            <CardDescription>Top selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            {bestSellersLoading ? (
              <div className='flex h-32 items-center justify-center'>
                <Loader2 className='h-6 w-6 animate-spin' />
              </div>
            ) : bestSellers && bestSellers.length > 0 ? (
              <div className='space-y-4'>
                {bestSellers.map((product) => (
                  <div key={product.id} className='flex items-center'>
                    <div className='bg-muted flex h-9 w-9 items-center justify-center rounded-md'>
                      <Package className='h-4 w-4' />
                    </div>
                    <div className='ml-4 flex-1 space-y-1'>
                      <p className='text-sm leading-none font-medium'>
                        {product.name}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        {product.unitsSold} units sold
                      </p>
                    </div>
                    <div className='ml-auto font-medium'>
                      {formatCurrency(product.totalRevenue)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex h-32 items-center justify-center'>
                <p className='text-muted-foreground'>No sales data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
