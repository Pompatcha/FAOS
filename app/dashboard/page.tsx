import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Package, Receipt, TrendingUp, Users } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <p className='text-muted-foreground'>Overview of your online store</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <TrendingUp className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$45,231.89</div>
            <p className='text-muted-foreground text-xs'>
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>New Orders</CardTitle>
            <Receipt className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+2,350</div>
            <p className='text-muted-foreground text-xs'>
              +180.1% from last month
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
            <div className='text-2xl font-bold'>+12,234</div>
            <p className='text-muted-foreground text-xs'>
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>New Customers</CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+573</div>
            <p className='text-muted-foreground text-xs'>
              +201 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent className='pl-2'>
            <div className='bg-muted/50 flex h-[200px] items-center justify-center rounded-lg'>
              <p className='text-muted-foreground'>Monthly Sales Chart</p>
            </div>
          </CardContent>
        </Card>
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Best Sellers</CardTitle>
            <CardDescription>Top selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center'>
                <div className='bg-muted h-9 w-9 rounded-md'></div>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm leading-none font-medium'>
                    iPhone 15 Pro
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    234 units sold
                  </p>
                </div>
                <div className='ml-auto font-medium'>$39,900</div>
              </div>
              <div className='flex items-center'>
                <div className='bg-muted h-9 w-9 rounded-md'></div>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm leading-none font-medium'>
                    MacBook Air M2
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    156 units sold
                  </p>
                </div>
                <div className='ml-auto font-medium'>$42,900</div>
              </div>
              <div className='flex items-center'>
                <div className='bg-muted h-9 w-9 rounded-md'></div>
                <div className='ml-4 space-y-1'>
                  <p className='text-sm leading-none font-medium'>
                    AirPods Pro
                  </p>
                  <p className='text-muted-foreground text-sm'>89 units sold</p>
                </div>
                <div className='ml-auto font-medium'>$8,900</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
