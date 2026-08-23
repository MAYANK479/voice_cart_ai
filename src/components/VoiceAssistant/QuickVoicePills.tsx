import React from 'react';
import { Sparkles, ShoppingBag, ArrowRight, RefreshCw, Trash2, Edit3, Search, Sun } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

export const QuickVoicePills: React.FC = () => {
  const { processTextInputCommand } = useShopping();

  const demoChips = [
    { label: 'Add 2 bottles of organic milk', icon: <ShoppingBag size={12} color="#10b981" /> },
    { label: 'Add 5 apples', icon: <ShoppingBag size={12} color="#34d399" /> },
    { label: 'Remove milk', icon: <Trash2 size={12} color="#f43f5e" /> },
    { label: 'Change apples quantity to 3', icon: <Edit3 size={12} color="#60a5fa" /> },
    { label: 'Find toothpaste under $5', icon: <Search size={12} color="#06b6d4" /> },
    { label: 'What should I restock?', icon: <RefreshCw size={12} color="#fbbf24" /> },
    { label: 'Suggest a substitute for butter', icon: <ArrowRight size={12} color="#a78bfa" /> },
    { label: 'What is in season today?', icon: <Sun size={12} color="#f59e0b" /> },
  ];

  return (
    <div className="demo-chips-wrapper">
      <div className="demo-chips-label">
        <Sparkles size={13} color="var(--accent-primary)" />
        <span>Try Demo Commands:</span>
      </div>
      <div className="voice-pills-container">
        {demoChips.map((chip, index) => (
          <button
            key={index}
            className="voice-pill-btn"
            onClick={() => processTextInputCommand(chip.label, 'demo')}
            title={`Click to test: "${chip.label}"`}
            aria-label={`Test command: ${chip.label}`}
          >
            {chip.icon}
            <span>"{chip.label}"</span>
          </button>
        ))}
      </div>
    </div>
  );
};

