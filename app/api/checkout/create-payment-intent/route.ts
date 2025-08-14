import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, paymentMethod, metadata } = await request.json()

    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const host = request.headers.get('host')
    const baseUrl = `${protocol}://${host}`

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

      return NextResponse.json({
        sessionId: session.id,
        url: session.url,
        success: true,
      })
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

      return NextResponse.json({
        sessionId: session.id,
        url: session.url,
        success: true,
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error('Stripe API Error:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: 'Payment processing error',
          details: error.message,
          type: error.type,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
