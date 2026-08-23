import React, { useState } from 'react';
import { CornerDownLeft } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';


export const TextFallbackBar: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { processTextInputCommand } = useShopping();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    processTextInputCommand(inputValue);
    setInputValue('');
  };

  return (
    <form className="text-input-bar-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="text-command-input"
        placeholder="Type or voice command (e.g., 'Add 2 bottles of water' or 'Find apples under $5')..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit" className="btn-send-command" title="Execute command">
        <span>Execute</span>
        <CornerDownLeft size={14} />
      </button>
    </form>
  );
};
