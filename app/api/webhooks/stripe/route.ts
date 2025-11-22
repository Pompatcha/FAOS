import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import type { NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 },
    )
  }

  const supabase = await createClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      const orderId = session.metadata?.order_id

      if (!orderId) {
        console.error('No order_id found in session metadata')
        return NextResponse.json(
          { error: 'No order_id in metadata' },
          { status: 400 },
        )
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)

      if (updateError) {
        console.error('Error updating order:', updateError)
        return NextResponse.json(
          { error: 'Failed to update order' },
          { status: 500 },
        )
      }

      console.log(`✅ Payment successful for order #${orderId}`)
      break
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      console.log('✅ Payment intent succeeded:', paymentIntent.id)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      const orderId = paymentIntent.metadata?.order_id

      if (orderId) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)

        if (updateError) {
          console.error('Error updating order:', updateError)
        }
      }

      console.error('❌ Payment failed:', paymentIntent.id)
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge

      const orderId = charge.metadata?.order_id

      if (orderId) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'refunded',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)

        if (updateError) {
          console.error('Error updating refund:', updateError)
        }

        const { data: orderItems } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId)

        if (orderItems && orderItems.length > 0) {
          for (const item of orderItems) {
            if (item.product_option_id) {
              const { data: currentOption } = await supabase
                .from('product_options')
                .select('option_stock')
                .eq('id', item.product_option_id)
                .single()

              if (currentOption) {
                const newStock =
                  (currentOption.option_stock || 0) + item.quantity

                await supabase
                  .from('product_options')
                  .update({ option_stock: newStock })
                  .eq('id', item.product_option_id)
              }
            }
          }
        }
      }

      console.log('💰 Charge refunded:', charge.id)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

export const dynamic = 'force-dynamic'
