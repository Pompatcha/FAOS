import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentIntentId } = body

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 },
      )
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (
      paymentIntent.status === 'succeeded' &&
      paymentIntent.metadata.orderId
    ) {
      const supabase = createClient()

      await supabase
        .from('orders')
        .update({
          status: 'processing',
          payment_status: 'paid',
          payment_intent_id: paymentIntentId,
          paid_at: new Date().toISOString(),
        })
        .eq('id', paymentIntent.metadata.orderId)

      await supabase.from('order_status_history').insert({
        order_id: paymentIntent.metadata.orderId,
        status: 'processing',
        notes: 'Payment confirmed via Stripe',
      })
    }

    return NextResponse.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      paymentMethod: paymentIntent.payment_method,
      metadata: paymentIntent.metadata,
    })
  } catch (error) {
    console.error('Error checking payment status:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 },
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
