'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loadStripe } from '@stripe/stripe-js'
import { z } from 'zod'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useCartDetails, useCartSummary } from '@/hooks/use-carts'
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
  const { profile } = useAuth()
  const { data: cartDetails, isLoading: cartLoading } = useCartDetails()
  const { data: cartSummary } = useCartSummary()
  const [isProcessing, setIsProcessing] = useState(false)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping_address: '',
      notes: '',
      payment_method: 'card',
    },
  })

  const handleCheckoutRedirect = async (sessionId: string) => {
    try {
      const stripe = await stripePromise

      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Checkout redirect error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Payment redirect failed',
      )
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

      const result = await createStripeInstantOrder(
        orderData,
        data.payment_method,
      )

      if (result.success && result.data) {
        if (result.data.sessionId) {
          await handleCheckoutRedirect(result.data.sessionId)
        } else {
          throw new Error('Invalid payment data received')
        }
      } else {
        throw new Error(result.error || 'Failed to create order')
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
                                      PromptPay QR Code
                                    </p>
                                    <p className='text-muted-foreground text-sm'>
                                      Pay with PromptPay via Stripe Checkout
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
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Processing...
                        </>
                      ) : (
                        <>
                          {form.watch('payment_method') === 'qr'
                            ? 'Pay with PromptPay - ฿'
                            : 'Complete Order - ฿'}
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
