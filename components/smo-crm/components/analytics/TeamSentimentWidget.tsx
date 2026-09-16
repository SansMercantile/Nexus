import React, { useMemo } from 'react';
import { Smile, MessageSquare, TrendingUp, Sparkles, Heart, AlertCircle, Award, CheckCircle } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

interface SentimentResult {
  score: number; // -1 to 1 normalized to 0 - 100
  label: 'Very Positive' | 'Positive' | 'Neutral' | 'Mixed / Cautious';
  color: string;
  badgeBg: string;
  positiveCount: number;
  neutralCount: number;
  concernCount: number;
  highlightWords: string[];
  recentQuotes: { text: string; sender: string; channel: string; sentiment: 'pos' | 'neutral' | 'caution' }[];
}

const POSITIVE_KEYWORDS = [
  'great', 'awesome', 'excellent', 'ready', 'shipped', 'verified', 'approved', 'excited', 'launch',
  'success', 'strong', 'congrats', 'promising', 'done', 'smooth', 'on track', 'achieved', 'green',
  'high', 'unlocked', 'clear', 'stellar', 'boost', 'delighted', 'confident', 'speed', 'top'
];

const CONCERN_KEYWORDS = [
  'blocked', 'issue', 'delay', 'risk', 'bug', 'failing', 'stuck', 'error', 'late', 'urgent',
  'critical', 'problem', 'caution', 'friction', 'drop', 'warning', 'concern', 'pressure'
];

