import { getDb } from '@/lib/mongodb';

/**
 * Creates a support ticket in Atlassian CSM when the AI determines 
 * that human intervention is required.
 */
export async function createCSMTicket(customerData: any, conversationHistory: string[], issueSummary: string) {
  const db = await getDb();
  // In a real production environment, we would use the Atlassian API client here.
  // For now, we log the intent and store it in our internal 'support_tickets' collection 
  // to be synced with CSM via a webhook or scheduled job.
  
  const ticket = {
    customerId: customerData.id,
    summary: issueSummary,
    description: `AI-generated summary of conversation:\n${conversationHistory}`,
    status: 'open',
    source: 'ai_live_chat',
    createdAt: new Date().toISOString(),
  };

  await db.collection('support_tickets').insertOne(ticket);
  console.log('Support ticket created for Atlassian CSM sync.');
}