'use client'

import { useCallback, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { startCheckoutSession } from '@/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function Checkout({ productId }: { productId: string }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const startCheckoutSessionForProduct = useCallback(
    async () => {
      try {
        const secret = await startCheckoutSession(productId)
        setClientSecret(secret)
      } catch (error) {
        console.error('Error starting checkout session:', error)
        alert('Failed to initiate checkout. Please try again.')
      }
    },
    [productId]
  )

  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-nexus-gray-300 mb-4">Initializing secure checkout...</p>
        <button 
          onClick={startCheckoutSessionForProduct}
          className="btn btn-primary"
        >
          Start Checkout
        </button>
      </div>
    )
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          clientSecret: clientSecret,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}