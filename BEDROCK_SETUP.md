# AWS Bedrock Setup

This project routes all AI/LLM work through AWS Bedrock. There is no other
model provider configured.

## Prerequisites

1. An AWS account with Bedrock model access enabled in your region for the
   model you intend to use (e.g. `amazon.titan-text-express-v1`).
2. IAM credentials (access key + secret) allowed to call
   `bedrock:InvokeModel` on that model.

## Configure

Set these environment variables (`.env.local` for development, Vercel project
settings for production):

```bash
AWS_ACCESS_KEY_ID=your_aws_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
BEDROCK_MODEL=amazon.titan-text-express-v1
```

Optional tuning:

```bash
BEDROCK_MAX_TOKENS=1024
BEDROCK_TEMPERATURE=0.7
# Endpoint override (region is parsed from it when AWS_REGION is unset)
BEDROCK_ENDPOINT=https://bedrock-runtime.us-east-1.amazonaws.com
```

Temporary credentials are also supported via `AWS_SESSION_TOKEN`.

## Repo integration

- `lib/bedrock-client.ts` - SigV4-signed Bedrock client (`generateAiText`,
  `isBedrockConfigured`, `coerceBedrockText`). No extra dependencies.
- `pages/api/bedrock.ts` - Next.js API proxy endpoint for prompts.
- `pages/api/analytics/ai-summary.ts` - SMO executive summaries via Bedrock
  (local heuristic fallback when Bedrock is unavailable).
- `pages/api/audio/transcribe.ts` - SMO voice-memo knowledge indexing enriched
  by Bedrock (structured fallback when Bedrock is unavailable).

## Usage

### From the repo API

Send a POST request to:

```
/api/bedrock
```

with JSON:

```json
{
  "prompt": "Hello Bedrock"
}
```

### Direct Mpeti chat proxy

The Mpeti docs console (`pages/docs/mpeti.tsx`) and the CEO resume assistant
(`pages/ceo_resume.tsx`) both call `/api/bedrock`.

## Behaviour without credentials

Bedrock-backed routes throw a descriptive configuration error when credentials
are missing. User-facing SMO routes degrade to local heuristic fallbacks;
generic routes (`/api/bedrock`, `/api/ai/*`, `/api/v1/support`,
`/api/llm-support`) return HTTP 500 with the configuration message.
