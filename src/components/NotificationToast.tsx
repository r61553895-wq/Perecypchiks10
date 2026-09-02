import React from 'react';
import { useGame } from '../context/GameContext';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification } = useGame();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-16 md:bottom-5 right-4 md:right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {notifications.map(n => {
        let Icon = Info;
        let borderClass = 'border-zinc-200 bg-white text-zinc-900 shadow-lg';

        if (n.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-200 bg-white text-zinc-900 shadow-md';
        } else if (n.type === 'warning') {
          Icon = AlertCircle;
          borderClass = 'border-amber-200 bg-white text-zinc-900 shadow-md';
        } else if (n.type === 'deal') {
          Icon = Sparkles;
          borderClass = 'border-indigo-200 bg-white text-zinc-900 shadow-md';
        }

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border text-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${
              n.type === 'success' ? 'text-emerald-600' :
              n.type === 'warning' ? 'text-amber-600' :
              n.type === 'deal' ? 'text-indigo-600' : 'text-zinc-500'
            }`} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs text-zinc-900">{n.title}</div>
              <div className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{n.message}</div>
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="text-zinc-400 hover:text-zinc-700 p-0.5 transition-colors"
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
