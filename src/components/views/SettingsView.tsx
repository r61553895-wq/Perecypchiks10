import React, { useState } from 'react';
import { 
  Settings, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  AlertTriangle,
  Sun,
  Moon,
  Smartphone,
  PieChart,
  Zap,
  History
} from 'lucide-react';
import { useGame, STORAGE_KEY, LEGACY_STORAGE_KEY } from '../../context/GameContext';

export const SettingsView: React.FC = () => {
  const { 
    gameSpeed, 
    setGameSpeed, 
    isAutoPlay, 
    setIsAutoPlay, 
    resetGame,
    theme,
    toggleTheme,
    deviceFrame,
    setDeviceFrame,
    setCurrentTab
  } = useGame();

  const [confirmReset, setConfirmReset] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExportSave = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
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
      localStorage.setItem(STORAGE_KEY, importText);
      localStorage.setItem(LEGACY_STORAGE_KEY, importText);
      setImportStatus('success');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      setImportStatus('error');
    }
  };

  return (
    <div className="space-y-4 max-w-full pb-8 select-none">
      {/* Sub-navigation Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#131C31] rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
        <button
          onClick={() => setCurrentTab('finances')}
          className="flex-1 py-2 px-2 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-1"
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>P&L</span>
        </button>

        <button
          onClick={() => setCurrentTab('upgrades')}
          className="flex-1 py-2 px-2 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-1"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Навыки</span>
        </button>

        <button
          onClick={() => setCurrentTab('sales')}
          className="flex-1 py-2 px-2 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-1"
        >
          <History className="w-3.5 h-3.5" />
          <span>Сделки</span>
        </button>

        <button
          className="flex-1 py-2 px-2 rounded-xl font-bold bg-white dark:bg-[#18233C] text-blue-600 dark:text-blue-400 shadow-xs transition-all flex items-center justify-center gap-1"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Опции</span>
        </button>
      </div>

      {/* Visual & Experience Settings */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Внешний вид приложения
        </h3>

        <div className="space-y-2">
          {/* Theme Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Тема оформления</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {theme === 'dark' ? 'Премиум ночной режим (Navy)' : 'Светлый чистый интерфейс'}
                </div>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs"
            >
              {theme === 'dark' ? 'Тёмная' : 'Светлая'}
            </button>
          </div>

          {/* Device Frame Toggle (Desktop) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Мобильный корпус</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Эмуляция смартфона флагмана на широких экранах
                </div>
              </div>
            </div>

            <button
              onClick={() => setDeviceFrame(!deviceFrame)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                deviceFrame 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {deviceFrame ? 'Включен' : 'Отключен'}
            </button>
          </div>
        </div>
      </div>

      {/* Backup and Data Management */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Сохранения и данные
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportSave}
            className="h-11 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
          >
            {copySuccess ? <Check className="w-4 h-4 text-emerald-500" /> : <Download className="w-4 h-4 text-blue-600" />}
            <span>{copySuccess ? 'Скопировано!' : 'Экспорт сейва'}</span>
          </button>

          <button
            onClick={() => setConfirmReset(!confirmReset)}
            className="h-11 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Сброс карьеры</span>
          </button>
        </div>

        {confirmReset && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-200">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Вы уверены, что хотите начать заново? Прогресс будет очищен.</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetGame}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Да, начать заново
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
