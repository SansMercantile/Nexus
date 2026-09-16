import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, X, Activity, ShieldAlert, Sparkles, TrendingDown, Check } from 'lucide-react';

export interface VelocityAnomalyToastProps {
  currentVelocityScore: number;
  historicalAverageScore: number;
  lowerQuartileThreshold: number;
  currentWeekLabel: string;
}

export const VelocityAnomalyToast: React.FC<VelocityAnomalyToastProps> = ({
  currentVelocityScore,
  historicalAverageScore,
  lowerQuartileThreshold,
  currentWeekLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasNotifiedBrowser, setHasNotifiedBrowser] = useState(false);
  const [simulatedAnomaly, setSimulatedAnomaly] = useState(false);

  // Determine if anomaly is present
  const isAnomalyTriggered =
    simulatedAnomaly ||
    (currentVelocityScore < lowerQuartileThreshold && currentVelocityScore > 0);

  useEffect(() => {
    if (isAnomalyTriggered && !isDismissed) {
      setIsOpen(true);

      // Trigger browser native notification if permitted
      if (!hasNotifiedBrowser && typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          try {
            new Notification('⚠️ Deal Velocity Anomaly Detected', {
              body: `Current deal velocity (${currentVelocityScore} PTS) has dropped below lower quartile threshold (${lowerQuartileThreshold} PTS). Review stalled pipeline deals.`,
              icon: '/favicon.ico',
            });
            setHasNotifiedBrowser(true);
          } catch (err) {
            console.warn('Native notification failed', err);
          }
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(perm => {
            if (perm === 'granted') {
              try {
                new Notification('⚠️ Deal Velocity Anomaly Detected', {
                  body: `Deal velocity dropped to ${currentVelocityScore} PTS.`,
                });
                setHasNotifiedBrowser(true);
              } catch (e) {}
            }
          });
        }
      }
    }
  }, [isAnomalyTriggered, isDismissed, currentVelocityScore, lowerQuartileThreshold, hasNotifiedBrowser]);

  return (
    <>
      {/* Subtle anomaly warning banner / trigger button in the UI if dismissed or active */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setSimulatedAnomaly(!simulatedAnomaly);
            setIsDismissed(false);
            setIsOpen(true);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            isAnomalyTriggered
              ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
          }`}
          title="Toggle or inspect automated deal velocity anomaly monitoring"
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${isAnomalyTriggered ? 'text-amber-600' : 'text-slate-400'}`} />
          <span>
            {isAnomalyTriggered ? 'Velocity Anomaly: Active' : 'Anomaly Monitor: Normal'}
          </span>
          <span className="text-[10px] font-mono opacity-70">
            ({lowerQuartileThreshold} PTS Q1)
          </span>
        </button>
      </div>

      {/* Floating Anomaly Toast Notification Banner */}
      {isOpen && isAnomalyTriggered && (
        <div
          id="velocity-anomaly-toast"
          className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-amber-950/95 border-2 border-amber-500 text-white rounded-2xl shadow-2xl p-4.5 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 ring-4 ring-amber-500/20"
          role="alert"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 animate-bounce">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-amber-200 tracking-tight">
                    Deal Velocity Anomaly Detected
                  </h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-black bg-rose-500 text-white">
                    BELOW Q1
                  </span>
                </div>
                <p className="text-xs text-amber-100/90 mt-1 leading-relaxed">
                  Weekly velocity index is currently pacing at{' '}
                  <strong className="text-white font-mono">{simulatedAnomaly ? 62 : currentVelocityScore} PTS</strong>, which falls below the lower quartile threshold of{' '}
                  <strong className="text-amber-300 font-mono">{lowerQuartileThreshold} PTS</strong> (Historical average:{' '}
                  {historicalAverageScore} PTS).
                </p>
                <div className="mt-2.5 pt-2 border-t border-amber-500/30 flex items-center justify-between text-[11px]">
                  <span className="text-amber-300/80 font-medium">
                    Recommendation: Fast-track term sheets or schedule CBDO sync
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsDismissed(true);
              }}
              className="p-1 rounded-lg text-amber-300 hover:text-white hover:bg-amber-900/50 transition-colors shrink-0"
              title="Dismiss warning"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
