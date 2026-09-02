import React, { useState } from 'react';
import { 
  Settings, 
  RotateCcw, 
  Download, 
  Upload, 
  Keyboard, 
  Sliders, 
  Check, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const SettingsView: React.FC = () => {
  const { 
    gameSpeed, 
    setGameSpeed, 
    isAutoPlay, 
    setIsAutoPlay, 
    resetGame 
  } = useGame();

  const [confirmReset, setConfirmReset] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExportSave = () => {
    try {
      const data = localStorage.getItem('reseller_simulator_save_v1');
      if (data) {
        navigator.clipboard.writeText(data);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      }
    } catch {
      // ignore
    }
  };

  const handleImportSave = () => {
    try {
      if (!importText.trim()) return;
      JSON.parse(importText);
      localStorage.setItem('reseller_simulator_save_v1', importText);
      setImportStatus('success');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      setImportStatus('error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Simulation Controls */}
      <div className="p-6 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <Sliders className="w-4 h-4 text-zinc-900" />
          <h2 className="text-sm font-bold text-zinc-900">Параметры симуляции</h2>
        </div>
        <p className="text-xs text-zinc-500 mb-4">Настройка скорости течения рыночных дней и авто-хода</p>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-zinc-100">
            <div>
              <div className="font-semibold text-zinc-900">Скорость авто-хода</div>
              <div className="text-[11px] text-zinc-500">Интервал автоматической смены дней</div>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map(speed => (
                <button
                  key={speed}
                  onClick={() => setGameSpeed(speed)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
                    gameSpeed === speed 
                      ? 'bg-zinc-900 text-white border-zinc-900' 
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  {speed}x {speed === 1 ? '(3с)' : speed === 2 ? '(1.8с)' : '(0.9с)'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-semibold text-zinc-900">Фоновый авто-ход</div>
              <div className="text-[11px] text-zinc-500">Автоматическое продвижение дней без клика</div>
            </div>
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isAutoPlay 
                  ? 'bg-amber-50 text-amber-700 border-amber-300' 
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
              }`}
            >
              {isAutoPlay ? 'Активен (Пауза)' : 'Приостановлен'}
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <div className="p-6 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <Keyboard className="w-4 h-4 text-zinc-900" />
          <h2 className="text-sm font-bold text-zinc-900">Горячие клавиши</h2>
        </div>
        <p className="text-xs text-zinc-500 mb-4">Быстрая навигация без отрыва от клавиатуры</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/60">
            <span className="text-zinc-600">Следующий день / Пауза:</span>
            <kbd className="px-2 py-1 rounded bg-white border border-zinc-300 font-mono text-[11px] font-semibold text-zinc-800 shadow-2xs">
              Пробел (Space)
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/60">
            <span className="text-zinc-600">Переключение вкладок:</span>
            <div className="flex gap-1">
              <kbd className="px-1.5 py-1 rounded bg-white border border-zinc-300 font-mono text-[11px] font-semibold text-zinc-800 shadow-2xs">1</kbd>
              <span className="text-zinc-400">..</span>
              <kbd className="px-1.5 py-1 rounded bg-white border border-zinc-300 font-mono text-[11px] font-semibold text-zinc-800 shadow-2xs">7</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Backup & Save State Management */}
      <div className="p-6 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
        <div className="flex items-center gap-2 mb-1">
          <Download className="w-4 h-4 text-zinc-900" />
          <h2 className="text-sm font-bold text-zinc-900">Сохранение прогресса</h2>
        </div>
        <p className="text-xs text-zinc-500 mb-4">Игра автоматически сохраняет все данные в локальное хранилище браузера</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportSave}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-colors"
          >
            {copySuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-zinc-400" />}
            <span>{copySuccess ? 'Скопировано в буфер!' : 'Скопировать код сохранения'}</span>
          </button>
        </div>

        {/* Import JSON */}
        <div className="mt-4 pt-4 border-t border-zinc-100">
          <label className="block text-xs font-medium text-zinc-700 mb-1.5">
            Восстановить прогресс из кода:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Вставьте JSON сохранения..."
              value={importText}
              onChange={e => setImportText(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono bg-zinc-50/50"
            />
            <button
              onClick={handleImportSave}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
            >
              Загрузить
            </button>
          </div>
          {importStatus === 'error' && (
            <div className="text-[11px] text-rose-600 mt-1.5">Ошибка: некорректный JSON</div>
          )}
        </div>
      </div>

      {/* Danger Zone: Reset Game */}
      <div className="p-6 rounded-xl bg-white border border-rose-200 shadow-2xs">
        <div className="flex items-center gap-2 mb-1 text-rose-700">
          <AlertTriangle className="w-4 h-4" />
          <h2 className="text-sm font-bold">Сброс бизнес-прогресса</h2>
        </div>
        <p className="text-xs text-zinc-500 mb-4">
          Очистить все транзакции, склад и начать заново со стартовым капиталом 125,000 ₽.
        </p>

        {confirmReset ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetGame();
                setConfirmReset(false);
              }}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              Да, сбросить все данные
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-3 py-2 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 text-xs font-medium transition-colors"
            >
              Отмена
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить симуляцию</span>
          </button>
        )}
      </div>
    </div>
  );
};
