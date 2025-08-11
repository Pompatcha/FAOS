'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loadStripe } from '@stripe/stripe-js'
import { z } from 'zod'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useCartDetails, useCartSummary, useClearCart } from '@/hooks/use-carts'
import { useCreateOrder } from '@/hooks/use-orders'
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
import { CreditCard, QrCode, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Loading } from '@/components/Layout/Loading'
import { Header } from '@/components/Layout/Header'
import { Menu } from '@/components/Layout/Menu'
import { Footer } from '@/components/Layout/Footer'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
)

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
  const { user, profile } = useAuth()
  const { data: cartDetails, isLoading: cartLoading } = useCartDetails()
  const { data: cartSummary } = useCartSummary()
  const clearCartMutation = useClearCart()
  const [isProcessing, setIsProcessing] = useState(false)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping_address: '',
      notes: '',
      payment_method: 'card',
    },
  })

  const createOrderMutation = useCreateOrder()

  useEffect(() => {
    if (!user || !profile) {
      router.push('/')
      return
    }

    if (!cartLoading && (!cartDetails || cartDetails.length === 0)) {
      toast.error('Your cart is empty')
      router.push('/')
      return
    }
  }, [user, profile, cartDetails, cartLoading, router])

  const handleStripePayment = async (
    orderId: string,
    paymentMethod: 'card' | 'qr',
  ) => {
    try {
      setIsProcessing(true)
      const stripe = await stripePromise

      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      const response = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount: cartSummary?.total_amount || 0,
          paymentMethod,
        }),
      })

      const { clientSecret } = await response.json()

      if (paymentMethod === 'qr') {
        const { error } = await stripe.confirmPromptPayPayment(clientSecret, {
          payment_method: 'promptpay',
        })

        if (error) {
          throw error
        }
      } else {
        const { error } = await stripe.redirectToCheckout({
          sessionId: clientSecret,
        })

        if (error) {
          throw error
        }
      }

      await clearCartMutation.mutateAsync()
      toast.success('Order created successfully!')
      router.push(`/profile/orders`)
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsProcessing(false)
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

      const result = await createOrderMutation.mutateAsync(orderData)
      if (result.data) {
        await handleStripePayment(result.data.id, data.payment_method)
      }
    } catch (error) {
      console.error('Order creation error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to create order',
      )
      setIsProcessing(false)
    }
  }

  if (cartLoading) {
    return <Loading />
  }

  if (!cartDetails || cartDetails.length === 0) {
    return null
  }

  return (
    <div className='flex min-h-screen flex-col items-center bg-[#fff9df]'>
      <Header />
      <Menu />

      <div className='w-full p-5'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-8'>
            <div className='flex'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => router.back()}
                className='p-2'
              >
                <ArrowLeft className='h-4 w-4' />
              </Button>

              <h1 className='text-2xl font-bold text-gray-900'>Checkout</h1>
            </div>

            <p className='text-muted-foreground mt-2'>
              Review your order and complete your purchase
            </p>
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
                      <Image
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
                          <FormLabel>Payment Method</FormLabel>
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
                                      Pay securely with your card via Stripe
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
                                      QR Code Payment
                                    </p>
                                    <p className='text-muted-foreground text-sm'>
                                      Pay with PromptPay QR code
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

                    <Button
                      type='submit'
                      className='w-full'
                      size='lg'
                      disabled={isProcessing || createOrderMutation.isPending}
                    >
                      {isProcessing || createOrderMutation.isPending ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Order - ฿
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
