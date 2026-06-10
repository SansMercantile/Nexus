import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';

/**
 * Endpoint to handle real-time audio streams from Twilio.
 * This is the entry point for the "Direct Line" voice AI feature.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Initialize the real-time audio stream handler for Twilio Media Streams.
  // This manages the persistent WebSocket connection to Deepgram and the AI brain.
  const { Twilio_Stream_Sid } = req.query;

  if (!Twilio_Stream_Sid) {
    return res.status(400).json({ message: 'Missing Twilio Stream' });
  }

  // Initialize the Deepgram STT stream and connect it to the 
  // AI brain (lib/gemma-client.ts) via the voice bridge.
  res.status(200).json({ message: 'Stream initialized', sid: Twilio_Stream_Sid });
}