export const TeamSentimentWidget: React.FC = () => {
  const { chatMessages, chatChannels } = useCrm();

  const sentimentAnalysis = useMemo<SentimentResult>(() => {
    if (!chatMessages || chatMessages.length === 0) {
      return {
        score: 75,
        label: 'Positive',
        color: 'text-emerald-600',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        positiveCount: 12,
        neutralCount: 4,
        concernCount: 1,
        highlightWords: ['launch', 'verified', 'ready'],
        recentQuotes: []
      };
    }

    let pos = 0;
    let neu = 0;
    let con = 0;
    const foundKeywords: Record<string, number> = {};

    const quotes: SentimentResult['recentQuotes'] = [];

    // Analyze recent 40 messages
    const recent = chatMessages.slice(-40);

    recent.forEach(msg => {
      const lower = msg.content.toLowerCase();
      let msgScore = 0;

      POSITIVE_KEYWORDS.forEach(kw => {
        if (lower.includes(kw)) {
          msgScore += 1;
          foundKeywords[kw] = (foundKeywords[kw] || 0) + 1;
        }
      });

      CONCERN_KEYWORDS.forEach(kw => {
        if (lower.includes(kw)) {
          msgScore -= 1.5;
          foundKeywords[kw] = (foundKeywords[kw] || 0) + 1;
        }
      });

      // Also factor emoji reactions
      if (msg.reactions && msg.reactions.length > 0) {
        msg.reactions.forEach(r => {
          if (['👍', '🚀', '❤️', '🔥', '👏', '✅', '🎉'].includes(r.emoji)) {
            msgScore += 0.5 * r.count;
          }
        });
      }

      const channelObj = chatChannels.find(c => c.id === msg.channelId);
      const channelName = channelObj ? `#${channelObj.name}` : '#team';

      if (msgScore > 0.5) {
        pos++;
        if (quotes.length < 3) {
          quotes.push({
            text: msg.content.slice(0, 110) + (msg.content.length > 110 ? '...' : ''),
            sender: msg.senderName,
            channel: channelName,
            sentiment: 'pos'
          });
        }
      } else if (msgScore < -0.5) {
        con++;
        if (quotes.length < 3) {
          quotes.push({
            text: msg.content.slice(0, 110) + (msg.content.length > 110 ? '...' : ''),
            sender: msg.senderName,
            channel: channelName,
            sentiment: 'caution'
          });
        }
      } else {
        neu++;
      }
    });

    const total = pos + neu + con;
    // Normalized score from 0 to 100 (weighted)
    const rawRatio = total > 0 ? (pos - con * 1.5 + neu * 0.5) / total : 0.7;
    // Map to 50 - 95 range for natural team health display
    const finalScore = Math.min(Math.max(Math.round(50 + rawRatio * 40), 45), 98);

    let label: SentimentResult['label'] = 'Positive';
    let color = 'text-emerald-600';
    let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';

    if (finalScore >= 85) {
      label = 'Very Positive';
      color = 'text-emerald-600';
      badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (finalScore >= 70) {
      label = 'Positive';
      color = 'text-indigo-600';
      badgeBg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    } else if (finalScore >= 55) {
      label = 'Neutral';
      color = 'text-amber-600';
      badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
    } else {
      label = 'Mixed / Cautious';
      color = 'text-rose-600';
      badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
    }

    const topWords = Object.entries(foundKeywords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    return {
      score: finalScore,
      label,
      color,
      badgeBg,
      positiveCount: pos,
      neutralCount: neu,
      concernCount: con,
      highlightWords: topWords.length > 0 ? topWords : ['launch', 'verified', 'traction'],
      recentQuotes: quotes
    };
  }, [chatMessages, chatChannels]);

  return (
    <div id="team-sentiment-widget" className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-pink-50 border border-pink-200 text-pink-600 flex items-center justify-center">
            <Smile className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Team Morale & Sentiment Index
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${sentimentAnalysis.badgeBg}`}>
                {sentimentAnalysis.label} ({sentimentAnalysis.score}/100)
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Natural language sentiment analysis across live TeamChat channels & reaction logs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Analyzed across {chatMessages.length} team messages</span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Live sync" />
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric gauge & distribution */}
        <div className="space-y-3 flex flex-col justify-center">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-slate-500">Aggregate Team Morale</span>
            <span className={`text-2xl font-black font-mono ${sentimentAnalysis.color}`}>
              {sentimentAnalysis.score}<span className="text-xs font-normal text-slate-400">/100</span>
            </span>
          </div>

          {/* Morale Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-700"
              style={{ width: `${(sentimentAnalysis.positiveCount / (sentimentAnalysis.positiveCount + sentimentAnalysis.neutralCount + sentimentAnalysis.concernCount || 1)) * 100}%` }}
              title="Positive statements"
            />
            <div
              className="bg-indigo-300 h-full transition-all duration-700"
              style={{ width: `${(sentimentAnalysis.neutralCount / (sentimentAnalysis.positiveCount + sentimentAnalysis.neutralCount + sentimentAnalysis.concernCount || 1)) * 100}%` }}
              title="Neutral statements"
            />
            <div
              className="bg-rose-400 h-full transition-all duration-700"
              style={{ width: `${(sentimentAnalysis.concernCount / (sentimentAnalysis.positiveCount + sentimentAnalysis.neutralCount + sentimentAnalysis.concernCount || 1)) * 100}%` }}
              title="Cautionary / Blocked statements"
            />
          </div>

          {/* Breakdown legend */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {sentimentAnalysis.positiveCount} Positive
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-300 inline-block" />
              {sentimentAnalysis.neutralCount} Neutral
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
              {sentimentAnalysis.concernCount} Blockers
            </span>
          </div>
        </div>

        {/* Sentiment keywords cloud */}
        <div className="border-l border-slate-100 pl-0 md:pl-5 space-y-2">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Predominant Sentiment Drivers</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Top lexical keywords extracted from engineering, PR, and CBDO chat logs:
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {sentimentAnalysis.highlightWords.map(kw => (
              <span
                key={kw}
                className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 capitalize"
              >
                #{kw}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              #high-velocity
            </span>
          </div>
        </div>

        {/* Live quote snippet from TeamChat */}
        <div className="border-l border-slate-100 pl-0 md:pl-5 space-y-2">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
            <span>Recent Team Sentiment Sample</span>
          </div>
          {sentimentAnalysis.recentQuotes.length > 0 ? (
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span className="font-bold text-slate-700">{sentimentAnalysis.recentQuotes[0].sender}</span>
                <span className="font-mono text-indigo-600">{sentimentAnalysis.recentQuotes[0].channel}</span>
              </div>
              <p className="italic text-slate-600 text-[11px] line-clamp-2">
                "{sentimentAnalysis.recentQuotes[0].text}"
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No chat messages available yet for sampling.</p>
          )}
        </div>
      </div>
    </div>
  );
};
