import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, paymentMethod } = await request.json()

    if (!orderId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (paymentMethod === 'card') {
      // Create Checkout Session for card payments
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'thb',
              product_data: {
                name: `Order #${orderId}`,
                description: 'Order from FAOS',
              },
              unit_amount: Math.round(amount * 100), // Convert to smallest currency unit
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?cancelled=true`,
        metadata: {
          orderId,
        },
      })

      return NextResponse.json({
        clientSecret: session.id,
        paymentIntentId: session.payment_intent,
      })
    } else if (paymentMethod === 'qr') {
      // Create Payment Intent for PromptPay QR code
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to smallest currency unit
        currency: 'thb',
        payment_method_types: ['promptpay'],
        metadata: {
          orderId,
        },
      })

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      })
    }

    return NextResponse.json(
      { error: 'Invalid payment method' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}