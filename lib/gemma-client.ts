import crypto from 'crypto';

export interface GemmaGenerateRequest {
  model?: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
}

export const GEMMA_HOST = process.env.NEXT_PUBLIC_GEMMA_HOST ?? 'https://silo-rocky-extruding.ngrok-free.dev';
const MODEL_ALIASES: Record<string, string> = {
  mpeti: 'gemma:2b',
  'mpeti:2b': 'gemma:2b',
  gemma: 'gemma:2b',
  gemma4: 'gemma:2b',
  'gemma4:2b': 'gemma:2b',
  // Redundancy models
  backup_1: 'llama3:8b',
  backup_2: 'mistral:7b',
  redundant: 'phi3:mini',
};
const rawModel = (process.env.NEXT_PUBLIC_GEMMA_MODEL ?? 'mpeti').toLowerCase();
export const GEMMA_MODEL = MODEL_ALIASES[rawModel] ?? rawModel;

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_API_KEY;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_API_SECRET || process.env.AWS_API_SECRET_KEY;
const awsSessionToken = process.env.AWS_SESSION_TOKEN;
const explicitRegion = process.env.AWS_REGION || process.env.BEDROCK_REGION;
const bedrockModel = process.env.BEDROCK_MODEL || GEMMA_MODEL;

function parseBedrockRegion(endpoint: string | undefined) {
  if (!endpoint) return undefined;
  try {
    const host = new URL(endpoint).hostname;
    const match = host.match(/bedrock\.([^.]+)\.amazonaws\.com$/);
    return match?.[1];
  } catch {
    return undefined;
  }
}

const awsRegion = explicitRegion || parseBedrockRegion(process.env.BEDROCK_ENDPOINT);
const bedrockEndpoint = process.env.BEDROCK_ENDPOINT || (awsRegion ? `https://bedrock.${awsRegion}.amazonaws.com` : undefined);
const bedrockConfigured = Boolean(bedrockEndpoint && bedrockModel && awsAccessKeyId && awsSecretAccessKey && awsRegion);

function hashSha256(value: string) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function hmacSha256(key: Buffer, value: string) {
  return crypto.createHmac('sha256', key).update(value, 'utf8').digest();
}

function getSigningKey(secret: string, dateStamp: string, regionName: string, serviceName: string) {
  const kDate = hmacSha256(Buffer.from(`AWS4${secret}`, 'utf8'), dateStamp);
  const kRegion = hmacSha256(kDate, regionName);
  const kService = hmacSha256(kRegion, serviceName);
  return hmacSha256(kService, 'aws4_request');
}

async function generateBedrock(prompt: string) {
  if (!bedrockEndpoint) {
    throw new Error('Bedrock endpoint is not configured. Set BEDROCK_REGION or BEDROCK_ENDPOINT.');
  }

  const model = bedrockModel;
  const url = `${bedrockEndpoint}/model/${encodeURIComponent(model)}/invoke`;
  const payload = JSON.stringify({
    inputText: prompt,
    maxTokensToSample: Number(process.env.BEDROCK_MAX_TOKENS ?? 512),
    temperature: Number(process.env.BEDROCK_TEMPERATURE ?? 0.7),
  });
  const { host, pathname } = new URL(url);
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '') + 'Z';
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = hashSha256(payload);

  const signedHeaders = ['content-type', 'host', 'x-amz-content-sha256', 'x-amz-date'];
  const canonicalHeaders = [
    `content-type:application/json`,
    `host:${host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
  ];

  if (awsSessionToken) {
    signedHeaders.push('x-amz-security-token');
    canonicalHeaders.push(`x-amz-security-token:${awsSessionToken}`);
  }

  const canonicalRequest = [
    'POST',
    pathname,
    '',
    `${canonicalHeaders.join('\n')}\n`,
    signedHeaders.join(';'),
    payloadHash,
  ].join('\n');

  const canonicalRequestHash = hashSha256(canonicalRequest);
  const credentialScope = `${dateStamp}/${awsRegion}/bedrock/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    canonicalRequestHash,
  ].join('\n');

  if (!awsAccessKeyId || !awsSecretAccessKey) {
    throw new Error('AWS credentials are required to sign Bedrock requests. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.');
  }

  const signingKey = getSigningKey(awsSecretAccessKey, dateStamp, awsRegion, 'bedrock');
  const signature = hmacSha256(signingKey, stringToSign).toString('hex');
  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${awsAccessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders.join(';')}, Signature=${signature}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Amz-Date': amzDate,
    'X-Amz-Content-Sha256': payloadHash,
    Authorization: authorizationHeader,
  };

  if (awsSessionToken) {
    headers['X-Amz-Security-Token'] = awsSessionToken;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: payload,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Bedrock request failed: ${response.status} ${response.statusText} - ${text}`);
  }

  const data = await response.json();
  if (data && typeof data === 'object') {
    if ('outputText' in data && typeof data.outputText === 'string') {
      return data.outputText;
    }
    if ('body' in data) {
      return data.body;
    }
  }

  return data;
}

export async function generateGemma(prompt: string) {
  if (process.env.NEXT_PUBLIC_AI_PROVIDER === 'cloudflare') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CF_WORKER_URL}/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CF_AI_TOKEN}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Cloudflare AI request failed: ${response.status}`);
    }
    return response.json();
  }

  if (bedrockConfigured) {
    return generateBedrock(prompt);
  }

  const payload: GemmaGenerateRequest = {
    model: GEMMA_MODEL,
    prompt,
    max_tokens: 256,
    temperature: 0.7,
  };

  const response = await fetch(`${GEMMA_HOST}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Gemma request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
