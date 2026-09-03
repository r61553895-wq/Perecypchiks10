import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TopHeader, MobileBottomNav } from './components/TopHeader';
import { DashboardView } from './components/views/DashboardView';
import { MarketView } from './components/views/MarketView';
import { WarehouseView } from './components/views/WarehouseView';
import { SalesView } from './components/views/SalesView';
import { FinancesView } from './components/views/FinancesView';
import { UpgradesView } from './components/views/UpgradesView';
import { SettingsView } from './components/views/SettingsView';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { ListingModal } from './components/modals/ListingModal';
import { NegotiationModal } from './components/modals/NegotiationModal';
import { NotificationToast } from './components/NotificationToast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NavigationTab } from './types';

const GameContainer: React.FC = () => {
  const { currentTab, setCurrentTab, advanceDay } = useGame();

  // Keyboard Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        advanceDay();
      }

      const tabs: NavigationTab[] = [
        'dashboard', 
        'market', 
        'warehouse', 
        'sales', 
        'finances', 
        'upgrades', 
        'settings'
      ];

      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= tabs.length) {
        setCurrentTab(tabs[keyNum - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advanceDay, setCurrentTab]);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-zinc-50 font-sans text-zinc-900 antialiased selection:bg-zinc-200">
      {/* Top Header with Compact Navigation (Сводка | Рынок | Склад | Продажи | Финансы) */}
      <TopHeader />

      {/* Main Dynamic View Container */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-20 md:pb-8">
        {currentTab === 'dashboard' && <DashboardView />}
        {currentTab === 'market' && <MarketView />}
        {currentTab === 'warehouse' && <WarehouseView />}
        {currentTab === 'sales' && <SalesView />}
        {currentTab === 'finances' && <FinancesView />}
        {currentTab === 'upgrades' && <UpgradesView />}
        {currentTab === 'settings' && <SettingsView />}
      </main>

      {/* Mobile Bottom Navigation for Handheld Touch Devices */}
      <MobileBottomNav />

      {/* Global Modals & Overlays */}
      <NegotiationModal />
      <ProductDetailModal />
      <ListingModal />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <GameContainer />
      </GameProvider>
    </ErrorBoundary>
  );
}
