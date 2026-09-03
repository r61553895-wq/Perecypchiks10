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
import { AuctionsView } from './components/views/AuctionsView';
import { ClientsView } from './components/views/ClientsView';
import { ShowroomView } from './components/views/ShowroomView';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { ListingModal } from './components/modals/ListingModal';
import { NegotiationModal } from './components/modals/NegotiationModal';
import { NotificationToast } from './components/NotificationToast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NavigationTab } from './types';

const GameContainer: React.FC = () => {
  const { currentTab, setCurrentTab, advanceDay, deviceFrame, theme } = useGame();

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
        'auctions',
        'warehouse', 
        'finances'
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
    <div className={`min-h-screen w-full flex items-center justify-center transition-colors duration-200 ${
      deviceFrame ? 'bg-slate-100 dark:bg-[#070C18] sm:py-6 sm:px-4' : 'bg-[#F8FAFC] dark:bg-[#0B1120]'
    }`}>
      {/* Mobile Device Frame or Responsive Container */}
      <div className={`w-full flex flex-col transition-all duration-300 ${
        deviceFrame 
          ? 'max-w-[440px] h-[100dvh] sm:h-[900px] sm:max-h-[92vh] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 dark:sm:border-slate-700/80 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden bg-[#F8FAFC] dark:bg-[#0B1120]' 
          : 'max-w-2xl min-h-screen sm:min-h-[100dvh] bg-[#F8FAFC] dark:bg-[#0B1120] relative shadow-lg'
      }`}>
        
        {/* Hardware Dynamic Island Notch (Only in device frame on desktop) */}
        {deviceFrame && (
          <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 items-center justify-end px-2 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/50" />
          </div>
        )}

        {/* Top Header with Compact Navigation & Fast Actions */}
        <TopHeader />

        {/* Main Dynamic View Container with smooth vertical scroll */}
        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden p-3.5 sm:p-4 pb-32 overscroll-contain no-scrollbar">
          {currentTab === 'dashboard' && <DashboardView />}
          {currentTab === 'market' && <MarketView />}
          {currentTab === 'auctions' && <AuctionsView />}
          {currentTab === 'warehouse' && <WarehouseView />}
          {currentTab === 'showroom' && <ShowroomView />}
          {currentTab === 'clients' && <ClientsView />}
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
