'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { useCartDetails, useCartSummary, useClearCart } from '@/hooks/use-carts'
import { createStripeInstantOrder } from '@/actions/orders'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  CreditCard,
  QrCode,
  Loader2,
  ArrowLeft,
  CheckCircle,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { Loading } from '@/components/Layout/Loading'
import { Header } from '@/components/Layout/Header'
import { Menu } from '@/components/Layout/Menu'
import { Footer } from '@/components/Layout/Footer'
import { useCustomer } from '@/hooks/ีuse-customers'

const checkoutSchema = z.object({
  shipping_address: z.string().min(1, 'Shipping address is required'),
  notes: z.string().optional(),
  payment_method: z.enum(['card', 'qr'], {
    required_error: 'Please select a payment method',
  }),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { profile } = useAuth()
  const { data: cartDetails, isLoading: cartLoading } = useCartDetails()
  const { data: customerProfile } = useCustomer()
  const { data: cartSummary } = useCartSummary()
  const clearCartMutation = useClearCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderCreated, setOrderCreated] = useState<{
    orderId: string
    paymentLink: string
    orderNumber: string
  } | null>(null)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping_address: '',
      notes: '',
      payment_method: 'card',
    },
  })

  useEffect(() => {
    if (customerProfile?.address) {
      form.setValue(
        'shipping_address',
        `${customerProfile.full_name} ${customerProfile.phone} ${customerProfile.address} ${customerProfile.city} ${customerProfile.country} ${customerProfile.zipcode}`,
      )
    }
  }, [customerProfile, form])

  const copyPaymentLink = async () => {
    if (!orderCreated?.paymentLink) return

    try {
      await navigator.clipboard.writeText(orderCreated.paymentLink)
      toast.success('Payment link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const openPaymentLink = () => {
    if (orderCreated?.paymentLink) {
      window.open(orderCreated.paymentLink, '_blank')
    }
  }

  const onSubmit = async (data: CheckoutFormData) => {
    if (!profile?.id || !cartDetails || !cartSummary) {
      toast.error('Unable to process order. Please try again.')
      return
    }

    try {
      setIsProcessing(true)

      const orderData = {
        customer_id: profile.id,
        total_amount: cartSummary.total_amount,
        shipping_address: data.shipping_address,
        notes: data.notes,
        items: cartDetails.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.product_price,
          total_price: item.subtotal,
        })),
      }

      const result = await createStripeInstantOrder(
        orderData,
        data.payment_method,
      )

      if (result.success && result.data) {
        await clearCartMutation.mutateAsync()

        setOrderCreated({
          orderId: result.data.order.id,
          paymentLink: result.data.paymentLink,
          orderNumber: result.data.order.order_number,
        })

        toast.success('Order created successfully! Cart has been cleared.')
      } else {
        throw new Error(result.error || 'Failed to create order')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to create order',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartLoading) {
    return <Loading />
  }

  if (orderCreated) {
    return (
      <div className='flex min-h-screen flex-col items-center bg-[#fff9df]'>
        <Header />
        <Menu />

        <div className='flex w-full flex-1 items-center justify-center p-5'>
          <Card className='w-full max-w-md'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                <CheckCircle className='h-6 w-6 text-green-600' />
              </div>
              <CardTitle className='text-2xl text-green-600'>
                Order Created!
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='text-center'>
                <p className='text-lg font-semibold'>
                  Order #{orderCreated.orderNumber}
                </p>
                <p className='text-muted-foreground mt-2'>
                  Your order has been created successfully. Your cart has been
                  cleared.
                </p>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Payment Link:</strong> You can pay now or save this
                  link to pay later.
                </AlertDescription>
              </Alert>

              <div className='space-y-2'>
                <Button onClick={openPaymentLink} className='w-full' size='lg'>
                  <ExternalLink className='mr-2 h-4 w-4' />
                  Pay Now
                </Button>

                <Button
                  variant='outline'
                  onClick={copyPaymentLink}
                  className='w-full'
                >
                  <Copy className='mr-2 h-4 w-4' />
                  Copy Payment Link
                </Button>

                <Button
                  variant='outline'
                  onClick={() => router.push('/profile/orders')}
                  className='w-full'
                >
                  View My Orders
                </Button>

                <Button
                  variant='ghost'
                  onClick={() => router.push('/')}
                  className='w-full'
                >
                  Continue Shopping
                </Button>
              </div>

              <div className='text-muted-foreground text-center text-xs'>
                Payment link is valid for 7 days
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer className='mt-5 text-black' />
      </div>
    )
  }

  if (!cartDetails || cartDetails.length === 0) {
    return (
      <div className='flex min-h-screen flex-col items-center bg-[#fff9df]'>
        <Header />
        <Menu />
        <div className='flex flex-1 items-center justify-center'>
          <Card className='w-full max-w-md'>
            <CardContent className='p-6 text-center'>
              <h2 className='mb-2 text-xl font-semibold'>Cart is Empty</h2>
              <p className='text-muted-foreground mb-4'>
                Add some items to your cart before checkout
              </p>
              <Button onClick={() => router.push('/')}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer className='mt-5 text-black' />
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col items-center bg-[#fff9df]'>
      <Header />
      <Menu />

      <div className='w-full p-5'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-8'>
            <div className='flex items-center gap-4'>
              <Button variant='ghost' size='sm' onClick={() => router.back()}>
                <ArrowLeft className='h-4 w-4' />
              </Button>

              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Checkout</h1>
                <p className='text-muted-foreground mt-2'>
                  Create your order and get a payment link
                </p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {cartDetails.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center space-x-4 py-4'
                  >
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        width={64}
                        height={64}
                        className='h-16 w-16 rounded-md object-cover'
                      />
                    )}
                    <div className='min-w-0 flex-1'>
                      <h3 className='truncate font-medium'>
                        {item.product_name}
                      </h3>
                      <p className='text-muted-foreground text-sm'>
                        ฿{item.product_price.toLocaleString()} × {item.quantity}
                      </p>
                      <Badge variant='outline' className='text-xs'>
                        {item.product_category}
                      </Badge>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium'>
                        ฿{item.subtotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Items ({cartSummary?.total_items})</span>
                    <span>฿{cartSummary?.total_amount.toLocaleString()}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span>Shipping</span>
                    <span className='text-green-600'>Free</span>
                  </div>
                  <Separator />
                  <div className='flex justify-between text-lg font-bold'>
                    <span>Total</span>
                    <span>฿{cartSummary?.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping & Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                  >
                    <FormField
                      control={form.control}
                      name='shipping_address'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Enter your full shipping address'
                              className='min-h-[100px]'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='notes'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Any special instructions or notes'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='payment_method'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Payment Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className='space-y-4'
                            >
                              <div className='flex items-center space-x-3 rounded-lg border p-4'>
                                <RadioGroupItem value='card' id='card' />
                                <label
                                  htmlFor='card'
                                  className='flex flex-1 cursor-pointer items-center space-x-2'
                                >
                                  <CreditCard className='h-5 w-5' />
                                  <div>
                                    <p className='font-medium'>
                                      Credit/Debit Card
                                    </p>
                                    <p className='text-muted-foreground text-sm'>
                                      Pay with your card via Stripe
                                    </p>
                                  </div>
                                </label>
                              </div>

                              <div className='flex items-center space-x-3 rounded-lg border p-4'>
                                <RadioGroupItem value='qr' id='qr' />
                                <label
                                  htmlFor='qr'
                                  className='flex flex-1 cursor-pointer items-center space-x-2'
                                >
                                  <QrCode className='h-5 w-5' />
                                  <div>
                                    <p className='font-medium'>
                                      PromptPay QR Code
                                    </p>
                                    <p className='text-muted-foreground text-sm'>
                                      Pay with PromptPay
                                    </p>
                                  </div>
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Alert>
                      <AlertDescription>
                        <strong>How it works:</strong> We&apos;ll create your
                        order and clear your cart immediately. You&apos;ll get a
                        payment link that you can use now or later (valid for 7
                        days).
                      </AlertDescription>
                    </Alert>

                    <Button
                      type='submit'
                      className='w-full'
                      size='lg'
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Creating Order...
                        </>
                      ) : (
                        <>
                          Create Order - ฿
                          {cartSummary?.total_amount.toLocaleString()}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer className='mt-5 text-black' />
      </div>
    </div>
  )
}
