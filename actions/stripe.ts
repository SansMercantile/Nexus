'use server'

import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { getDb } from '@/lib/mongodb'

async function getProduct(productId: string) {
  const db = await getDb()
  const product = await db.collection('products').findOne({ id: productId })
  if (!product) {
    throw new Error(`Product with ID ${productId} not found`)
  }
  return product
}

export async function startCheckoutSession(productId: string) {
  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  })

  return session.client_secret
}