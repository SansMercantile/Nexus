import crypto from 'crypto';

/**
 * AWS Bedrock text-generation client (SigV4-signed, dependency-free).
 *
 * This is the single AI provider for the Nexus site and the SMO Operations
 * CRM. Configure it with standard AWS credentials plus a Bedrock model:
 *
 *   AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (or AWS_API_KEY / AWS_API_SECRET)
 *   AWS_REGION or BEDROCK_REGION            (e.g. us-east-1)
 *   BEDROCK_MODEL                           (e.g. amazon.titan-text-express-v1)
 *   BEDROCK_ENDPOINT                        (optional override)
 *   BEDROCK_MAX_TOKENS / BEDROCK_TEMPERATURE (optional tuning)
 */

export interface BedrockGenerateRequest {
  model?: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export const BEDROCK_MODEL = process.env.BEDROCK_MODEL || 'amazon.titan-text-express-v1';

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_API_KEY;
const awsSecretAccessKey =
  process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_API_SECRET || process.env.AWS_API_SECRET_KEY;
const awsSessionToken = process.env.AWS_SESSION_TOKEN;
const explicitRegion = process.env.AWS_REGION || process.env.BEDROCK_REGION;

function parseBedrockRegion(endpoint: string | undefined) {
  if (!endpoint) return undefined;
  try {
    const host = new URL(endpoint).hostname;
    const match = host.match(/bedrock(?:-runtime)?\.([^.]+)\.amazonaws\.com$/);
    return match?.[1];
  } catch {
    return undefined;
  }
}

function normalizeBedrockEndpoint(endpoint: string | undefined) {
  if (!endpoint) return undefined;

  try {
    const url = new URL(endpoint);
    const host = url.hostname;
    const match = host.match(/^bedrock\.([^.]+)\.amazonaws\.com$/);
    if (match) {
      url.hostname = `bedrock-runtime.${match[1]}.amazonaws.com`;
    }
    return url.toString().replace(/\/$/, '');
  } catch {
    return endpoint;
  }
}

const awsRegion = explicitRegion || parseBedrockRegion(process.env.BEDROCK_ENDPOINT);
const bedrockEndpoint = normalizeBedrockEndpoint(
  process.env.BEDROCK_ENDPOINT || (awsRegion ? `https://bedrock-runtime.${awsRegion}.amazonaws.com` : undefined)
);

export function isBedrockConfigured(): boolean {
  return Boolean(bedrockEndpoint && BEDROCK_MODEL && awsAccessKeyId && awsSecretAccessKey && awsRegion);
}

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

/** Best-effort text extraction across Bedrock model response shapes. */
export function coerceBedrockText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    // Amazon Titan Text: { results: [{ outputText }] }
    if (Array.isArray(obj.results) && obj.results.length > 0) {
      const first = obj.results[0] as Record<string, unknown>;
      if (typeof first?.outputText === 'string') return first.outputText;
    }
    // Anthropic Claude on Bedrock: { content: [{ text }] }
    if (Array.isArray(obj.content)) {
      const text = obj.content
        .map((block) =>
          typeof block === 'object' && block !== null && 'text' in block
            ? String((block as Record<string, unknown>).text || '')
            : ''
        )
        .join('');
      if (text) return text;
    }
    if (typeof obj.outputText === 'string') return obj.outputText;
    if (typeof obj.completion === 'string') return obj.completion;
    if (typeof obj.response === 'string') return obj.response;
    if (typeof obj.body === 'string') return obj.body;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

async function invokeBedrockModel(prompt: string, maxTokens: number, temperature: number): Promise<unknown> {
  if (!bedrockEndpoint) {
    throw new Error('Bedrock endpoint is not configured. Set AWS_REGION/BEDROCK_REGION or BEDROCK_ENDPOINT.');
  }
  if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion) {
    throw new Error(
      'AWS credentials/region are required for Bedrock. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_REGION.'
    );
  }

  const model = BEDROCK_MODEL;
  const url = `${bedrockEndpoint}/model/${encodeURIComponent(model)}/invoke`;
  const payload = JSON.stringify({
    inputText: prompt,
    maxTokensToSample: maxTokens,
    temperature,
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

  const credentialScope = `${dateStamp}/${awsRegion}/bedrock/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, hashSha256(canonicalRequest)].join('\n');

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

  return response.json();
}

/**
 * Generate text with AWS Bedrock. Resolves to plain text.
 * Throws when Bedrock is not configured or the request fails so callers
 * can fall back to local heuristics.
 */
export async function generateAiText(
  prompt: string,
  opts?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  if (process.env.NEXT_PUBLIC_AI_PROVIDER === 'cloudflare') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CF_WORKER_URL}/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CF_AI_TOKEN}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Cloudflare AI request failed: ${response.status}`);
    }
    return coerceBedrockText(await response.json());
  }

  if (!isBedrockConfigured()) {
    throw new Error(
      'AWS Bedrock is not configured. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION/BEDROCK_REGION and BEDROCK_MODEL.'
    );
  }

  const data = await invokeBedrockModel(
    prompt,
    opts?.maxTokens ?? Number(process.env.BEDROCK_MAX_TOKENS ?? 1024),
    opts?.temperature ?? Number(process.env.BEDROCK_TEMPERATURE ?? 0.7)
  );
  return coerceBedrockText(data);
}
