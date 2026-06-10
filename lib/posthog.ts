import PostHog from 'posthog-node';

/**
 * Production PostHog client for tracking AI interactions, 
 * payment conversions, and system performance.
 */
export const ph = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_API_KEY || '', {
  api_key: process.env.NEXT_PUBLIC_POSTHOG_API_KEY,
  personal: true,
});

export async function trackAIInteraction(userId: string, tenantId: string, model: string, prompt: string, response: string, latency: number) {
  ph.capture({
    distinctId: userId,
    event: 'ai_interaction',
    properties: {
      tenantId,
      model,
      prompt_length: prompt.length,
      response_length: response.length,
      latency_ms: latency,
      timestamp: new Date().toISOString(),
    },
  });
}

export async function trackPaymentConversion(userId: string, tenantId: string, productId: string, amount: number) {
  ph.capture({
    distinctId: userId,
    event: 'payment_completed',
    properties: {
      tenantId,
      productId,
      amount,
      currency: 'USD',
      timestamp: new Date().toISOString(),
    },
  });
}

export async function trackSystemError(error: Error, context: string) {
  ph.capture({
    event: 'system_error',
    properties: {
      errorMessage: error.message,
      context,
      timestamp: new Date().toISOString(),
    },
  });
}