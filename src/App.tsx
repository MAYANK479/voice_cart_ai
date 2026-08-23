import React from 'react';
import { ShoppingProvider } from './context/ShoppingContext';
import { Header } from './components/Header';
import { VoiceAssistantHero } from './components/VoiceAssistant/VoiceAssistantHero';
import { ShoppingListView } from './components/ShoppingList/ShoppingListView';
import { BudgetTrackerWidget } from './components/Sidebar/BudgetTrackerWidget';
import { RestockWidget } from './components/Sidebar/RestockWidget';
import { CatalogModal } from './components/Modals/CatalogModal';
import { SmartSuggestionsModal } from './components/Modals/SmartSuggestionsModal';
import { HelpModal } from './components/Modals/HelpModal';
import { ToastContainer } from './components/UI/ToastContainer';

export const App: React.FC = () => {
  return (
    <ShoppingProvider>
      <div className="app-container">
        {/* Navigation & Actions Header */}
        <Header />

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

        {/* Interactive Modals */}
        <CatalogModal />
        <SmartSuggestionsModal />
        <HelpModal />

        {/* Global Toast Feedback Stack */}
        <ToastContainer />
      </div>
    </ShoppingProvider>
  );
};

export default App;
