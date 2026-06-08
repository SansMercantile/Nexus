import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../components/layout/Layout'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../lib/animations'
import { AnimatedIcon } from '../components/AnimatedIcons'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = router.query
  const productId = searchParams?.productId as string

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const startCheckoutSession = async () => {
    if (!productId) {
      alert('Product ID is missing.')
      return
    }
    setLoading(true)
    try {
      const secret = await fetch(`/api/checkout?productId=${productId}`).then(res => res.json())
      // Note: This assumes the API returns { clientSecret: string }
      setClientSecret(secret.clientSecret)
    } catch (error) {
      console.error('Error starting checkout session:', error)
      alert('Failed to initiate checkout.')
    } finally {
      setLoading(false)
    }
  }

  // Since we are using a dynamic route [system] or similar, 
  // but the user wants /checkout?productId=...
  // I should check if there is an existing /checkout page.
  // The file list shows pages/checkout.tsx doesn't exist yet.
}