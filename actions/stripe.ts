'use server'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

interface CreatePaymentParams {
  orderId: string
  amount: number
  paymentMethod: 'card' | 'qr'
  metadata?: Record<string, string>
}

interface PaymentResult {
  sessionId?: string
  url?: string | null
  success: boolean
  error?: string
  details?: string
  type?: string
}

export async function createPaymentSession({
  orderId,
  amount,
  paymentMethod,
  metadata = {},
}: CreatePaymentParams): Promise<PaymentResult> {
  try {
    const baseUrl = process.env.BASE_URL

    if (paymentMethod === 'card') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'thb',
              product_data: {
                name: `Order #${orderId}`,
                description: 'E-commerce order payment',
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        cancel_url: `${baseUrl}/checkout/cancel?order_id=${orderId}`,
        metadata: {
          orderId,
          ...metadata,
        },
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: ['TH'],
        },
        customer_creation: 'always',
      })

      return {
        sessionId: session.id,
        url: session.url,
        success: true,
      }
    } else if (paymentMethod === 'qr') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['promptpay'],
        line_items: [
          {
            price_data: {
              currency: 'thb',
              product_data: {
                name: orderId,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        cancel_url: `${baseUrl}/checkout/cancel?order_id=${orderId}`,
        metadata: {
          orderId,
          ...metadata,
        },
      })

      return {
        sessionId: session.id,
        url: session.url,
        success: true,
      }
    } else {
      return {
        success: false,
        error: 'Invalid payment method',
      }
    }
  } catch (error) {
    console.error('Stripe API Error:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return {
        success: false,
        error: 'Payment processing error',
        details: error.message,
        type: error.type,
      }
    }

    return {
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
