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
import { ToastContainer } from './components/UI/ToastContainer';
import { InsightsView } from './components/Insights/InsightsView';
import { HistoryView } from './components/History/HistoryView';
import { NlpPlaygroundView } from './components/NlpLab/NlpPlaygroundView';

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

          {/* Main Workspace Dashboard Grid */}
          <main className="dashboard-grid">
            {/* Main Column: Auto-Categorized Shopping List */}
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

      {/* Interactive Modals */}
      <CatalogModal />
      <SmartSuggestionsModal />
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

