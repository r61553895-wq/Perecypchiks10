import React from 'react';
import { useGame } from '../context/GameContext';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification } = useGame();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {notifications.map(n => {
        let Icon = Info;
        let borderClass = 'border-[#242f46] bg-[#141a29]/95 text-white shadow-xl';

        if (n.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-500/40 bg-[#101a24]/95 text-emerald-300 shadow-xl';
        } else if (n.type === 'warning') {
          Icon = AlertCircle;
          borderClass = 'border-amber-500/40 bg-[#1f1915]/95 text-amber-300 shadow-xl';
        } else if (n.type === 'deal') {
          Icon = Sparkles;
          borderClass = 'border-[#00d2aa]/40 bg-[#0d1c24]/95 text-[#00d2aa] shadow-xl';
        }

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border text-xs backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${
              n.type === 'success' ? 'text-emerald-400' :
              n.type === 'warning' ? 'text-amber-400' :
              n.type === 'deal' ? 'text-[#00d2aa]' : 'text-zinc-400'
            }`} />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-white">{n.title}</div>
              <div className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">{n.message}</div>
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="text-zinc-400 hover:text-white p-0.5 transition-colors cursor-pointer"
              title="Закрыть"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
