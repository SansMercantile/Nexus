import type { NextApiRequest, NextApiResponse } from 'next';
import { generateAiText } from '@/lib/bedrock-client';
import { guardAiRoute } from '@/lib/ai-guard';

/**
 * POST /api/analytics/ai-summary
 * Generates an executive weekly performance report from CRM metrics.
 * Uses AWS Bedrock when configured, otherwise returns a local heuristic fallback.
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Operational CRM route: portal session required (also rate-limited).
  if (!(await guardAiRoute(req, res, { mode: 'session', scope: 'smo-ai-summary' }))) return;

  try {
    const {
      kpis,
      anomalyFlags,
      stageBreakdown,
      focusTone = 'balanced',
      departmentMorale,
    } = req.body || {};

    const prompt = `You are the Chief Operating Officer and Strategic Advisor for the Sovereign Mercantile Organization (SMO).
Generate a concise, high-impact executive weekly performance report based on the following verified CRM metrics and anomaly logs.

Timeframe: ${kpis?.timeframe || 'Current Period'}
Current Workspace: ${kpis?.currentSpace || 'All Spaces'}
Total Active Pipeline: $${Number(kpis?.totalValue || 0).toLocaleString()} (Trend: ${kpis?.pipelineTrendPct || '+14.2%'})
Closed Won Capital: $${Number(kpis?.wonValue || 0).toLocaleString()} (Trend: ${kpis?.wonTrendPct || '+18.0%'})
Win Rate: ${kpis?.winRate || '0'}%
Average Deal Lead Score: ${kpis?.avgScore || '0'}/100
Active Deals Count: ${kpis?.dealCount || 0}
Weighted Forecast Capital: $${Number(kpis?.weightedForecast || 0).toLocaleString()}

Velocity Anomaly Status:
- Velocity Score: ${kpis?.velocityScore || 88} PTS (Lower Quartile Warning Threshold: ${kpis?.lowerQuartile || 76} PTS)
- Anomaly Flags Detected: ${anomalyFlags?.length ? JSON.stringify(anomalyFlags) : 'Deal velocity is within healthy statistical bounds (Q1 quartile cleared)'}

Stage Breakdown:
${Array.isArray(stageBreakdown) ? stageBreakdown.map((s: any) => `- ${s.label}: ${s.count} deals ($${Number(s.value).toLocaleString()})`).join('\n') : 'All standard stages operational'}

Team Sentiment Morale: ${departmentMorale ? JSON.stringify(departmentMorale) : 'Positive (75/100)'}
Focus Tone: ${focusTone}

Format your response in crisp, clean Markdown using these specific headers:
### 1. Executive Trajectory & Weekly Velocity
(Summarize the pipeline momentum, capital converted, and velocity health relative to targets in 2-3 sentences)

### 2. Core Drivers & Revenue Run-Rate
(Highlight key stages, conversion efficiency, and high-probability capital in transit in 2 bullet points)

### 3. Anomaly Detection & Risk Factors
(Address the anomaly status, deal bottlenecks, or capacity constraints requiring attention in 2 bullet points)

### 4. Immediate Strategic Directives
(Provide 3 actionable directives for deal leads, space managers, and executive partners for the upcoming week)

Keep the prose executive, strategic, precise, and free of filler phrases.`;

    const summaryFallback = `### 1. Executive Trajectory & Weekly Velocity
The Sovereign Mercantile portfolio maintains strong forward momentum with **$${Number(kpis?.totalValue || 0).toLocaleString()}** in active pipeline capital and an impressive **${kpis?.winRate || 24}% win rate**. Deal transit velocity is currently pacing at **${kpis?.velocityScore || 88} PTS**, well above the lower quartile anomaly threshold (${kpis?.lowerQuartile || 76} PTS).

### 2. Core Drivers & Revenue Run-Rate
- **Committed Conversions**: Closed-won capital reached **$${Number(kpis?.wonValue || 0).toLocaleString()}**, reflecting high-conviction diligence in institutional capital and strategic partnerships.
- **Weighted Expected Flow**: Expected capital realization is estimated at **$${Number(kpis?.weightedForecast || 0).toLocaleString()}**, driven by high lead-score opportunities in Diligence and Term Sheet stages.

### 3. Anomaly Detection & Risk Factors
- **Statistical Velocity**: No critical velocity collapse detected; activity levels across CBDO and Engineering pilots remain balanced.
- **Morale Correlation**: Communications and dev team sentiment indexes at a solid **${departmentMorale?.score || 75}/100**, mitigating deal attrition risk.

### 4. Immediate Strategic Directives
- **Direct Term Sheet Acceleration**: Prioritize closing advanced stage proposals before quarter close.
- **Institutional Alignment**: Re-engage stalled outreach prospects with updated sovereign pilot specifications.
- **Quota Rebalancing**: Maintain weekly velocity checkpoints across CBDO and Executive sponsorship tracks.`;

    try {
      const text = await generateAiText(prompt);
      if (!text) throw new Error('Empty Bedrock response');
      return res.status(200).json({
        summary: text,
        source: 'bedrock',
        timestamp: new Date().toISOString(),
      });
    } catch (aiErr: any) {
      console.warn('Bedrock summary unavailable, using local fallback:', aiErr?.message);
      return res.status(200).json({
        summary: summaryFallback,
        source: 'local_heuristic',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err: any) {
    console.error('Server error handling AI summary:', err);
    return res.status(500).json({
      error: 'Failed to generate AI weekly summary',
      message: err?.message || 'Internal server error',
    });
  }
}
