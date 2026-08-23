import React from 'react';
import { ShoppingProvider, useShopping } from './context/ShoppingContext';
import { Header } from './components/Header';
import { VoiceAssistantHero } from './components/VoiceAssistant/VoiceAssistantHero';
import { ShoppingListView } from './components/ShoppingList/ShoppingListView';
import { BudgetTrackerWidget } from './components/Sidebar/BudgetTrackerWidget';
import { RestockWidget } from './components/Sidebar/RestockWidget';
import { CatalogModal } from './components/Modals/CatalogModal';
import { SmartSuggestionsModal } from './components/Modals/SmartSuggestionsModal';
import { HelpModal } from './components/Modals/HelpModal';
import { BuildMyListModal } from './components/Modals/BuildMyListModal';
import { ToastContainer } from './components/UI/ToastContainer';
import { InsightsView } from './components/Insights/InsightsView';
import { HistoryView } from './components/History/HistoryView';
import { NlpPlaygroundView } from './components/NlpLab/NlpPlaygroundView';
import { CheckoutView } from './components/Checkout/CheckoutView';

import { CategoriesCarousel } from './components/Grocery/CategoriesCarousel';

import { PopularProductsGrid } from './components/Grocery/PopularProductsGrid';
import { DiscountBanners } from './components/Grocery/DiscountBanners';

const AppContent: React.FC = () => {
  const { activeView } = useShopping();

  return (
    <div className="app-container">
      {/* Navigation & Actions Header */}
      <Header />

      {/* Dynamic View Router */}
      {activeView === 'dashboard' && (
        <>
          {/* Voice Assistant Visualizer Hero */}
          <VoiceAssistantHero />

          {/* Grocery Categories Horizontal Carousel */}
          <CategoriesCarousel />

          {/* Popular Products Carousel & Fast Add Grid */}
          <PopularProductsGrid />

          {/* Discount & Promo Deals */}
          <DiscountBanners />

          {/* Main Workspace Dashboard Grid */}
          <main className="dashboard-grid">
            {/* Main Column: Auto-Categorized Shopping List with Multi-Lists */}
            <ShoppingListView />

            {/* Right Column: Smart Intelligence & Budget Sidebar */}
            <aside className="sidebar-panel">
              <BudgetTrackerWidget />
              <RestockWidget />
            </aside>
          </main>
        </>
      )}


      {activeView === 'insights' && <InsightsView />}

      {activeView === 'history' && <HistoryView />}

      {activeView === 'nlp-lab' && <NlpPlaygroundView />}

      {activeView === 'checkout' && <CheckoutView />}


      {/* Interactive Modals */}
      <CatalogModal />
      <SmartSuggestionsModal />
      <BuildMyListModal />
      <HelpModal />

      {/* Global Toast Feedback Stack */}
      <ToastContainer />
    </div>
  );
};


export const App: React.FC = () => {
  return (
    <ShoppingProvider>
      <AppContent />
    </ShoppingProvider>
  );
};

export default App;

