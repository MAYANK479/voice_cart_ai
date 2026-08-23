import React from 'react';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { LANGUAGE_EXAMPLE_PROMPTS } from '../../data/languageData';

export const QuickVoicePills: React.FC = () => {
  const { currentLanguage, processTextInputCommand } = useShopping();
  const prompts = LANGUAGE_EXAMPLE_PROMPTS[currentLanguage] || LANGUAGE_EXAMPLE_PROMPTS['en-US'];

  const pillCommands = [
    { label: prompts.addSample, icon: <ShoppingBag size={13} /> },
    { label: prompts.searchSample, icon: <Sparkles size={13} /> },
    { label: prompts.substituteSample, icon: <ArrowRight size={13} /> },
    { label: prompts.seasonalSample, icon: <Sparkles size={13} /> },
  ];

  return (
    <div className="voice-pills-container">
      {pillCommands.map((item, index) => (
        <button
          key={index}
          className="voice-pill-btn"
          onClick={() => processTextInputCommand(item.label)}
          title={`Click to simulate voice command: "${item.label}"`}
        >
          {item.icon}
          <span>"{item.label}"</span>
        </button>
      ))}
    </div>
  );
};
