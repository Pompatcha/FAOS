'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { XCircle, HelpCircle, Loader2 } from 'lucide-react'

function CheckoutCancelContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mx-auto max-w-2xl'>
        <div className='mb-8 text-center'>
          <div className='mb-4 flex justify-center'>
            <XCircle className='h-16 w-16 text-red-500' />
          </div>
          <h1 className='mb-2 text-3xl font-bold text-red-600'>
            Payment Cancelled
          </h1>
          <p className='text-muted-foreground'>
            Your order was not completed. No charges were made to your payment
            method.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <HelpCircle className='h-5 w-5' />
              What happened?
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Alert>
              <AlertDescription>
                Your payment was cancelled and no money was charged. Your cart
                items are still saved and you can complete your order anytime.
              </AlertDescription>
            </Alert>

            <div className='space-y-3'>
              <h3 className='font-medium'>
                Common reasons for payment cancellation:
              </h3>
              <ul className='text-muted-foreground ml-4 space-y-1 text-sm'>
                <li>• You clicked the back button during payment</li>
                <li>• Payment window was closed before completion</li>
                <li>• Payment method was declined</li>
                <li>• Session timeout</li>
              </ul>
            </div>

            <div className='space-y-3'>
              <h3 className='font-medium'>Next steps:</h3>
              <ul className='text-muted-foreground ml-4 space-y-1 text-sm'>
                <li>• Review your cart and try again</li>
                <li>• Check your payment method details</li>
                <li>• Contact support if you continue having issues</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className='mt-6 flex justify-center'>
          <Button
            variant='ghost'
            onClick={() => router.replace('/')}
            className='text-muted-foreground'
          >
            Continue Shopping
          </Button>
        </div>

        {sessionId && (
          <div className='bg-muted mt-6 rounded-lg p-4'>
            <p className='text-muted-foreground text-sm'>
              <strong>Session ID:</strong> {sessionId}
            </p>
            <p className='text-muted-foreground mt-1 text-xs'>
              Reference this ID if you need to contact support
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function CheckoutCancelLoading() {
  return (
    <div className='container mx-auto flex justify-center px-4 py-8'>
      <Loader2 className='h-8 w-8 animate-spin' />
    </div>
  )
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<CheckoutCancelLoading />}>
      <CheckoutCancelContent />
    </Suspense>
  )
}
