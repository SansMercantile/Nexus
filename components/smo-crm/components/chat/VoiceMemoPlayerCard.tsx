import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  CheckSquare, 
  Square, 
  FileText,
  Clock,
  Radio,
  Share2,
  Check
} from 'lucide-react';
import { VoiceMemoRecord } from '../../types';

interface VoiceMemoPlayerCardProps {
  voiceMemo: VoiceMemoRecord;
  searchTerm?: string;
  onTopicClick?: (topic: string) => void;
}

export const VoiceMemoPlayerCard: React.FC<VoiceMemoPlayerCardProps> = ({
  voiceMemo,
  searchTerm,
  onTopicClick,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 100
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [actionItemsCompleted, setActionItemsCompleted] = useState<Record<number, boolean>>({});
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const duration = voiceMemo.durationSeconds || 32;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentTimeSeconds = (playbackProgress / 100) * duration;

  // Handle synthetic playback simulation if no real audio URL
  useEffect(() => {
    if (isPlaying) {
      const stepIntervalMs = 100;
      const totalSteps = (duration * 1000) / stepIntervalMs;
      const stepIncrement = 100 / totalSteps;

      timerRef.current = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + stepIncrement;
        });
      }, stepIntervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    if (voiceMemo.audioBlobUrl && audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.warn('Audio play error, falling back to simulated playback:', err);
          setIsPlaying(!isPlaying);
        });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioElementRef.current && audioElementRef.current.duration) {
      const pct = (audioElementRef.current.currentTime / audioElementRef.current.duration) * 100;
      setPlaybackProgress(pct);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlaybackProgress(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPct = Math.max(0, Math.min(100, (clickX / width) * 100));
    setPlaybackProgress(newPct);

    if (audioElementRef.current && audioElementRef.current.duration) {
      audioElementRef.current.currentTime = (newPct / 100) * audioElementRef.current.duration;
    }
  };

  const toggleActionItem = (idx: number) => {
    setActionItemsCompleted(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(voiceMemo.transcript);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  // Waveform bars generator
  const bars = [25, 45, 75, 90, 60, 40, 70, 85, 95, 60, 30, 50, 80, 100, 65, 45, 80, 55, 35, 70, 90, 60, 40, 30];

  return (
    <div className="mt-2.5 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 p-3.5 shadow-2xs text-xs space-y-3 max-w-xl">
      {/* Real audio element if URL exists */}
      {voiceMemo.audioBlobUrl && (
        <audio
          ref={audioElementRef}
          src={voiceMemo.audioBlobUrl}
          onTimeUpdate={handleAudioTimeUpdate}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}

      {/* Header with Voice Memo Indicator & Speaker */}
      <div className="flex items-center justify-between pb-2 border-b border-indigo-100/80">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900">Voice Memo & Knowledge Record</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                Bedrock Indexed
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              Recorded by <strong className="text-slate-700">{voiceMemo.speakerName}</strong> • {new Date(voiceMemo.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyTranscript}
            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white/80 transition-colors"
            title="Copy verbatim transcript"
          >
            {copiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Audio Player Controls & Waveform */}
      <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <button
          type="button"
          onClick={togglePlay}
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all shadow-xs shrink-0 cursor-pointer ${
            isPlaying ? 'bg-indigo-700 ring-2 ring-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          title={isPlaying ? 'Pause memo' : 'Play memo'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>

        {/* Waveform Scrubber */}
        <div className="flex-1 space-y-1">
          <div 
            onClick={handleSeek}
            className="h-8 flex items-center gap-[2.5px] cursor-pointer group py-1"
            title="Click to scrub playback position"
          >
            {bars.map((height, i) => {
              const barPct = (i / bars.length) * 100;
              const isPlayed = barPct <= playbackProgress;
              return (
                <div
                  key={i}
                  className="flex-1 flex items-center justify-center h-full"
                >
                  <div
                    className={`w-full rounded-full transition-all duration-150 ${
                      isPlayed 
                        ? 'bg-indigo-600 group-hover:bg-indigo-700' 
                        : 'bg-slate-200 group-hover:bg-slate-300'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono font-semibold">
            <span>{formatTime(currentTimeSeconds)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Indexed AI Executive Summary */}
      {voiceMemo.indexedSummary && (
        <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>AI Knowledge Index Summary</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-700 font-medium">
            {voiceMemo.indexedSummary}
          </p>
        </div>
      )}

      {/* Key Topics Badges / Chips */}
      {voiceMemo.keyTopics && voiceMemo.keyTopics.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-400" /> Topics:
          </span>
          {voiceMemo.keyTopics.map((topic, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onTopicClick?.(topic)}
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 transition-colors shadow-2xs cursor-pointer"
            >
              #{topic.replace(/^#/, '')}
            </button>
          ))}
        </div>
      )}

      {/* Action Items Checklist */}
      {voiceMemo.actionItems && voiceMemo.actionItems.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Indexed Action Items ({voiceMemo.actionItems.length}):
          </div>
          <div className="space-y-1">
            {voiceMemo.actionItems.map((item, idx) => {
              const isChecked = !!actionItemsCompleted[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleActionItem(idx)}
                  className={`flex items-start gap-2 p-1.5 rounded-md cursor-pointer transition-colors text-[11px] ${
                    isChecked ? 'bg-slate-100/80 text-slate-400 line-through' : 'hover:bg-white/80 text-slate-700'
                  }`}
                >
                  <span className="mt-0.5 text-indigo-600 shrink-0">
                    {isChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                  </span>
                  <span className="leading-snug">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expandable Verbatim Transcript */}
      <div className="pt-1 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowFullTranscript(!showFullTranscript)}
          className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-500 hover:text-indigo-600 transition-colors py-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-slate-400" />
            <span>Verbatim Transcription</span>
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            {showFullTranscript ? 'Hide' : 'Read full text'}
            {showFullTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </span>
        </button>

        {showFullTranscript && (
          <div className="mt-1.5 p-3 rounded-lg bg-white border border-slate-200 text-slate-800 text-[11px] leading-relaxed font-normal whitespace-pre-wrap animate-in fade-in duration-150">
            {voiceMemo.transcript}
          </div>
        )}
      </div>
    </div>
  );
};
