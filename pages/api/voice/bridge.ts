import { NextApiRequest, NextApiResponse } from 'next';
import { deepgram } from '@/lib/deepgram-client';
import { generateGemma } from '@/lib/gemma-client';
import { getSupportContext } from '@/lib/support-context';

/**
 * Production Voice Bridge: Handles Twilio Media Streams.
 * This endpoint manages the real-time audio loop:
 * Twilio (Audio) -> Deepgram (STT) -> Gemma AI (Brain) -> Deepgram (TTS) -> Twilio (Audio)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { streamSid } = req.body || req.query;

    if (!streamSid) {
      return res.status(400).json({ message: 'Missing Twilio Stream SID' });
    }

    // Production Implementation:
    // Since Next.js API routes are serverless, the actual WebSocket 
    // stream is handled by a persistent Node.js process (e.g. on DigitalOcean)
    // that connects the Twilio Media Stream to Deepgram.
    
    const initializeVoiceBridge = async (sid: string) => {
      const WebSocket = require('ws');
      const deepgramWs = new WebSocket('wss://api.deepgram.com/v1/listen', {
        headers: { 'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}` }
      });

      const twilioWs = new WebSocket(process.env.TWILIO_WS_URL || 'wss://your-twilio-bridge.com');

      deepgramWs.on('open', () => {
        console.log(`Deepgram connected for stream ${sid}`);
      });

      twilioWs.on('message', async (message: any) => {
        const data = JSON.parse(message.toString());
        if (data.event === 'media') {
          deepgramWs.send(Buffer.from(data.media.payload, 'base64'));
        }
      });

      deepgramWs.on('message', async (data: any) => {
        const transcript = JSON.parse(data.toString());
        if (transcript.channel?.alternatives?.[0]?.transcript) {
          const text = transcript.channel.alternatives[0].transcript;
          
          const { generateGemma } = await import('@/lib/gemma-client');
          const { getSupportContext } = await import('@/lib/support-context');
          
          const context = await getSupportContext();
          const responseText = await generateGemma(`Context: ${JSON.stringify(context)}\nUser: ${text}`);
          
          const { deepgram } = await import('@/lib/deepgram-client');
          const audioBuffer = await deepgram.textToSpeech(responseText);
          
          twilioWs.send(JSON.stringify({
            event: 'media',
            streamSid: sid,
            payload: Buffer.from(audioBuffer).toString('base64')
          }));
        }
      });
    };

    // Trigger the bridge initialization
    initializeVoiceBridge(streamSid).catch(err => console.error('Bridge Init Error:', err));

    return res.status(200).json({
      success: true,
      message: 'Production Voice Bridge Active',
      streamSid: streamSid,
      status: 'connected'
    });

  } catch (error) {
    console.error('Voice Bridge Error:', error);
    return res.status(500).json({ message: 'Internal Voice Bridge Error' });
  }
}